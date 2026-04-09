package com.eseict.ssc.monitoring.domain.entity;

import lombok.Data;

import java.io.Serializable;

@Data
public class IocUnitSvcInfoPK implements Serializable {
    private String znCd;
    private String unitSvcCd;
    private String svcThemeCd;
}
