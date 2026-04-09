package com.eseict.ssc.facility.domain.entity;

import com.eseict.ssc.config.ApiConstants;
import lombok.*;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
@Builder
@Entity
@Table(name = "erf_pos_crdnt", schema = ApiConstants.DbSchema.FMS)
public class ErfPosCrdnt {

    @Id
    @Column(name = "pos_crdnt_id", nullable = false, length = 36)
    private String posCrdntId;                                          // 위치 ID

    @Column(name = "fac_id", nullable = false, length = 36)
    private String facId;                                               // 시설물 ID

    @Column(name = "pos_grup_id", nullable = false, length = 36)
    private String posGrupId;                                           // 위치 그룹 ID (그냥 일반 아이디하고 같)

    @Column(name = "sort_ord", nullable = false, length = 3)
    private String sortOrd;                                             // 사용 X (그룹에서 레벨)

    @Column(name = "use_yn", nullable = false)
    private boolean useYn;                                              // 사용 여부

    @Column(name = "x_crdnt", nullable = false, length = 50)
    private String xCrdnt;                                              // X좌표

    @Column(name = "y_crdnt", nullable = false, length = 50)
    private String yCrdnt;                                              // Y좌표
}
