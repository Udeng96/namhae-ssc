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
 * conference.conference — 화상회의 개설 정보 마스터.
 *
 * 통계 기준 타임스탬프 = start_time (개설 시작 시간).
 * UsageStatService.getOpenConfUsage / getConnConfUsage 의 기간 필터로 사용.
 */
@AllArgsConstructor
@NoArgsConstructor
@Data
@Entity
@Table(name = "conference", schema = ApiConstants.DbSchema.CONF)
public class Conference {

    @Id
    @Column(name = "conference_id")
    private String conferenceId;

    @Column(name = "session_sequence")
    private String sessionSequence;

    @Column(name = "start_time")
    private LocalDateTime startTime;

    @Column(name = "end_time")
    private LocalDateTime endTime;

    @Column(name = "status")
    private String status;

    @Column(name = "title")
    private String title;

    @Column(name = "host_id")
    private String hostId;

    @Column(name = "host_nm")
    private String hostNm;

    @Column(name = "host_url")
    private String hostUrl;

    @Column(name = "connect_url")
    private String connectUrl;
}
