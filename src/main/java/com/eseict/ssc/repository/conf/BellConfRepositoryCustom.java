package com.eseict.ssc.repository.conf;

import com.eseict.ssc.conf.domain.entity.BellConfInfo;

import java.util.List;

public interface BellConfRepositoryCustom {


    List<BellConfInfo> findConferencesBySeqns(List<String> eventSeqns);
    List<BellConfInfo> findNowBroadBellConfList();
}
