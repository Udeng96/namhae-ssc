package com.eseict.ssc.conf.domain.entity;

import com.eseict.ssc.config.ApiConstants;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

/**
 * conference.conference_snr_center — 회의 진행 상태를 실시간 반영하는 마스터.
 *
 * <p>ScheBroadcastService.getConferencingScIds() 가 현재 회의 진행중인 셋톱 목록
 * (conference_status='CONNECTING') 을 가져올 때 사용한다.
 *
 * <p>schema 변경 히스토리:
 * <ul>
 *   <li>이전: {@code mcs.conference_snr_center} — 갱신되지 않는 죽은 데이터
 *       (전부 DISCONNECTING 상태로 굳어있어 TV 차단 로직이 무력화됨)
 *   <li>현재: {@code conference.conference_snr_center} — 실제 운영중 마스터
 *       (CONNECTING/DISCONNECTING 갱신됨)
 * </ul>
 */
@AllArgsConstructor
@NoArgsConstructor
@Data
@Entity
@Table(name = "conference_snr_center", schema = ApiConstants.DbSchema.CONF)
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

}
