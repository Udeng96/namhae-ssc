package com.eseict.ssc.repository.social;

import com.eseict.ssc.open.domain.entity.VmsContent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface VmsRepository extends JpaRepository<VmsContent, String>, VmsRepositoryCustom {

    @Query("select v from VmsContent v where v.startDtm >= :startDate and v.endDtm <= :endDate")
    List<VmsContent> findVmsContents(@Param("startDate")String startDate, @Param("endDate")String endDate);

    List<VmsContent> findBySeqn(String seqn);
}
