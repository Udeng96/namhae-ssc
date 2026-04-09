package com.eseict.ssc.repository.conf;

import com.eseict.ssc.conf.domain.entity.BellConfInfo;
import com.eseict.ssc.conf.domain.entity.QBellConfInfo;
import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.List;

@RequiredArgsConstructor
@Repository
public class BellConfRepositoryImpl implements BellConfRepositoryCustom {

    private final JPAQueryFactory jpaQueryFactory;

    QBellConfInfo bellConf = QBellConfInfo.bellConfInfo;

    @Override
    public List<BellConfInfo> findConferencesBySeqns(List<String> eventSeqns) {
        return jpaQueryFactory.selectFrom(bellConf).where(bellConf.statEvetOutbSeqn.in(eventSeqns)).fetch();
    }

    @Override
    public List<BellConfInfo> findNowBroadBellConfList() {
        return jpaQueryFactory.selectFrom(bellConf).where(bellConf.clrDtm.isNull().and(bellConf.userId.isNotNull())).fetch();
    }
}
