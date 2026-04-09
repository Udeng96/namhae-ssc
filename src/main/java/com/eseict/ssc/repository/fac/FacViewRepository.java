package com.eseict.ssc.repository.fac;

import com.eseict.ssc.facility.domain.entity.ScFacInfo;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FacViewRepository extends JpaRepository<ScFacInfo, String> {

    List<ScFacInfo> findByFacNm(String facNm);

    List<ScFacInfo> findDistinctByFacNmLikeAndFacClfyId(String facNm, String facClfyId);

    List<ScFacInfo> findDistinctByTopAreaIdIn(List<String> topAreaId);
    List<ScFacInfo> findDistinctByTopAreaIdInAndFacNmLike(List<String> topAreaId, String facNm);

    List<ScFacInfo> findByTopAreaId(String topAreaId);

    List<ScFacInfo> findDistinctByTopAreaIdAndTodayStatusEvet(String topAreaId, String todayStatusEvet);

    List<ScFacInfo> findDistinctByTopAreaIdAndTodaySitEvet(String topAreaId, String todaySitEvet);
}
