package com.eseict.ssc.conf.domain.entity;

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
@Table(name = "conference_snr_center", schema = ApiConstants.DbSchema.MCS)
public class ConferenceSnrCenter {

    @Id
    @Column(name = "id")
    private String id;

    @Column(name = "snr_center_conference_id")
    private String snrCenterConferenceId;

    @Column(name = "conference_status")
    private String conferenceStatus;

    @Column(name = "set_top_id")
    private String setTopId;

    @Column(name = "set_top_status")
    private String setTopStauts;

    @Column(name = "snr_addr")
    private String snrAddr;

    @Column(name = "snr_detail")
    private String snrDetail;

    @Column(name = "snr_nm")
    private String snrNm;

    @Column(name = "snr_zone_cd")
    private String snrZoneCd;

    @Column(name = "snr_zone_nm")
    private String snrZoneNm;

    @Column(name = "clfy_cd")
    private String clfyCd;
}
