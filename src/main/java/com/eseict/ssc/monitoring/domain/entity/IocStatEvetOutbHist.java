package com.eseict.ssc.monitoring.domain.entity;

import com.eseict.ssc.config.ApiConstants;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "ioc_stat_evet_outb_hist", schema = ApiConstants.DbSchema.IOC)
public class IocStatEvetOutbHist {

    @Id
    @Column(name = "stat_evet_outb_seqn", length = 24)
    private String statEvetOutbSeqn;                                    // Table PK
    @Column(name = "clr_dtm", length = 17)
    private String clrDtm;                                              // 이벤트 해제 시간
    @Column(name = "cls_dtm", length = 17)
    private String clsDtm;                                              //
    @Column(name = "cls_typ", length = 1)
    private String clsTyp;                                              //
    @Column(name = "evet_gb_cd", nullable = false, length = 1)
    private String evetGbCd;                                            //
    @Column(name = "outb_dtm", length = 17)
    private String outbDtm;                                             // 이벤트 발생 시간
    @Column(name = "outb_main_gb", length = 1)
    private String outbMainGb;                                          //
    @Column(name = "outb_plac", length = 150)
    private String outbPlac;                                            // 이벤트 발생 장소
    @Column(name = "outb_scop_rads", length = 50)
    private String outbScopRads;                                        //
    @Column(name = "proc_st", length = 1)
    private String procSt;                                              // process status 프로세스 상태 >  1이면 발생, 5or4면 종료   // 상태가
    @Column(name = "stat_evet_cd", nullable = false, length = 2)
    private String statEvetCd;                                          // 이벤트 발생 상태 코드
    @Column(name = "stat_evet_cntn", length = 200)
    private String statEvetCntn;                                        // 이벤트 발생 장소와 발생 상황
    @Column(name = "stat_evet_gd_cd", nullable = false, length = 2)
    private String statEvetGdCd;                                        //
    @Column(name = "svc_theme_cd", nullable = false, length = 3)
    private String svcThemeCd;                                          // 이벤트 테마 코드(노인정, 경찰, 소방 등)
    @Column(name = "u_svc_outb_id", length = 24)
    private String uSvcOutbId;                                          //
    @Column(name = "unit_svc_cd", nullable = false, length = 3)
    private String unitSvcCd;                                           // 시설물 코드 (화재센서, 가스센서, 비상벨, CCTV, 셋톱박스)
    @Column(name = "zn_cd", nullable = false, length = 3)
    private String znCd;                                                // 지역 코드
    @Column(name = "cls_data", length = 5000)
    private String clsData;                                             //
}
