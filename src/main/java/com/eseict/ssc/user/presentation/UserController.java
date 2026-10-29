package com.eseict.ssc.user.presentation;

import com.eseict.ssc.config.ApiConstants;
import com.eseict.ssc.user.application.dto.RoleInfo;
import com.eseict.ssc.user.application.dto.UserResult;
import com.eseict.ssc.user.application.service.UserQueryService;
import io.swagger.annotations.ApiOperation;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.IOException;
import java.util.Collections;
import java.util.Map;

/**
 * UserController (refac) — 사용자 정보 조회
 *
 * 기존: /newUser (UserController) → UserService 혼재
 * 개선:
 *   - UserQueryService 로 위임 (CQRS 조회 측)
 *   - produces 명시
 */
@Slf4j
@RequiredArgsConstructor
@RestController
@RequestMapping(value = "/user", produces = ApiConstants.Common.API_PRODUCES)
public class UserController {

    private final UserQueryService userQueryService;

    @ApiOperation(value = "사용자 정보", notes = "로그인 시 가져오는 사용자 정보")
    @GetMapping("/info")
    public ResponseEntity<UserResult> getUserInfo(
            @RequestParam(value = "token", required = false) String token,
            HttpServletResponse response,
            HttpSession session) {

        if (token == null || token.isEmpty()) {
            log.info("token is empty. -> redirect to login page");
            try {
                response.sendRedirect("/oms/login/getLoginView");
            } catch (IOException e) {
                log.error("Error on redirect login page: {}", e.getMessage());
                throw new RuntimeException(e);
            }
            return ResponseEntity.ok(new UserResult());
        }
        return ResponseEntity.ok(userQueryService.getUser(token));
    }

    @ApiOperation(value = "사용자 권한", notes = "지역 및 이벤트 권한")
    @GetMapping("/role")
    public ResponseEntity<RoleInfo> getUserRole() {
        return ResponseEntity.ok(userQueryService.getRoleInfo());
    }

    /**
     * 토큰 keep-alive — /sc/mng 페이지에 머무는 동안 OMS 세션이 끊기지 않도록 프론트가 주기 호출.
     *
     * 동작 원리:
     *   - OMS LoginCache 는 Guava CacheBuilder.expireAfterAccess(30분) 로 구성.
     *   - 이 엔드포인트가 내부적으로 OMS /api/user/chkTokenAlive 를 호출하면
     *     캐시 read 가 발생해 TTL 이 해당 시점부터 30분으로 재설정됨(sliding).
     *   - 따라서 프론트가 15~20분 간격으로 이 API 를 호출하는 것만으로 세션이 유지된다.
     *
     * 응답:
     *   - 토큰 유효 → 200 OK {"alive": true}
     *   - 토큰 만료/무효 → 401 Unauthorized (프론트 apiClient 가 OMS 로그인으로 redirect)
     */
    @ApiOperation(value = "토큰 유효성 재확인 (keep-alive)",
            notes = "호출 자체가 OMS TTL 을 30분 연장한다. /sc/mng 상주 시 주기 호출.")
    @GetMapping("/tokenAlive")
    public ResponseEntity<Map<String, Boolean>> chkTokenAlive(
            @RequestParam(value = "token", required = false) String token) {

        if (!userQueryService.isTokenAlive(token)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        return ResponseEntity.ok(Collections.singletonMap("alive", true));
    }
}
