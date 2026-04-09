package com.eseict.ssc.repository.fac;

import com.eseict.ssc.facility.domain.entity.TblAreaInfo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface FacAreaRepository extends JpaRepository<TblAreaInfo, String> {

    List<TblAreaInfo> findByAreaName(@Param("areaName")String areaName);

    @Query("SELECT a.areaId FROM TblAreaInfo as a JOIN IocUcityZnInfo u on u.znNm = a.areaName WHERE u.znCd in :znCds ")
    List<String> findByZnCds(@Param("znCds") List<String> znCds);

    @Query("SELECT a.areaId FROM TblAreaInfo as a JOIN IocUcityZnInfo u on u.znNm = a.areaName WHERE u.znCd = :znCd ")
    List<String> findByZnCd(@Param("znCd") String znCd);

    List<TblAreaInfo> findByAreaIdLike(String areaId);

    List<TblAreaInfo> findByAreaIdNotLike(String areaId);

    List<TblAreaInfo> findByAreaIdLikeAndAreaIdNotLike(String areaId, String areaId1);
}
