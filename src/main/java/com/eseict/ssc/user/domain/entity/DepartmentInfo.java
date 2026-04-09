package com.eseict.ssc.user.domain.entity;

import com.eseict.ssc.config.ApiConstants;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;


@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
@Table(name = "department_info", schema = ApiConstants.DbSchema.DEPT)
public class DepartmentInfo {
    @Column(name = "upr_department_cd")
    private String uprDepartmentCd;
    @Id
    @Column(name = "department_cd")
    private String departmentCd;
    @Column(name = "department_cd_nm")
    private String departmentCdNm;
    @Column(name = "department_full_nm")
    private String departmentFullNm;
    @Column(name = "department_se")
    private String departmentSe;
    @Column(name = "department_seq")
    private String departmentSeq;
    @Column(name = "department_rank")
    private String departmentRank;
}
