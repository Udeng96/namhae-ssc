package com.eseict.ssc.facility.application.dto;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class FacCctv {
    private String cctvId;
    private String cctvNm;
    private String clfyId;
    private String lat;
    private String lng;
    private String mgtNo;
    private String area;
}
