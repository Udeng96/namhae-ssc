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
@IdClass(IocStatEvetInfoPK.class)
@Table(name = "ioc_stat_evet_info", schema = ApiConstants.DbSchema.IOC)
public class IocStatEvetInfo {

    @Id
    @Column(name = "zn_cd", length = 3, nullable = false)
    private String znCd;                                                //  지역 코드
    @Id
    @Column(name = "unit_svc_cd", length = 3, nullable = false)
    private String unitSvcCd;                                           //  시설물 코드 (화재센서, 가스센서, 비상벨, CCTV, 셋톱박스)
    @Id
    @Column(name = "svc_theme_cd", length = 3, nullable = false)
    private String svcThemeCd;                                          //  이벤트 테마 코드(노인정, 경찰, 소방 등)
    @Id
    @Column(name = "stat_evet_cd", length = 2, nullable = false)
    private String statEvetCd;                                          //  이벤트 발생 상태 코드
    @Id
    @Column(name = "evet_gb_cd", length = 1, nullable = false)
    private String evetGbCd;                                            //
    @Column(name = "cpx_evet_yn", length = 1)
    private String cpxEvetYn;                           //
    @Column(name = "cre_dtm", length = 17)
    private String creDtm;                              //
    @Column(name = "cre_mn", length = 50)
    private String creMn;                               //
    @Column(name = "msg_typ_cd", length = 3)
    private String msgTypCd;                            //
    @Column(name = "prty_seq")
    private int prtySeq;                                //
    @Column(name = "stat_evet_desc", length = 400)
    private String statEvetDesc;                        //
    @Column(name = "stat_evet_nm", length = 50)
    private String statEvetNm;                          // 이벤트 발생 상태 이름
    @Column(name = "upd_dtm", length = 17)
    private String updDtm;                              //
    @Column(name = "upd_mn", length = 50)
    private String updMn;                               //
    @Column(name = "image", length = 1000)
    private String image;                               //
    @Column(name = "color", length = 20)
    private String color;                               //
}
