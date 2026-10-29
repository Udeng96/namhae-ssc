package com.eseict.ssc.repository.conf;

import com.eseict.ssc.conf.domain.entity.SeniorCenter;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

/**
 * conference.senior_center 조회.
 *
 * UsageStatService.getConnConfUsage 에서 사용:
 *   - findBySeniorCenterIdIn: bridge 의 senior_center_id 목록으로 site_cd 매핑
 */
public interface SeniorCenterRepository extends JpaRepository<SeniorCenter, String> {

    List<SeniorCenter> findBySeniorCenterIdIn(List<String> seniorCenterIds);
}
