package com.eseict.ssc.repository.event;


import com.eseict.ssc.monitoring.domain.entity.IocUnitSvcInfo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;


@Repository
public interface UnitSvcRepository extends JpaRepository<IocUnitSvcInfo, String> {

    @Query("SELECT distinct u.unitSvcNm FROM IocUnitSvcInfo u WHERE u.unitSvcCd = :unitSvcCd and u.svcThemeCd = 'SSC'")
    List<String> findUnitSvcNmByUnitSvcCd(@Param("unitSvcCd") String unitSvcCd);

}
