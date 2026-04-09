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


@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Table(name = "erf_fac_info", schema = FMS)
public class ErfFacInfo {

    @Id
    @Column(name = "fac_id", nullable = false, length = 36)
    private String facId;                                           // 시설물 ID

    @Column(name = "addr_long", length = 500)
    private String addrLong;                                        // 시설물 구주소

    @Column(name = "addr_short", nullable = false, length = 150)
    private String addrShort;                                       // 시설물 도로명 주소

    @Column(name = "aprv_st", nullable = false, length = 3)
    private String aprvSt;                                          // 승인 상태

    @Column(name = "bldg_id", length = 36)
    private String bldgId;                                          // 건물 id

    @Column(name = "co_id", nullable = false, length = 36)
    private String coId;                                            // 업체 id

    @Column(name = "dismnt_dtm", length = 14)
    private String dismntDtm;                                       // 철거 날짜

    @Column(name = "evet_rcv_yn", nullable = false)
    private boolean evetRcvYn;                                      // 이벤트 수신 여부

    @Column(name = "fac_add_info", length = 500)
    private String facAddInfo;                                      // 시설물 추가 정보

    @Column(name = "fac_clfy_id", nullable = false, length = 36)
    private String facClfyId;                                       //  시설물 분류 ID

    @Column(name = "fac_desc", length = 500)
    private String facDesc;                                         //  시설물 설명

    @Column(name = "fac_nm", nullable = false, length = 50)
    private String facNm;                                           //  시설물 이름

    @Column(name = "fac_typ", nullable = false, length = 3)
    private String facTyp;                                          //  시설물 타입  (현재 전부 다 001인데 분류의 기준은?)

    @Column(name = "file_grup_id", length = 36)
    private String fileGrupId;                                      //  파일 그룹 id

    @Column(name = "geo_ftr_cd", length = 50)
    private String getoFtrCd;                                       // 지형지물 코드

    @Column(name = "mfmn", length = 50)
    private String mfmn;                                            // 시설물 등록자

    @Column(name = "mgt_no", nullable = false, length = 50)
    private String mgtNo;                                           // 관리 번호

    @Column(name = "pos_grup_id", length = 36)
    private String posGrupId;                                       // 위치 id

    @Column(name = "pos_nm", length = 50)
    private String posNm;                                           // 위치 명

    @Column(name = "psst_period", nullable = false)
    private Integer psstPeriod;                                     // 사용 X (내구 연한)

    @Column(name = "reason", length = 36)
    private String reason;                                          // 사용 X (사유)

    @Column(name = "reg_dtm", nullable = false, length = 14)
    private String regDtm;                                          // 등록 날짜

    @Column(name = "regrt", nullable = false, length = 50)
    private String regrt;                                           // 등록자

    @Column(name = "setu_dtm", nullable = false, length = 8)
    private String setuDtm;                                         // 설치 날짜

    @Column(name = "sevrty", length = 3)
    private String sevrty;                                          // 사용 X (심각도)

    @Column(name = "upd_dtm", length = 14)
    private String updDtm;                                          // 업데이트된 날짜

    @Column(name = "use_yn", nullable = false)
    private boolean useYn;                                          // 사용 여부

    @Column(name = "area", length = 50)
    private String area;                                            // 설치 지역 코드

    @Column(name = "mobile_yn")
    private boolean mobileYn;                                       // 모바일 사용 여부

    @Column(name = "client_cd", length = 3)
    private String clientCd;                                        // 사용 X

    @Column(name = "site_cd", length = 8)
    private String siteCd;                                          // 사용 X

    @Column(name = "state", length = 24)
    private String state;                                           // 시설물 상태
}
