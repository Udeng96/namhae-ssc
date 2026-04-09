package com.eseict.ssc.stat.application.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class FacTypeResult {
    String facCd;
    String facNm;
    int count;

    public FacTypeResult(String facCd, String facNm, Long count) {
        this.facCd = facCd;
        this.facNm = facNm;
        this.count = count.intValue();
    }
}
