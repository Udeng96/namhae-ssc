package com.eseict.ssc.repository.event;


import com.eseict.ssc.monitoring.domain.entity.IocStatEvetInfo;
import com.eseict.ssc.repository.event.EventInfoRepositoryCustom;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Collection;
import java.util.List;

public interface EventInfoRepository extends JpaRepository<IocStatEvetInfo, String>, EventInfoRepositoryCustom {

    List<IocStatEvetInfo> findByUnitSvcCdAndSvcThemeCdAndStatEvetCdIn(String unitSvcCd, String svcThemeCd, Collection<String> statEvetCds);

    List<IocStatEvetInfo> findBySvcThemeCdAndUnitSvcCd(String svcThemeCd, String unitSvcCd);
}
