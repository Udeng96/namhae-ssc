package com.eseict.ssc.user.presentation;

import com.eseict.ssc.config.ApiConstants;
import com.eseict.ssc.user.application.dto.RoleInfo;
import com.eseict.ssc.user.application.dto.UserResult;
import com.eseict.ssc.user.application.service.UserQueryService;
import io.swagger.annotations.ApiOperation;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.IOException;

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
}
