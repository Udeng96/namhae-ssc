package com.eseict.ssc.repository.event;

import com.eseict.ssc.common.dto.KeyValue;
import com.eseict.ssc.monitoring.domain.entity.QIocStatEvetInfo;
import com.querydsl.core.types.Projections;
import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.List;

@RequiredArgsConstructor
@Repository
public class EventInfoRepositoryImpl implements EventInfoRepositoryCustom {

    private final JPAQueryFactory jpaQueryFactory;

    private final QIocStatEvetInfo eventInfo = QIocStatEvetInfo.iocStatEvetInfo;

    @Override
    public List<KeyValue> getEventTypes() {
        return jpaQueryFactory.select(Projections.constructor(
                KeyValue.class,
                eventInfo.statEvetNm,
                eventInfo.unitSvcCd.concat("E").concat(eventInfo.statEvetCd)
        )).from(eventInfo).where(
                eventInfo.svcThemeCd.eq("SSC").and(
                        eventInfo.unitSvcCd.eq("001")
                )
        ).groupBy(eventInfo.statEvetCd, eventInfo.statEvetNm, eventInfo.unitSvcCd).orderBy(eventInfo.statEvetCd.asc()).fetch();
    }

    @Override
    public List<KeyValue> getFacEventTypes() {
        return jpaQueryFactory.select(Projections.constructor(
                KeyValue.class,
                eventInfo.statEvetNm,
                eventInfo.unitSvcCd.concat("E").concat(eventInfo.statEvetCd)
        )).from(eventInfo).where(
                eventInfo.svcThemeCd.eq("SSC")
                        .and(eventInfo.unitSvcCd.eq("002"))
                        .and(eventInfo.statEvetNm.notLike("%상태"))
        ).groupBy(eventInfo.statEvetCd, eventInfo.statEvetNm, eventInfo.unitSvcCd).orderBy(eventInfo.statEvetCd.asc()).fetch();
    }
}
