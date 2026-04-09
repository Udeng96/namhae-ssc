package com.eseict.ssc.repository.fac;

import com.eseict.ssc.facility.domain.entity.ErfCoInfo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface FacCoInfoRepository extends JpaRepository<ErfCoInfo, String> {

    List<ErfCoInfo> findByCoNm(@Param("coNm")String coNm);
}
