package com.eseict.ssc.user.application.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class LogoutResponse {
    private String result; // 결과 코드
    private String message; // 결과 메세지
    private LogoutData data; // 로그인 사용자 정보

    public String getRedirectUrl() {
        return data.getRedirectUrl();
    }

    @AllArgsConstructor
    @NoArgsConstructor
    @Data
    static class LogoutData {
        private String redirectUrl;
    }

}
