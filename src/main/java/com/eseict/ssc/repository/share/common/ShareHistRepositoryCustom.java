package com.eseict.ssc.repository.share.common;

import com.eseict.ssc.sms.application.dto.BroadHist;

import java.util.List;

public interface ShareHistRepositoryCustom {

    List<BroadHist> getBroadcastHistList(String eventSeqn);
}
