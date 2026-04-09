package com.eseict.ssc.monitoring.application.dto;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class FacEventSc {

    private String evetSeq;
    private String scNm;
    private String evetCd;
    private String evetNm;
    private String outbDtm;
}
