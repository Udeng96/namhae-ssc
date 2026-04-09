package com.eseict.ssc.monitoring.domain.entity;

import com.eseict.ssc.config.ApiConstants;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;

import javax.persistence.*;

@Getter
@AllArgsConstructor
@NoArgsConstructor
@ToString
@Entity
@IdClass(IocUnitSvcInfoPK.class)
@Table(name = "ioc_unit_svc_info", schema = ApiConstants.DbSchema.IOC)
public class IocUnitSvcInfo {

    @Id
    @Column(name = "zn_cd", nullable = false, length = 3)
    private String znCd;

    @Id
    @Column(name = "unit_svc_cd", nullable = false, length = 3)
    private String unitSvcCd;

    @Id
    @Column(name = "svc_theme_cd", nullable = false, length = 3)
    private String svcThemeCd;

    @Column(name = "cre_dtm", length = 17)
    private String creDtm;

    @Column(name = "cre_mn", length = 50)
    private String creMn;

    @Column(name = "img_file_nm", length = 50)
    private String imgFileNm;

    @Column(name = "unit_svc_desc", length = 400)
    private String unitSvcDesc;

    @Column(name = "unit_svc_nm", length = 50)
    private String unitSvcNm;

    @Column(name = "upd_dtm", length = 17)
    private String updDtm;

    @Column(name = "upd_mn", length = 50)
    private String updMn;
}
