package com.eseict.ssc.user.application.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class UserInfo {
    private String token;
    private String userId;
    private String userName;
    private String mobile;
    private String userType;
    private String grupId;
    private String orgnId;
    private String dptId;
    private String loginId;
}
