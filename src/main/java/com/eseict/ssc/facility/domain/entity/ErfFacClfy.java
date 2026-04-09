package com.eseict.ssc.facility.domain.entity;

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
@Table(name = "erf_fac_clfy", schema = ApiConstants.DbSchema.FMS)
public class ErfFacClfy {

    @Id
    @Column(name = "fac_clfy_id", nullable = false, length = 36)
    private String facClfyId;                                           // 시설물 분류 ID

    @Column(name = "fac_clfy_gb", nullable = false)
    private boolean facClfyGb;                                          // 하위 시설물 여부

    @Column(name = "fac_clfy_nm", nullable = false, length = 50)
    private String facClfyNm;                                           // 시설물 분류 이름

    @Column(name = "fac_clfy_path", length = 500)
    private String facClfyPath;                                         // 최상위 시설물 id

    @Column(name = "file_id", length = 36)
    private String fildId;                                              // 첨부파일 ID

    @Column(name = "lvl_no", nullable = false)
    private Integer lvlNo;                                              // 시설물 tree level (최상위 = 1)

    @Column(name = "mfmn", length = 50)
    private String mfmn;                                                // 시설물 등록자 이름

    @Column(name = "note", length = 500)
    private String note;                                                // 시설물 설명

    @Column(name = "reg_dtm", nullable = false, length = 14)
    private String regDtm;                                              // 시설물 등록 날짜

    @Column(name = "regrt", nullable = false, length = 50)
    private String regrt;                                               // 시설물 등록자

    @Column(name = "top_fac_clfy_id", nullable = false, length = 36)
    private String topFacClfyId;                                        // 시설물 최상위 분류 id

    @Column(name = "upd_dtm", nullable = false, length = 14)
    private String updDtm;                                              // 업데이트 날짜

    @Column(name = "use_yn", nullable = false)
    private boolean useYn;                                              // 시설물 사용여부

    @Column(name = "fac_clfy_ico")
    private Byte facClfyIco;                                            // 시설물 아이콘 (없음)

    @Column(name = "client_cd", length = 3)
    private String clientCd;                                            // 사용 X

    @Column(name = "site_cd", length = 8)
    private String siteCd;                                              // 사용 X
}
