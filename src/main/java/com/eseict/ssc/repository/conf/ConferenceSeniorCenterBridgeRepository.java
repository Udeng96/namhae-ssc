package com.eseict.ssc.repository.conf;

import com.eseict.ssc.conf.domain.entity.ConferenceSeniorCenterBridge;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

/**
 * conference.conference_senior_center_bridge 조회.
 *
 * UsageStatService.getConnConfUsage 에서 사용:
 *   - findByConferenceIdIn: 기간 내 개설된 회의들의 참가 매핑 조회
 */
public interface ConferenceSeniorCenterBridgeRepository
        extends JpaRepository<ConferenceSeniorCenterBridge, ConferenceSeniorCenterBridge.PK> {

    List<ConferenceSeniorCenterBridge> findByConferenceIdIn(List<String> conferenceIds);
}
