package com.eseict.ssc.repository.oms;

import com.eseict.ssc.sms.domain.entity.OmsCommCdInfo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface CommCdRepository extends JpaRepository<OmsCommCdInfo, String> {

    @Query("SELECT o FROM OmsCommCdInfo o WHERE o.grupCd = 'EAS_DS_CD' AND o.sort > 0")
    List<OmsCommCdInfo> getDsCodeIdentifier();

}
