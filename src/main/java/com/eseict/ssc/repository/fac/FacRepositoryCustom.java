package com.eseict.ssc.repository.fac;

import com.eseict.ssc.facility.application.dto.FacItem;
import com.eseict.ssc.sms.application.dto.BroadDeviceInfo;
import com.eseict.ssc.facility.domain.entity.ErfPosCrdnt;
import com.eseict.ssc.facility.domain.entity.TblAreaInfo;

import java.util.List;

public interface FacRepositoryCustom {
    ErfPosCrdnt findSocketEventErfInfo(String plcId);
    List<TblAreaInfo> findFacSubAreaCds(List<String> areaCds);
    List<FacItem> findFacListByAreaCds(List<String> areaCds, String scName, List<String> sscTopClfyIds);
    List<BroadDeviceInfo> findBroadDeviceLists(List<String> clfyIds);
}
