package com.eseict.ssc.stat.application.dto;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class BellResult {
    private String keyId;
    private String keyNm;
    private int count;

    public BellResult(String keyId, String keyNm, Long count) {
        this.keyId = keyId;
        this.keyNm = keyNm;
        this.count = count.intValue();
    }
}
