package com.eseict.ssc.facility.domain.entity;

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
@Data
@Entity
@Table(name = "sc_fac_info", schema = ApiConstants.DbSchema.SCM)
public class ScFacInfo {
    @Id
    @Column(name = "fac_id")
    private String facId;
    @Column(name = "addr_short")
    private String addrShort;
    @Column(name = "pos_nm")
    private String posNm;
    @Column(name = "fac_clfy_id")
    private String facClfyId;
    @Column(name = "fac_desc")
    private String facDesc;
    @Column(name = "fac_nm")
    private String facNm;
    @Column(name = "mgt_no")
    private String mgtNo;
    @Column(name = "top_area_id")
    private String topAreaId;
    @Column(name = "top_area_name")
    private String topAreaName;
    @Column(name = "area_id")
    private String areaId;
    @Column(name = "area_name")
    private String areaName;
    @Column(name = "x_crdnt")
    private String xCrdnt;
    @Column(name = "y_crdnt")
    private String yCrdnt;
    @Column(name = "pos_crdnt_id")
    private String posCrdntId;
    @Column(name = "today_sit_evet")
    private Integer todaySitEvet;
    @Column(name = "today_status_evet")
    private Integer todayStatusEvet;
    @Column(name = "bell")
    private String bell;
    @Column(name = "fire")
    private String fire;
    @Column(name = "gas")
    private String gas;
    @Column(name = "settop1")
    private String settop1;
    @Column(name = "settop2")
    private String settop2;
    @Column(name = "cctv_b")
    private String cctvB;
    @Column(name = "cctv_k")
    private String cctvK;
    @Column(name = "cctv_l")
    private String cctvL;
    @Column(name = "cctv_t")
    private String cctvT;
    @Column(name = "sc")
    private String sc;
    @Column(name = "added_at")
    private int addedAt;
}
