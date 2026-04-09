package com.eseict.ssc.sms.application.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class BroadDeviceInfo {

    private String facId;
    private String addrShort;
    private String coNm;
    private String facNm;
    private String area;
    private String facType;
    private String mgtNo;
    private String lon;
    private String lat;
    private String stuDtm;
    private String facDesc;
    private String addInfoKey;
    private String addInfoValue;
    private String facClfyId;
    private String statusCode = "정상";
}
