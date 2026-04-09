package com.eseict.ssc.user.application.dto;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class UserResponse {
    private String result; // 결과 코드
    private String message; // 결과 메세지
    private UserInfo data; // 로그인 사용자 정보
}
