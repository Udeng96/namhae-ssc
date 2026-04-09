package com.eseict.ssc.common.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import static com.eseict.ssc.config.ApiConstants.Result.FAIL_CODE;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class CommonResponse {
    String resultCode;
    String resultMessage;


    public  CommonResponse(String resultCode) {
        this.resultCode = resultCode;
        this.resultMessage = resultCode.equals(FAIL_CODE)? "실패" : "성공";
    }

}
