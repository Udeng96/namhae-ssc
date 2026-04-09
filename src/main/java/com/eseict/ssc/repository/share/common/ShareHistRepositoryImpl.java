package com.eseict.ssc.repository.share.common;

import com.eseict.ssc.sms.application.dto.BroadHist;
import com.eseict.ssc.sms.domain.entity.QShareSendHistory;
import com.querydsl.core.types.Projections;
import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.List;


@RequiredArgsConstructor
@Repository
public class ShareHistRepositoryImpl implements ShareHistRepositoryCustom {

    private final JPAQueryFactory jpaQueryFactory;

    QShareSendHistory shareHist = QShareSendHistory.shareSendHistory;

    @Override
    public List<BroadHist> getBroadcastHistList(String eventSeqn) {
        return jpaQueryFactory.select(Projections.constructor(
                BroadHist.class,
                shareHist.msgType,
                shareHist.msgTitle,
                shareHist.msgContent,
                shareHist.targetList,
                shareHist.sendTime,
                shareHist.ttsKey
        )).from(shareHist).where(shareHist.oriEventSeqn.eq(eventSeqn)).fetch();
    }
}
