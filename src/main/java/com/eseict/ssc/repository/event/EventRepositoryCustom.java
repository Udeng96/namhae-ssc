package com.eseict.ssc.repository.event;

import com.eseict.ssc.monitoring.application.dto.EventDataResult;
import com.eseict.ssc.monitoring.application.dto.EventHeatmap;
import com.eseict.ssc.monitoring.application.dto.TodayEventItem;
import com.eseict.ssc.stat.application.dto.BellResult;
import com.eseict.ssc.stat.application.dto.DateTypeItem;
import com.eseict.ssc.stat.application.dto.CountResult;
import com.eseict.ssc.stat.application.dto.ScResult;
import com.eseict.ssc.stat.application.dto.FacTypeResult;
import com.eseict.ssc.monitoring.domain.entity.IocStatEvetOutbHist;

import java.util.List;

public interface EventRepositoryCustom {
    List<EventDataResult> findEventHists(List<String> znCds, List<String> statEventCds, String startDtm, String endDtm, String plcId, int pageNumber, boolean isCount);
    String findStatEvetNm(String znCd, String unitSvcCd, String svcThemeCd, String statEvetCd);
    List<EventHeatmap> findHeatmap(String startDtm, String endDtm, List<String> statEventCdList);
    List<CountResult> findEventCountList(String startDtm, String endDtm);
    List<CountResult> findSubEventCountList(String startDtm, String endDtm, String area);
    List<CountResult> findFacEventCountList(String startDtm, String endDtm);
    List<CountResult> findSubFacEventCountList(String startDtm, String endDtm, String area);
    List<IocStatEvetOutbHist> findEventTypeCountList(String startDtm, String endDtm);
    List<IocStatEvetOutbHist> findSubEventTypeCountList(String startDtm, String endDtm, String area);
    List<IocStatEvetOutbHist> findFacEventTypeCountList(String startDtm, String endDtm);
    List<IocStatEvetOutbHist> findSubFacEventTypeCountList(String startDtm, String endDtm, String area);
    List<BellResult> findBellCountList(String startDtm, String endDtm);
    List<BellResult> findSubBellCountList(String startDtm, String endDtm, String area);
    List<FacTypeResult> findFacTypeCountList(String startDtm, String endDtm);
    List<FacTypeResult> findSubFacTypeCountList(String startDtm, String endDtm, String area);
    List<ScResult> findScCountList(String startDtm, String endDtm);
    List<ScResult> findSubScCountList(String startDtm, String endDtm, String area);
    List<ScResult> findFacScCountList(String startDtm, String endDtm);
    List<ScResult> findSubFacScCountList(String startDtm, String endDtm, String area, List<String> scList);
    List<TodayEventItem> findTodayScEventList(String startDtm,String endDtm, String mgtNo);
}
