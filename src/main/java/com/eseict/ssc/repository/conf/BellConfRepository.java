package com.eseict.ssc.repository.conf;

import com.eseict.ssc.conf.domain.entity.BellConfInfo;
import com.eseict.ssc.repository.conf.BellConfRepositoryCustom;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface BellConfRepository extends JpaRepository<BellConfInfo, String>, BellConfRepositoryCustom {

    @Query("select c from BellConfInfo as c where c.userId = :userId and c.confStatus = '1' and c.clrDtm is null")
    List<BellConfInfo> chkOpenBellConf(String userId);

    List<BellConfInfo> findBellConfInfoByStatEvetOutbSeqn(String statEvetOutbSeqn);

    @Transactional
    @Modifying
    @Query("update BellConfInfo b set b.clrDtm = :clrDtm, b.confStatus = '5' where b.statEvetOutbSeqn = :statEvetOutbSeqn")
    int updateCloseConf(String clrDtm, String statEvetOutbSeqn);

    List<BellConfInfo> findByStatEvetOutbSeqn(String seqn);

    @Query("SELECT extId FROM BellConfInfo WHERE statEvetOutbSeqn = :statEvetOutbSeqn")
    String findExtIdByStatEvetOutbSeqn(String statEvetOutbSeqn);
}
