package com.eseict.ssc.sms.application.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class DeptTarget {
    private String uprDepartmentCd;   //상위 부서 코드
    private String departmentCd;  //부서 코드
    private String departmentCdNm;  //부서명
    private String departmentFullNm;  //부서전체 명
    private String departmentSe;   //조직 구분코드
    private String departmentSeq;  //조직순서
    private String departmentRank;  //정렬순서
    private List<SecondDeptTarget> secondDeptTargetList;

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    @Builder
    public static class SecondDeptTarget {
        private String uprDepartmentCd;   //상위 부서 코드
        private String departmentCd;  //부서 코드
        private String departmentCdNm;  //부서명
        private String departmentFullNm;  //부서전체 명
        private String departmentSe;   //조직 구분코드
        private String departmentSeq;  //조직순서
        private String departmentRank;  //정렬순서
        private List<DeptMemTarget> children;
    }
}
