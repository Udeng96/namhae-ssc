package com.eseict.ssc.sms.application.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class DeptMemTarget {
    private String usrNm;
    private String departmentCd;         //부서 코드
    private String departmentCdNm;
    private String hpNo;          //핸드폰 번호
}
