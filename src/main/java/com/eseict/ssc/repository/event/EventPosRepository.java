package com.eseict.ssc.repository.event;

import com.eseict.ssc.monitoring.domain.entity.IocStatEvetPosHist;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface EventPosRepository extends JpaRepository<IocStatEvetPosHist, String> {
    @Modifying
    @Query("UPDATE  IocStatEvetPosHist e SET e.xCrdnt = :xCrdnt, e.yCrdnt = :yCrdnt  WHERE e.statEvetOutbSeqn = :seqn")
    int updateXandYBySeqn(@Param("xCrdnt")String xCrdnt, @Param("yCrdnt")String yCrdnt, @Param("seqn")String seqn);
}
