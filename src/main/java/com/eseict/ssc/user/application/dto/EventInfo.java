package com.eseict.ssc.user.application.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class EventInfo {
    private String evetId;
    private String msgTypCd;
    private String znCd;
    private String znNm;
    private String svcThemeCd;
    private String svcThemeNm;
    private String unitSvcCd;
    private String unitSvcNm;
    private String evetCd;
    private String evetNm;
}
