package com.eseict.ssc.repository.fac;

import com.eseict.ssc.facility.domain.entity.ErfPosCrdnt;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Collection;
import java.util.List;

public interface FacPosRepository extends JpaRepository<ErfPosCrdnt, String> {

    List<ErfPosCrdnt> findByFacId(@Param("facId")String facId);

    /** N+1 방지용 배치 조회 — facId 목록에 해당하는 위치 정보를 한 번에 조회 */
    List<ErfPosCrdnt> findByFacIdIn(Collection<String> facIds);

    @Query("select e from ErfPosCrdnt e left join ErfFacInfo f on e.facId = f.facId where f.mgtNo = :scMgtNo")
    List<ErfPosCrdnt> findFacPosInfos(@Param("scMgtNo")String scMgtNo);

}
