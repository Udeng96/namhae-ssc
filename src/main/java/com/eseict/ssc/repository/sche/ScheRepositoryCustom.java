package com.eseict.ssc.repository.sche;


import com.eseict.ssc.schedule.domain.entity.ScheContentScheduleInfo;

import java.util.List;

public interface ScheRepositoryCustom {

    List<ScheContentScheduleInfo> findOverContentByContentType(String contentType, String nowDate, String nowTime);

    List<ScheContentScheduleInfo> findPendingContentByType(String contentType, String nowDate, String nowTime);

    List<ScheContentScheduleInfo> findBroadingContentByType(String contentType, String nowDate, String nowTime, String nowMin, String nowSec);

    List<ScheContentScheduleInfo> chkDuplication(String contentType, String startDtm, String endDtm, String contentGrpId);
}
