package com.eseict.ssc.sms.domain.entity;


import com.eseict.ssc.config.ApiConstants;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

@AllArgsConstructor
@NoArgsConstructor
@Entity
@Data
@Table(name = "oms_comm_cd_info", schema = ApiConstants.DbSchema.OMS)
public class OmsCommCdInfo {

    @Id
    @Column(name = "cd_id")
    private String cdId;

    @Column(name = "cd")
    private String cd;

    @Column(name = "cd_desc")
    private String cdDesc;

    @Column(name = "cd_nm")
    private String cdNm;

    @Column(name = "cre_dtm")
    private String creDtm;

    @Column(name = "cre_nm")
    private String creNm;

    @Column(name = "grup_cd")
    private String grupCd;

    @Column(name = "grup_yn")
    private String grupYn;

    @Column(name = "sort")
    private int sort;

    @Column(name = "upd_dtm")
    private String updDtm;

    @Column(name = "upd_nm")
    private String updNm;

    @Column(name = "use_yn")
    private String useYn;
}
