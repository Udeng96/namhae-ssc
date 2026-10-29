package com.eseict.ssc.repository.conf;

import com.eseict.ssc.conf.domain.entity.Site;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * conference.site 조회.
 *
 * UsageStatService.getConnConfUsage 에서 사용:
 *   - findAll: site_cd → site_nm (면 이름) 매핑 (10건이므로 메모리 캐시 OK)
 */
public interface SiteRepository extends JpaRepository<Site, String> {
}
