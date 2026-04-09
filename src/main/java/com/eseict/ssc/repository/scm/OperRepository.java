package com.eseict.ssc.repository.scm;

import com.eseict.ssc.facility.domain.entity.OperatingHist;
import com.eseict.ssc.repository.scm.OperRepositoryCustom;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface OperRepository extends JpaRepository<OperatingHist, String>, OperRepositoryCustom {
    List<OperatingHist> findOperatingHistByFacilityTypeAndCalcTimeBetween(String facilityType, String startDtm, String endDtm);

    @Query(value =
            "SELECT SUBSTRING(h.calc_time, 1, 8) AS day_key, FLOOR(AVG(h.facility_operating_rate)) AS avg_rate " +
            "FROM scm.operating_hist h " +
            "WHERE h.calc_time BETWEEN :start AND :end AND h.operating_type = 'daily' " +
            "GROUP BY SUBSTRING(h.calc_time, 1, 8) ORDER BY day_key",
            nativeQuery = true)
    List<Object[]> findOperDayAvg(@Param("start") String start, @Param("end") String end);

    @Query(value =
            "SELECT SUBSTRING(h.calc_time, 1, 8) AS day_key, FLOOR(AVG(h.facility_operating_rate)) AS avg_rate " +
            "FROM scm.operating_hist h " +
            "WHERE h.calc_time BETWEEN :start AND :end AND h.operating_type = 'daily' " +
            "AND CONCAT(SUBSTRING(h.center_area, 1, 7), '000') = :area " +
            "GROUP BY SUBSTRING(h.calc_time, 1, 8) ORDER BY day_key",
            nativeQuery = true)
    List<Object[]> findSubOperDayAvg(@Param("start") String start, @Param("end") String end, @Param("area") String area);
}
