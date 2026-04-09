package com.eseict.ssc.repository.fac;

import com.eseict.ssc.facility.domain.entity.ErfFacInfo;
import com.eseict.ssc.repository.fac.FacRepositoryCustom;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Collection;
import java.util.List;

public interface FacRepository extends JpaRepository<ErfFacInfo, String>, FacRepositoryCustom {

    List<ErfFacInfo> findByMgtNo(@Param("mgtNo")String mgtNo);
    List<ErfFacInfo> findByFacNm(@Param("facNm")String facNm);
    List<ErfFacInfo> findByFacClfyId(@Param("facClfyId")String facClfyId);
    List<ErfFacInfo> findByFacClfyIdInAndUseYn(Collection<String> facClfyIds, boolean useYn);
    List<ErfFacInfo> findByAreaAndFacClfyId(@Param("area")String area, @Param("facClfyId")String facClfyId);



    @Query("select f from ErfFacInfo f where f.facClfyId = :facClfyId and f.area like :area and f.useYn = true ")
    List<ErfFacInfo> findAreaScList(@Param("facClfyId")String facClfyId, @Param("area")String area);

    @Query("select f from ErfFacInfo f where f.facClfyId = :facClfyId and substring(f.area,1,7) = :area and f.useYn = true")
    List<ErfFacInfo> findAreaScListBySubstrArea(@Param("facClfyId")String facClfyId, @Param("area")String area);

    @Query("select f from ErfFacInfo f where f.facClfyId in :facClfyIds and f.area like :area and f.useYn = true")
    List<ErfFacInfo> findAreaFacListExceptSc(@Param("facClfyIds")List<String> facClfyIds, @Param("area")String area);


}
