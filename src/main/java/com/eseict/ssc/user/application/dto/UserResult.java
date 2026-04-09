package com.eseict.ssc.user.application.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class UserResult {

    private UserInfo userInfo;
    private List<SysInfo> sysInfos;


}
