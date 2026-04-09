package com.eseict.ssc.user.domain.entity;

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
@Table(name = "department_member_info", schema = ApiConstants.DbSchema.DEPT)
public class DepartmentMemberInfo {

    @Id
    @Column(name = "login_id")
    private String loginId;

    @Column(name = "usr_nm")
    private String usrNm;

    @Column(name = "department_cd")
    private String departmentCd;

    @Column(name = "department_cd_nm")
    private String departmentCdNm;

    @Column(name = "department_full_nm")
    private String departmentFullNm;

    @Column(name = "clss_no")
    private String clssNo;

    @Column(name = "clss_nm")
    private String clssNm;

    @Column(name = "hp_no")
    private String hpNo;

    @Column(name = "key")
    private String key;
}
