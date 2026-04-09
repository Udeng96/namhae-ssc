package com.eseict.ssc.repository.scm;

import com.eseict.ssc.stat.application.dto.CountResult;
import com.eseict.ssc.stat.application.dto.DateResult;
import com.eseict.ssc.stat.application.dto.DateTypeItem;
import com.eseict.ssc.stat.application.dto.ScResult;
import com.eseict.ssc.stat.application.dto.FacStatResult;
import com.eseict.ssc.stat.application.dto.FacTypeResult;
import com.eseict.ssc.stat.application.dto.TimeResult;

import java.util.List;

public interface OperRepositoryCustom {

    List<CountResult> findOperCountList(String startDtm, String endDtm);
    List<CountResult> findSubOperCountList(String startDtm, String endDtm, String area);
    List<FacTypeResult> findOperFacList(String startDtm, String endDtm);
    List<FacTypeResult> findSubOperFacList(String startDtm, String endDtm, String area);
    List<TimeResult> findOperScList(String startDtm, String endDtm);
    List<TimeResult> findSubOperScList(String startDtm, String endDtm, String area);
}
