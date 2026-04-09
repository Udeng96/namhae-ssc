package com.eseict.ssc.stat.application.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class CountResult {

    private String areaCd;
    private String areaNm;
    private int count;

    public CountResult(String  areaCd, String areaNm, Long count) {
        this.areaCd = areaCd;
        this.areaNm = areaNm;
        this.count = count.intValue();
    }

    public CountResult(String areaCd, String areaNm, Double count){
        this.areaCd = areaCd;
        this.areaNm = areaNm;
        this.count = (int) Math.floor(count);
    }
}


