package com.eseict.ssc.user.presentation;

import com.eseict.ssc.config.ApiConstants;
import com.eseict.ssc.user.application.service.UserCommandService;
import com.eseict.ssc.user.application.service.UserQueryService;
import com.google.common.base.Strings;
import io.swagger.annotations.ApiOperation;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.IOException;

/**
 * ViewController (refac) — 뷰 라우팅 및 로그아웃
 *
 * 기존: /sc/mng 등 (ViewController) → UserService 혼재
 * 개선:
 *   - 로그아웃 → UserCommandService 위임 (CQRS 명령 측)
 *   - 뷰 라우팅 경로는 기존과 동일 유지 (프론트 연동)
 */
@Controller
@Slf4j
@RequiredArgsConstructor
@RequestMapping(value = "", produces = ApiConstants.Common.API_PRODUCES)
public class ViewController {

    private final UserCommandService userCommandService;
    private final UserQueryService   userQueryService;

    /**
     * 토큰 cookie 후보 이름.
     * - "token"           : 현재 SSC / OMS 공통
     * - "TOKEN"/"_TOKEN_"/"_TO_KEN_" : OMS 가 셋팅하는 변종
     */
    private static final String[] TOKEN_COOKIE_NAMES = {"token", "TOKEN", "_TOKEN_", "_TO_KEN_"};

    /**
     * 토큰 cookie 후보 path.
     *
     * 같은 이름 cookie 도 path 가 다르면 브라우저에서 별개 cookie 로 보존된다.
     * 브라우저는 Cookie: 헤더에 path 를 안 보내므로 (RFC 6265), 서버가 모든 후보 path 로
     * Set-Cookie(Max-Age=0) 를 내려 일괄 만료시켜야 한다.
     *
     * - "/"        : 현재 refac 코드가 셋팅하는 표준 path
     * - "/ssc/sc"  : refac 이전 코드(=setPath() 미지정) 잔재. 컨텍스트(/ssc) + 서블릿(/sc/...) 의 부모.
     * - 그 외      : OMS 와 공유 가능한 후보.
     */
    private static final String[] TOKEN_COOKIE_PATHS = {"/", "/ssc", "/ssc/sc", "/sc", "/sc/mng", "/oms"};

    /** 토큰 후보 cookie 를 모든 (이름 × path) 조합으로 만료시킨다. */
    private static void clearTokenCookies(HttpServletResponse response) {
        for (String name : TOKEN_COOKIE_NAMES) {
            for (String path : TOKEN_COOKIE_PATHS) {
                Cookie expired = new Cookie(name, "");
                expired.setPath(path);
                expired.setMaxAge(0);
                response.addCookie(expired);
            }
        }
    }

    @ApiOperation(value = "운영 대시보드")
    @RequestMapping("/sc/mng")
    public String scMngView(
            @RequestParam(required = false, defaultValue = "", value = "token") String token,
            HttpServletRequest request,
            HttpServletResponse response) {

        HttpSession session = request.getSession();
        String sessionToken = "";

        // 1. 세션에서 추출
        if (session.getAttribute("__TOKEN__") != null
                && !session.getAttribute("__TOKEN__").toString().isEmpty()) {
            sessionToken = session.getAttribute("__TOKEN__").toString();
        } else if (session.getAttribute("token") != null
                && !session.getAttribute("token").toString().isEmpty()) {
            sessionToken = session.getAttribute("token").toString();
        }
        // 2. URL 파라미터에서 추출
        else if (!Strings.isNullOrEmpty(token)) {
            sessionToken = token;
        }
        // 3. 쿠키에서 추출 (OMS가 쿠키로 token을 전달하는 경우 — 이름 후보 전부 체크)
        else {
            Cookie[] cookies = request.getCookies();
            if (cookies != null) {
                for (Cookie c : cookies) {
                    String name = c.getName();
                    if (("token".equals(name) || "TOKEN".equals(name)
                            || "_TOKEN_".equals(name) || "_TO_KEN_".equals(name))
                            && !Strings.isNullOrEmpty(c.getValue())) {
                        log.info("token found in cookie: name={}", name);
                        sessionToken = c.getValue();
                        break;
                    }
                }
            }
        }

        if (sessionToken.isEmpty()) {
            log.info("token is empty. -> redirect to login page");
            try {
                response.sendRedirect("/oms/login/getLoginView");
            } catch (IOException e) {
                log.error("Error on redirect login page: {}", e.getMessage());
                throw new RuntimeException(e);
            }
            return "index";
        }

        // OMS tokenAlive 검증 (페이지 진입 시 1회만 수행. API 호출마다 반복 호출 금지.)
        if (!userQueryService.isTokenAlive(sessionToken)) {
            log.info("token is not alive. -> redirect to login page");
            // 세션/쿠키 정리 후 OMS 로그인으로 이동
            session.invalidate();
            clearTokenCookies(response);   // path 후보군 전체 만료 (옛 /ssc/sc 잔재 포함)
            try {
                response.sendRedirect("/oms/login/getLoginView");
            } catch (IOException e) {
                log.error("Error on redirect login page: {}", e.getMessage());
                throw new RuntimeException(e);
            }
            return "index";
        }

        // 검증 통과 → 세션/쿠키에 저장해 이후 API 요청에서 인터셉터가 세션으로 찾을 수 있게
        session.setAttribute("__TOKEN__", sessionToken);
        Cookie tokenCookie = new Cookie("token", sessionToken);
        tokenCookie.setPath("/");
        response.addCookie(tokenCookie);
        return "index";
    }

    @ApiOperation(value = "경로당 화면")
    @GetMapping("/sc/social/{scNm}")
    public String scSocialView(HttpServletRequest request, HttpServletResponse response,
                                @PathVariable(value = "scNm") String scNm) {
        return "index";
    }

    @ApiOperation(value = "엑셀 일괄 업로드 화면")
    @GetMapping("/sc/fac/excel")
    public String scFacExcelView() {
        return "index";
    }

    @ApiOperation(value = "공지 화면 (가로 화면)")
    @GetMapping("/sc/noti/{scNm}")
    public String scNotiView(@PathVariable String scNm) {
        return "index";
    }

    @GetMapping("/sc/conf")
    public String scConferenceView(
            @RequestParam(required = false, defaultValue = "", value = "token") String token,
            HttpServletRequest request,
            HttpServletResponse response) {

        HttpSession session = request.getSession();
        session.setAttribute("__TOKEN__", token);
        session.setAttribute("token", token);
        Cookie confTokenCookie = new Cookie("token", token);
        confTokenCookie.setPath("/");
        response.addCookie(confTokenCookie);
        return "index";
    }

    /**
     * 로그아웃.
     *
     * 정책:
     *   1) OMS doLogout 호출 (토큰 있을 때만)
     *   2) OMS 응답과 무관하게 항상 세션/쿠키 정리 (finally)
     *      - session.invalidate() : __TOKEN__, token attribute 제거
     *      - clearTokenCookies()  : token 계열 cookie 를 모든 후보 path 로 만료
     *        ↑ refac 이전 코드가 setPath() 없이 셋팅한 /ssc/sc 잔재까지 박멸
     *
     * 반환:
     *   - 성공 시 OMS redirect URL (프론트가 window.location.href 로 이동)
     *   - 실패/토큰 없음 → 빈 문자열
     */
    @ApiOperation(value = "로그아웃")
    @PostMapping("/logout")
    @ResponseBody
    public String doLogout(
            @RequestParam(value = "token", required = false) String token,
            HttpServletRequest request,
            HttpServletResponse response,
            HttpSession session) {

        log.info("request logout");
        if (Strings.isNullOrEmpty(token)) {
            token = (String) session.getAttribute("__TOKEN__");
        }

        String redirectUrl = "";
        try {
            if (ApiConstants.IS_DEV.equals(ApiConstants.IsDev.DEV)) {
                log.info("logout success in dev mode");
            } else if (!Strings.isNullOrEmpty(token)) {
                redirectUrl = userCommandService.doLogout(token);
                if (redirectUrl.isEmpty()) {
                    log.info("logout failed (OMS)");
                } else {
                    log.info("redirect logout url: {}", redirectUrl);
                }
            }
        } finally {
            // OMS 호출 성공/실패와 무관하게 로컬 세션/쿠키는 반드시 정리
            try { session.invalidate(); } catch (IllegalStateException ignored) {}
            clearTokenCookies(response);
        }
        return redirectUrl;
    }
}
