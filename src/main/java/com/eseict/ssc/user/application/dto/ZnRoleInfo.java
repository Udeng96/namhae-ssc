package com.eseict.ssc.user.application.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class ZnRoleInfo {
    private String znCd;
    private String znNm;
    private String areaCd;
    private boolean active = true;
    private int scCnt;
    private int facCnt;
    private int todaySitCnt;
    private int todayStatusCnt;
    private List<SubZnRoleInfo> subZnList = new ArrayList<>();
}
