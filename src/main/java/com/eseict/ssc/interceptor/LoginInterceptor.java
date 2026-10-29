package com.eseict.ssc.interceptor;

import com.eseict.ssc.config.ApiConstants;
import com.google.common.base.Strings;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

/**
 * 세션 토큰 존재 여부 검사 인터셉터.
 *
 * - 개발 모드(IS_DEV=true): 무조건 통과
 * - 운영 모드:
 *   1. 세션/파라미터/쿠키에서 토큰 추출
 *   2. 토큰 있으면 통과 (OMS 검증은 페이지 진입 시 ViewController.scMngView에서 1회 수행)
 *   3. 토큰 없으면:
 *      - AJAX/API → 401 반환 (프론트가 OMS 로그인으로 이동)
 *      - 페이지   → OMS 로그인 페이지로 redirect
 *
 * 주의: 매 API 요청마다 OMS tokenAlive를 호출하면 성능이 급격히 저하된다(OMS 응답시간 × 요청수).
 *      토큰 유효성은 ViewController.scMngView 진입 시 1회 검증으로 충분하며,
 *      세션 만료 시 프론트(apiClient 401 핸들러)가 로그인으로 유도한다.
 */
@Slf4j
@Component
public class LoginInterceptor implements HandlerInterceptor {

    /** 토큰 cookie 후보 이름. ViewController.TOKEN_COOKIE_NAMES 와 동기화 유지. */
    private static final String[] TOKEN_COOKIE_NAMES = {"token", "TOKEN", "_TOKEN_", "_TO_KEN_"};

    /**
     * 토큰 cookie 후보 path. ViewController.TOKEN_COOKIE_PATHS 와 동기화 유지.
     * 같은 이름이라도 path 가 다르면 별개 cookie 이므로 후보군 전체로 만료 Set-Cookie 를 보낸다.
     * "/ssc/sc" 는 refac 이전 코드(setPath 미지정) 가 남긴 잔재 경로.
     */
    private static final String[] TOKEN_COOKIE_PATHS = {"/", "/ssc", "/ssc/sc", "/sc", "/sc/mng", "/oms"};

    @Override
    public boolean preHandle(HttpServletRequest request,
                             HttpServletResponse response,
                             Object handler) throws Exception {

        // 개발 모드는 토큰 검사 생략
        if (ApiConstants.IS_DEV.equals(ApiConstants.IsDev.DEV)) {
            return true;
        }

        String token = extractToken(request);

        // 토큰 없음 → 접근 차단
        if (Strings.isNullOrEmpty(token)) {
            log.debug("Token is empty → deny. uri={}", request.getRequestURI());
            return denyOrRedirect(request, response);
        }

        return true;
    }

    // ── private helpers ───────────────────────────────────────────────────────

    /**
     * 세션 → URL 파라미터 → 쿠키 순서로 토큰을 추출한다.
     * 세션이 없으면(false) 새 세션을 생성하지 않는다.
     */
    private String extractToken(HttpServletRequest request) {
        // 1. 세션
        HttpSession session = request.getSession(false);
        if (session != null) {
            String token = (String) session.getAttribute("__TOKEN__");
            if (!Strings.isNullOrEmpty(token)) return token;
            token = (String) session.getAttribute("token");
            if (!Strings.isNullOrEmpty(token)) return token;
        }
        // 2. URL 파라미터
        String paramToken = request.getParameter("token");
        if (!Strings.isNullOrEmpty(paramToken)) return paramToken;

        // 3. 쿠키 (OMS가 쿠키로 token을 전달하는 경우 — 이름 후보 전부 체크)
        Cookie[] cookies = request.getCookies();
        if (cookies != null) {
            for (Cookie cookie : cookies) {
                String name = cookie.getName();
                if (("token".equals(name) || "TOKEN".equals(name)
                        || "_TOKEN_".equals(name) || "_TO_KEN_".equals(name))
                        && !Strings.isNullOrEmpty(cookie.getValue())) {
                    log.info("token found in cookie: name={}", name);
                    return cookie.getValue();
                }
            }
        }
        return null;
    }

    /**
     * 요청 종류에 따라 응답을 결정한다.
     * - 브라우저(페이지) 요청: 세션 무효화 + 토큰 쿠키 삭제 후 OMS 로그인으로 redirect
     * - AJAX/API 요청      : 401 Unauthorized 반환 (React SPA가 처리)
     */
    private boolean denyOrRedirect(HttpServletRequest request,
                                   HttpServletResponse response) throws Exception {
        if (isApiRequest(request)) {
            response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Token is not valid");
        } else {
            // 만료된 토큰이 세션에 남아 무한 루프되지 않도록 세션 무효화
            HttpSession session = request.getSession(false);
            if (session != null) {
                session.invalidate();
            }
            // 브라우저 쿠키의 토큰도 만료 처리 — 이름 × path 후보군 전체
            for (String name : TOKEN_COOKIE_NAMES) {
                for (String path : TOKEN_COOKIE_PATHS) {
                    Cookie expired = new Cookie(name, "");
                    expired.setPath(path);
                    expired.setMaxAge(0);
                    response.addCookie(expired);
                }
            }
            response.sendRedirect("/oms/login/goSysSelView");
        }
        return false;
    }

    /**
     * AJAX / REST API 요청 여부 판별.
     * Accept 헤더에 application/json 포함 여부로 구분한다.
     */
    private boolean isApiRequest(HttpServletRequest request) {
        String accept = request.getHeader("Accept");
        return accept != null && accept.contains("application/json");
    }
}
