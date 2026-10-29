package com.eseict.ssc.repository.conf;

import com.eseict.ssc.conf.domain.entity.Conference;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

/**
 * conference.conference 조회.
 *
 * UsageStatService.getOpenConfUsage / getConnConfUsage 에서 사용:
 *   - findByStartTimeBetween: 기간 내 개설된 회의 목록 (start_time 기준)
 */
public interface ConferenceRepository extends JpaRepository<Conference, String> {

    List<Conference> findByStartTimeBetween(LocalDateTime start, LocalDateTime end);
}
