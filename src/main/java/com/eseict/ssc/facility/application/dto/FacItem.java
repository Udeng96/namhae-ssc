package com.eseict.ssc.facility.application.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class FacItem {
    private String areaNm;
    private String area;
    private String posNm;
    private String facAddr;
    private String facClfyId;
    private String facNm;
    private String facId;
    private String facClfyNm;
    private String xcrdnt;
    private String ycrdnt;
    private String updDtm;
    private String mgtNo;
    private boolean useYn;
    private String topfacClfyId;
}
