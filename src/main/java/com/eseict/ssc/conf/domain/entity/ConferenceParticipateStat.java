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

@NoArgsConstructor
@AllArgsConstructor
@Data
@Entity
@Table(name = "conference_participate_stat", schema = ApiConstants.DbSchema.MCS)
public class ConferenceParticipateStat {

    @Id
    @Column(name = "id")
    private String id;

    @Column(name = "conference_id")
    private String conferenceId;

    @Column(name = "conference_nm")
    private String conferenceNm;

    @Column(name = "created_time")
    private LocalDateTime createdTime;

    @Column(name = "end_time")
    private LocalDateTime endTime;

    @Column(name = "facility_id")
    private String facilityId;
}
