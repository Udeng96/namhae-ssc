package com.eseict.ssc.monitoring.application.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class TodayEventItem {
    private String statEvetOutbSeqn;
    private String statEvetNm;
    private String statEvetCd;
    private String statEventGdCd;
    private String outbDtm;
    private String clrDtm;
    private String outbPlac;
    private String znCd;
}
