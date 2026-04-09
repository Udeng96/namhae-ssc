package com.eseict.ssc.interceptor;

import com.eseict.common.net.http.HttpConnection;
import com.eseict.ssc.config.ApiConstants;
import com.eseict.ssc.common.dto.ChkTokenAliveResponse;
import com.google.common.base.Strings;
import com.google.gson.Gson;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.util.HashMap;
import java.util.Map;

/**
 * OMS 토큰 유효성 검사 인터셉터.
 *
 * - 개발 모드(IS_DEV=true): 무조건 통과
 * - 운영 모드:
 *   1. 세션/쿠키/파라미터에서 토큰 추출
 *   2. 토큰 없음 → OMS 로그인 페이지로 redirect (return false)
 *   3. OMS tokenAlive API 호출
 *      - 결과 OK  → 통과 (return true)
 *      - 결과 NOK → OMS 로그인 페이지로 redirect (return false)
 *
 * 적용 패턴: /sc/mng  (DispatcherServletConfig에서 등록)
 * API 경로(/refac/**): React SPA가 401 응답을 받아 클라이언트에서 처리
 */
@Slf4j
@Component
public class LoginInterceptor implements HandlerInterceptor {

    @Value("${rino-platform.oms.url}")
    private String omsUrl;

    @Value("${rino-platform.oms.api.user.tokenAlive}")
    private String tokenAliveUrl;

    @Value("${rino-platform.oms.system.key}")
    private String systemKey;

    @Value("${rino-platform.oms.system.secret}")
    private String systemSecret;

    private final Gson gson = new Gson();

    // ── public entry point ────────────────────────────────────────────────────

    @Override
    public boolean preHandle(HttpServletRequest request,
                             HttpServletResponse response,
                             Object handler) throws Exception {

        // 개발 모드는 토큰 검사 생략
        if (ApiConstants.IS_DEV.equals(ApiConstants.IsDev.DEV)) {
            return true;
        }

        String requestUri = request.getRequestURI();
        log.trace("interceptor called: {}", requestUri);

        String token = extractToken(request);

        // 토큰 없음
        if (Strings.isNullOrEmpty(token)) {
            log.debug("Token is empty → redirect to OMS login. uri={}", requestUri);
            return denyOrRedirect(request, response);
        }

        // OMS tokenAlive 체크
        if (!isTokenAlive(token)) {
            log.info("Token is not alive → redirect to OMS. uri={}", requestUri);
            return denyOrRedirect(request, response);
        }

        return true;
    }

    // ── private helpers ───────────────────────────────────────────────────────

    /**
     * 세션 → 파라미터 순서로 토큰을 추출한다.
     * 세션이 없으면(false) 새 세션을 생성하지 않는다.
     */
    private String extractToken(HttpServletRequest request) {
        HttpSession session = request.getSession(false);
        if (session != null) {
            String token = (String) session.getAttribute("__TOKEN__");
            if (!Strings.isNullOrEmpty(token)) return token;
            token = (String) session.getAttribute("token");
            if (!Strings.isNullOrEmpty(token)) return token;
        }
        return request.getParameter("token");
    }

    /**
     * OMS tokenAlive API를 호출하여 토큰 유효성을 확인한다.
     * 예외 발생 시 false 반환(보안 fail-closed).
     */
    private boolean isTokenAlive(String token) {
        try {
            HttpConnection<String> connection = new HttpConnection<>();
            String url = omsUrl + tokenAliveUrl;

            Map<String, Object> reqHeader = new HashMap<>();
            reqHeader.put("systemKey", systemKey);
            reqHeader.put("secret", systemSecret);

            Map<String, Object> reqParam = new HashMap<>();
            reqParam.put("token", token);

            String resStr = connection.doPost(url, reqHeader, reqParam);
            ChkTokenAliveResponse res = gson.fromJson(resStr, ChkTokenAliveResponse.class);

            boolean alive = ApiConstants.Result.OMS_SUCCESS_CODE.equalsIgnoreCase(res.getResult());
            log.info("tokenAlive result: {}", res.getResult());
            return alive;

        } catch (Exception e) {
            log.error("tokenAlive API 호출 실패 → 접근 차단", e);
            return false;
        }
    }

    /**
     * 요청 종류에 따라 응답을 결정한다.
     * - 브라우저(페이지) 요청: OMS 로그인으로 redirect
     * - AJAX/API 요청      : 401 Unauthorized 반환 (React SPA가 처리)
     */
    private boolean denyOrRedirect(HttpServletRequest request,
                                   HttpServletResponse response) throws Exception {
        if (isApiRequest(request)) {
            response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Token is not valid");
        } else {
            response.sendRedirect(omsUrl);
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
