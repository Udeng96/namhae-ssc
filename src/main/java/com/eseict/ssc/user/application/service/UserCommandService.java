package com.eseict.ssc.user.application.service;

import com.eseict.common.net.http.HttpConnection;
import com.eseict.common.net.http.HttpConnectionException;
import com.eseict.ssc.config.ApiConstants;
import com.eseict.ssc.user.application.dto.LogoutResponse;
import com.google.gson.Gson;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

/**
 * UserCommandService (refac) — 사용자 명령 (로그아웃)
 *
 * 기존(service/newUser/UserService):
 *   - 조회(getUser, getRoleInfo)와 명령(doLogout)이 혼재
 * 개선:
 *   - CQRS 분리: 명령 → UserCommandService
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class UserCommandService {

    @Value("${rino-platform.oms.url}")            private String OMS_URL;
    @Value("${rino-platform.oms.system.key}")     private String OMS_SYS_KEY;
    @Value("${rino-platform.oms.system.secret}")  private String OMS_SYS_SECRET;
    @Value("${rino-platform.oms.api.user.logout}") private String LOGOUT;

    private final Gson gson = new Gson();

    // ── 로그아웃 ──────────────────────────────────────────────

    public String doLogout(String token) {
        Map<String, Object> reqHeader = new HashMap<>();
        Map<String, Object> reqParam  = new HashMap<>();
        reqHeader.put("systemKey", OMS_SYS_KEY);
        reqHeader.put("secret",    OMS_SYS_SECRET);
        reqParam.put("token", token);

        try {
            String logoutResponse = new HttpConnection<String>().doPost(OMS_URL + LOGOUT, reqHeader, reqParam);
            LogoutResponse response = gson.fromJson(logoutResponse, LogoutResponse.class);
            log.info("logoutResponse: {}", response);
            if (response.getResult().equals(ApiConstants.Result.OMS_SUCCESS_CODE)) {
                return response.getRedirectUrl();
            }
        } catch (HttpConnectionException e) {
            log.error("Error on logout: {}", e.getMessage());
            throw new RuntimeException(e);
        }
        return "";
    }
}
