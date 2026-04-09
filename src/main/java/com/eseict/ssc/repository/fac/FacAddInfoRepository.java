package com.eseict.ssc.repository.fac;

import com.eseict.ssc.facility.domain.entity.ErfFacClfyAddInfoData;
import com.eseict.ssc.facility.domain.entity.ErfFacClfyAddInfoDataId;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Collection;
import java.util.List;

public interface FacAddInfoRepository extends JpaRepository<ErfFacClfyAddInfoData, ErfFacClfyAddInfoDataId> {

    List<ErfFacClfyAddInfoData> findById_FacIdIn(Collection<String> facIds);
}