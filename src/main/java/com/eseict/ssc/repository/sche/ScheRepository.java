package com.eseict.ssc.repository.sche;

import com.eseict.ssc.schedule.domain.entity.ScheContentScheduleInfo;
import com.eseict.ssc.repository.sche.ScheRepositoryCustom;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import javax.transaction.Transactional;
import java.util.Arrays;
import java.util.List;

public interface ScheRepository extends JpaRepository<ScheContentScheduleInfo, String>, ScheRepositoryCustom {

    List<ScheContentScheduleInfo> findByContentType(@Param("contentType")String contentType);
    List<ScheContentScheduleInfo> findByContentGrpId(@Param("contentGrpId")String contentGrpId);
    List<ScheContentScheduleInfo> findByContentAreaContaining(String contentArea);

    @Transactional
    @Modifying
    int deleteAllByContentGrpId(@Param("contentGrpId")String contentGrpId);

    @Transactional
    @Modifying
    @Query("UPDATE ScheContentScheduleInfo s SET s.contentFile = :contentFile WHERE s.contentId = :contentId")
    int updateScheduleFiles(@Param("contentFile") String contentFile, @Param("contentId") String contentId);
}
