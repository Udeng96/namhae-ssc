package com.eseict.ssc.repository.event;

import com.eseict.ssc.common.dto.CommonArea;
import com.eseict.ssc.facility.domain.entity.QTblAreaInfo;
import com.eseict.ssc.monitoring.domain.entity.QIocUcityZnInfo;
import com.querydsl.core.types.Projections;
import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.List;


@RequiredArgsConstructor
@Repository
public class EventZnInfoRepositoryImpl implements EventZnInfoRepositoryCustom {

    private final JPAQueryFactory jpaQueryFactory;

    private final QIocUcityZnInfo znInfo = QIocUcityZnInfo.iocUcityZnInfo;
    private final QTblAreaInfo areaInfo = QTblAreaInfo.tblAreaInfo;

    @Override
    public List<CommonArea> findAreaList() {
        return jpaQueryFactory.select(Projections.constructor(
                CommonArea.class,
                znInfo.znNm,
                znInfo.znCd,
                areaInfo.areaId
        )).from(znInfo).join(areaInfo).on(znInfo.znNm.eq(areaInfo.areaName)).where(znInfo.znCd.like("4%").and(znInfo.znNm.notLike("%군"))).fetch();
    }
}
