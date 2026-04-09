package com.eseict.ssc.facility.domain.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

import static com.eseict.ssc.config.ApiConstants.DbSchema.FMS;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
@Table(name = "erf_co_info", schema = FMS)
public class ErfCoInfo {

    @Id
    @Column(name = "co_id", length = 36)
    private String coId;

    @Column(name = "addr", length = 150)
    private String addr;

    @Column(name = "cjobmn", length = 50)
    private String cjobmn;

    @Column(name = "cjobmn_phone", length = 13)
    private String cjobmnPhone;

    @Column(name = "co_gb", length = 3)
    private String coGb;

    @Column(name = "co_nm", length = 50)
    private String coNm;

    @Column(name = "co_phone", length = 13)
    private String coPhone;

    @Column(name = "email", length = 50)
    private String email;

    @Column(name = "mfmn", length = 50)
    private String mfmn;

    @Column(name = "reg_dtm", length = 14)
    private String regDtm;

    @Column(name = "regrt", length = 50)
    private String regrt;

    @Column(name = "upd_dtm", length = 14)
    private String updDtm;

    @Column(name = "use_yn")
    private boolean useYn;

    @Column(name = "client_cd", length = 3)
    private String clientCd;

    @Column(name = "site_cd", length = 8)
    private String siteCd;
}
