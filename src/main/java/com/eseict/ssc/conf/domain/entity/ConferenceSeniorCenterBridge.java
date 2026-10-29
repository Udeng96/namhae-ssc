package com.eseict.ssc.conf.domain.entity;

import com.eseict.ssc.config.ApiConstants;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.IdClass;
import javax.persistence.Table;
import java.io.Serializable;

/**
 * conference.conference_senior_center_bridge — 회의 ↔ 경로당 참가 매핑 (M:N).
 *
 * - conference_id    → conference.conference.conference_id
 * - senior_center_id → conference.senior_center.senior_center_id  (FAC_* 형식)
 *
 * 시간 정보 없음 → 기간 필터는 Conference.startTime JOIN 으로 처리한다.
 */
@AllArgsConstructor
@NoArgsConstructor
@Data
@Entity
@Table(name = "conference_senior_center_bridge", schema = ApiConstants.DbSchema.CONF)
@IdClass(ConferenceSeniorCenterBridge.PK.class)
public class ConferenceSeniorCenterBridge {

    @Id
    @Column(name = "conference_id")
    private String conferenceId;

    @Id
    @Column(name = "senior_center_id")
    private String seniorCenterId;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @EqualsAndHashCode
    public static class PK implements Serializable {
        private String conferenceId;
        private String seniorCenterId;
    }
}
