package com.eseict.ssc.stat.application.dto;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class ScResult {
    private String scId;
    private String scNm;
    private int count;

    public ScResult(String scId, String scNm, Long count) {
        this.scId = scId;
        this.scNm = scNm;
        this.count = count.intValue();
    }

    public ScResult(String scId, String scNm, Double percent) {
        this.scId = scId;
        this.scNm = scNm;
        this.count = (int) Math.floor(percent);
    }
}
