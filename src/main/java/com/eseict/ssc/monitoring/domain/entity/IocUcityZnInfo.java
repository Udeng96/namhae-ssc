package com.eseict.ssc.monitoring.domain.entity;

import com.eseict.ssc.config.ApiConstants;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

@Getter
@AllArgsConstructor
@NoArgsConstructor
@ToString
@Entity
@Table(name = "ioc_ucity_zn_info", schema = ApiConstants.DbSchema.IOC)
public class IocUcityZnInfo {

    @Id
    @Column(name = "zn_cd", length = 3, nullable = false)
    private String znCd;                                        // Table PK 지역 코드

    @Column(name = "cre_dtm", length = 17)
    private String creDtm;                                      //

    @Column(name = "cre_mn", length = 50)
    private String creMn;                                       //

    @Column(name = "upd_dtm", length = 17)
    private String updDtm;                                      //

    @Column(name = "upd_mn", length = 50)
    private String updMn;                                       //

    @Column(name = "zn_desc", length = 400)
    private String znDesc;                                      // 지역 설명

    @Column(name = "zn_nm", length = 50)
    private String znNm;                                        // 지역 이름

}
