package com.eseict.ssc.monitoring.application.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class EventDataResult {
    private String procSt;
    private String unitSvcNm;
    private String unitSvcCd;
    private String znNm;
    private String znCd;
    private String outbPlac;
    private String addrShort;
    private String posNm;
    private String outbDtm;
    private String clrDtm;
    private String statEvetNm;
    private String statEvetCd;
    private String xcrdnt;
    private String ycrdnt;
    private String statEvetCntn;
    private String statEvetOutbSeqn;
}
