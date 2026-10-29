package com.eseict.ssc.conf.domain.entity;

import com.eseict.ssc.config.ApiConstants;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;
import java.time.LocalDateTime;

/**
 * conference.senior_center — 경로당 마스터 (회의 시스템 측).
 *
 * - PK: senior_center_id (FAC_* 형식)
 * - site_cd → conference.site.site_cd (= 면 단위 지역코드, 4884xxx000)
 *
 * Bridge 의 senior_center_id 가 이 테이블 PK 와 매칭 (dev 검증: 100%).
 */
@AllArgsConstructor
@NoArgsConstructor
@Data
@Entity
@Table(name = "senior_center", schema = ApiConstants.DbSchema.CONF)
public class SeniorCenter {

    @Id
    @Column(name = "senior_center_id")
    private String seniorCenterId;

    @Column(name = "name")
    private String name;

    @Column(name = "address")
    private String address;

    @Column(name = "detail")
    private String detail;

    @Column(name = "site_cd")
    private String siteCd;

    @Column(name = "set_top_id")
    private String setTopId;

    @Column(name = "conference_id")
    private String conferenceId;

    @Column(name = "connect_status")
    private String connectStatus;

    @Column(name = "created_by")
    private String createdBy;

    @Column(name = "created_date")
    private LocalDateTime createdDate;

    @Column(name = "last_modified_by")
    private String lastModifiedBy;

    @Column(name = "last_modified_date")
    private LocalDateTime lastModifiedDate;
}
