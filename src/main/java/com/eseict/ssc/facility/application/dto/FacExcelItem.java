package com.eseict.ssc.facility.application.dto;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class FacExcelItem {
    private String facNm;
    private String addrShort;
    private String coNm;
    private String facTyp;
    private String facClfyNm;
    private String facDesc;
    private String mgtNo;
    private String posNm;
    private Integer psstPeriod;
    private String regDtm;
    private String regrt;
    private String setuDtm;
    private String area;
    private String geoFtrCd;
    private String xcrdnt;
    private String ycrdnt;
}
