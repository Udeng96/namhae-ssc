package com.eseict.ssc.repository.scm;

import com.eseict.ssc.facility.domain.entity.ScFacInfo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import javax.transaction.Transactional;
import java.util.List;

public interface ScFacRepository extends JpaRepository<ScFacInfo, String> {
    @Modifying
    @Transactional
    @Query("update ScFacInfo set todaySitEvet = :newCount where mgtNo = :mgtNo")
    int updateTodaySitEvet(@Param("newCount")int newCount, @Param("mgtNo")String mgtNo);

    List<ScFacInfo> findTodaySitEvetByMgtNo(String mgtNo);

    List<ScFacInfo> findByTopAreaId(String topAreaId);

    @Query("select s.topAreaId, count(s), coalesce(sum(s.todaySitEvet), 0), " +
            "coalesce(sum(s.todayStatusEvet), 0) from ScFacInfo s group by s.topAreaId")
    List<Object[]> summarizeRoleCountsByTopAreaId();

    List<ScFacInfo> findByTopAreaName(String topAreaName);
}
