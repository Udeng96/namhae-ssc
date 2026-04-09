package com.eseict.ssc.facility.domain.entity;

import com.eseict.ssc.config.ApiConstants;
import lombok.*;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Entity
@Table(name = "tbl_area_info", schema = ApiConstants.DbSchema.FMS)
public class TblAreaInfo {

    @Id
    @Column(name = "area_id", length = 45, nullable = false)
    private String areaId;                                      // 지역, 법정동 ID

    @Column(name = "area_name", length = 200)
    private String areaName;                                    // 법정동 주소

    @Column(name = "area_mapp", length = 45)
    private String areaMapp;                                    // 이 친구는 뭔지 모르겠눈데 사용은 안합니다

    @Column(name = "x_crdnt", length = 50)
    private String xCrdnt;                                      // X좌표

    @Column(name = "y_crdnt", length = 50)
    private String yCrdnt;                                      // Y좌표
}
