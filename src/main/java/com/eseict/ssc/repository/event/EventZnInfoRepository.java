package com.eseict.ssc.repository.event;


import com.eseict.ssc.common.dto.CommonArea;
import com.eseict.ssc.monitoring.domain.entity.IocUcityZnInfo;
import com.eseict.ssc.repository.event.EventZnInfoRepositoryCustom;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Arrays;
import java.util.List;

public interface EventZnInfoRepository extends JpaRepository<IocUcityZnInfo, String>, EventZnInfoRepositoryCustom {

    @Query("SELECT z.znNm FROM IocUcityZnInfo z WHERE z.znCd = :znCd")
    String findZnNmByZnCd(@Param("znCd") String znCd);

    @Query("SELECT z.znCd FROM IocUcityZnInfo z JOIN TblAreaInfo a on a.areaName = z.znNm WHERE a.areaId = :areaId")
    String findZnCdByAreaId(String areaId);

    List<IocUcityZnInfo> findByZnCd(String znCd);

    List<IocUcityZnInfo> findByZnNm(String areaName);
}
