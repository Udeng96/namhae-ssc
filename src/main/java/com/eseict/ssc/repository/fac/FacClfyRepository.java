package com.eseict.ssc.repository.fac;

import com.eseict.ssc.facility.domain.entity.ErfFacClfy;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface FacClfyRepository extends JpaRepository<ErfFacClfy, String> {

    List<ErfFacClfy> findByTopFacClfyId(@Param("topFacClfyId")String topFacClfyId);

    List<ErfFacClfy> findByFacClfyNm(@Param("clfyNm")String clfyNm);

    List<ErfFacClfy> findByTopFacClfyIdAndFacClfyIdIsNot(String topFacClfyId, String facClfyId);

    @Query("select f from ErfFacClfy f where f.topFacClfyId = :topFacClfyId and f.facClfyId <> :facClfyId")
    List<ErfFacClfy> findByFacClfyListExceptSc(@Param("topFacClfyId")String topFacClfyId, @Param("facClfyId")String facClfyId);

    List<ErfFacClfy> findByFacClfyNmAndUseYnAndFacClfyGb(String facClfyNm, boolean useYn, boolean facClfyGb);
}
