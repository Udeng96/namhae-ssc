package com.eseict.ssc.repository.event;

import com.eseict.ssc.monitoring.application.dto.EventDataResult;
import com.eseict.ssc.monitoring.application.dto.EventHeatmap;
import com.eseict.ssc.monitoring.application.dto.TodayEventItem;
import com.eseict.ssc.stat.application.dto.BellResult;
import com.eseict.ssc.stat.application.dto.CountResult;
import com.eseict.ssc.stat.application.dto.ScResult;
import com.eseict.ssc.stat.application.dto.FacTypeResult;
import com.eseict.ssc.facility.domain.entity.QErfFacInfo;
import com.eseict.ssc.monitoring.domain.entity.*;
import com.eseict.ssc.monitoring.domain.entity.QIocStatEvetInfo;
import com.eseict.ssc.monitoring.domain.entity.QIocStatEvetOutbHist;
import com.eseict.ssc.monitoring.domain.entity.QIocStatEvetPosHist;
import com.eseict.ssc.monitoring.domain.entity.QIocUcityZnInfo;
import com.eseict.ssc.monitoring.domain.entity.QIocUnitSvcInfo;
import com.querydsl.core.BooleanBuilder;
import com.querydsl.core.types.Projections;
import com.querydsl.core.types.dsl.*;
import com.querydsl.jpa.impl.JPAQuery;
import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;
import java.util.List;

import static com.eseict.ssc.config.ApiConstants.EVENT_NULL.PLCID_NULL;

@RequiredArgsConstructor
@Repository
public class EventRepositoryImpl implements EventRepositoryCustom {

    private final JPAQueryFactory jpaQueryFactory;

    private final QIocStatEvetOutbHist eventHist = QIocStatEvetOutbHist.iocStatEvetOutbHist;
    private final QIocStatEvetInfo eventInfo = QIocStatEvetInfo.iocStatEvetInfo;
    private final QIocUnitSvcInfo unitSvcInfo = QIocUnitSvcInfo.iocUnitSvcInfo;
    private final QIocUcityZnInfo znInfo = QIocUcityZnInfo.iocUcityZnInfo;
    private final QIocStatEvetPosHist posHist = QIocStatEvetPosHist.iocStatEvetPosHist;
    private final QErfFacInfo facInfo = QErfFacInfo.erfFacInfo;


    // 이벤트 리스트 조회
    public List<EventDataResult> findEventHists(List<String> znCds, List<String> statEventCds, String startDtm, String endDtm, String plcId, int pageNumber, boolean isCount) {

        int offset = 0;
        int allCnt = 50;

        if (pageNumber != 0) {
            offset = (pageNumber - 1) * 9;
            allCnt = 9;
        }

        BooleanBuilder where = makeSelectWhereBuilder(znCds, statEventCds, startDtm, endDtm, plcId);
        if (isCount) {
            return buildListBaseQuery().where(where).orderBy(Expressions.stringTemplate("substring({0}, 1, 14)", eventHist.outbDtm).desc()).fetch();

        } else {
            return buildListBaseQuery().where(where).orderBy(Expressions.stringTemplate("substring({0}, 1, 14)", eventHist.outbDtm).desc()).offset(offset).limit(allCnt).fetch();
        }
    }

    @Override
    public String findStatEvetNm(String znCd, String unitSvcCd, String svcThemeCd, String statEvetCd) {
        IocStatEvetInfo evetInfo = jpaQueryFactory
                .selectFrom(eventInfo)
                .where(
                        eventInfo.znCd.eq(znCd),
                        eventInfo.unitSvcCd.eq(unitSvcCd),
                        eventInfo.svcThemeCd.eq(svcThemeCd),
                        eventInfo.statEvetCd.eq(statEvetCd) // 누락된 조건 추가!
                )
                .fetchOne();

        return evetInfo != null ? evetInfo.getStatEvetNm() : null;
    }

    @Override
    public List<EventHeatmap> findHeatmap(String startDtm, String endDtm, List<String> statEventCdList) {

        BooleanBuilder builder = new BooleanBuilder();
        builder.and(eventHist.svcThemeCd.eq("SSC"));
        builder.and(eventHist.unitSvcCd.eq("001"));
        builder.and(eventHist.statEvetCd.in(statEventCdList));
        builder.and(eventHist.statEvetCd.notIn("03"));
        builder.and(posHist.isNotNull());
        builder.and(posHist.yCrdnt.ne("0"));

        if (!startDtm.isEmpty() && !endDtm.isEmpty()) {
            builder.and(eventHist.outbDtm.goe(startDtm));
            builder.and(eventHist.outbDtm.loe(endDtm));
        }

        return jpaQueryFactory.select(Projections.constructor(
                        EventHeatmap.class,
                        posHist.yCrdnt,
                        posHist.xCrdnt,
                        eventHist.statEvetOutbSeqn.count()
                ))
                .from(eventHist)
                .join(posHist).on(posHist.statEvetOutbSeqn.eq(eventHist.statEvetOutbSeqn))
                .where(builder)
                .groupBy(posHist.yCrdnt, posHist.xCrdnt)
                .fetch();
    }

    @Override
    public List<CountResult> findEventCountList(String startDtm, String endDtm) {
        return jpaQueryFactory.select(Projections.constructor(
                        CountResult.class,
                        eventHist.znCd,
                        znInfo.znNm,
                        eventHist.znCd.count()
                )).from(eventHist)
                .join(znInfo).on(znInfo.znCd.eq(eventHist.znCd))
                .join(znInfo).on(znInfo.znCd.eq(eventHist.znCd))
                .join(facInfo).on(facInfo.mgtNo.eq(eventHist.outbPlac))
                .where(eventHist.outbDtm.goe(startDtm)
                        .and(eventHist.outbDtm.loe(endDtm))
                        .and(eventHist.svcThemeCd.eq("SSC"))
                        .and(eventHist.unitSvcCd.eq("001"))
                        .and(eventHist.statEvetCd.ne("04"))
                        .and(eventHist.statEvetCd.ne("05"))
                        .and(eventHist.statEvetCd.notIn("03"))
                )
                .groupBy(eventHist.znCd, znInfo.znNm).fetch();
    }

    @Override
    public List<CountResult> findSubEventCountList(String startDtm, String endDtm, String area) {
        return jpaQueryFactory.select(Projections.constructor(
                        CountResult.class,
                        eventHist.outbPlac,
                        facInfo.facNm,
                        eventHist.outbPlac.count()
                )).from(eventHist)
                .join(facInfo).on(facInfo.mgtNo.eq(eventHist.outbPlac))
                .where(eventHist.outbDtm.goe(startDtm)
                        .and(eventHist.outbDtm.loe(endDtm))
                        .and(eventHist.svcThemeCd.eq("SSC"))
                        .and(eventHist.unitSvcCd.eq("001"))
                        .and(eventHist.statEvetCd.ne("04"))
                        .and(eventHist.statEvetCd.ne("05"))
                        .and(eventHist.statEvetCd.notIn("03"))
                        .and(eventHist.znCd.eq(area))
                )
                .groupBy(eventHist.outbPlac, facInfo.facNm).fetch();
    }

    @Override
    public List<CountResult> findFacEventCountList(String startDtm, String endDtm) {
        return jpaQueryFactory.select(Projections.constructor(
                        CountResult.class,
                        eventHist.znCd,
                        znInfo.znNm,
                        eventHist.znCd.count()
                )).from(eventHist)
                .join(znInfo).on(znInfo.znCd.eq(eventHist.znCd))
                .join(facInfo).on(facInfo.mgtNo.eq(eventHist.outbPlac))
                .where(eventHist.outbDtm.goe(startDtm)
                        .and(eventHist.outbDtm.loe(endDtm))
                        .and(eventHist.svcThemeCd.eq("SSC"))
                        .and(eventHist.unitSvcCd.eq("002"))
                        .and(eventHist.statEvetGdCd.eq("01"))
                        .and(eventHist.statEvetCd.notIn("03")))
                .groupBy(eventHist.znCd, znInfo.znNm).fetch();
    }

    @Override
    public List<CountResult> findSubFacEventCountList(String startDtm, String endDtm, String area) {
        return jpaQueryFactory.select(Projections.constructor(
                        CountResult.class,
                        eventHist.outbPlac,
                        facInfo.facNm,
                        eventHist.outbPlac.count()
                )).from(eventHist)
                .join(facInfo).on(facInfo.mgtNo.eq(eventHist.outbPlac))
                .where(eventHist.outbDtm.goe(startDtm)
                        .and(eventHist.outbDtm.loe(endDtm))
                        .and(eventHist.svcThemeCd.eq("SSC"))
                        .and(eventHist.unitSvcCd.eq("002"))
                        .and(eventHist.statEvetGdCd.eq("01"))
                        .and(eventHist.statEvetCd.notIn("03"))
                        .and(eventHist.znCd.eq(area)))
                .groupBy(eventHist.outbPlac, facInfo.facNm).fetch();
    }


    @Override
    public List<IocStatEvetOutbHist> findEventTypeCountList(String startDtm, String endDtm) {
        return jpaQueryFactory.select(eventHist).from(eventHist)
                .join(eventInfo).on(eventInfo.statEvetCd.eq(eventHist.statEvetCd))
                .where(
                        eventHist.outbDtm.goe(startDtm)
                                .and(eventHist.outbDtm.lt(endDtm))
                                .and(eventHist.svcThemeCd.eq("SSC"))
                                .and(eventHist.unitSvcCd.eq("001"))
                                .and(eventHist.statEvetCd.ne("04"))
                                .and(eventHist.statEvetCd.ne("05"))
                                .and(eventHist.statEvetCd.notIn("03"))
                )
                .distinct().fetch();
    }

    @Override
    public List<IocStatEvetOutbHist> findSubEventTypeCountList(String startDtm, String endDtm, String area) {
        return jpaQueryFactory.select(eventHist).from(eventHist)
                .join(eventInfo).on(eventInfo.statEvetCd.eq(eventHist.statEvetCd))
                .where(
                        eventHist.outbDtm.goe(startDtm)
                                .and(eventHist.outbDtm.lt(endDtm))
                                .and(eventHist.svcThemeCd.eq("SSC"))
                                .and(eventHist.unitSvcCd.eq("001"))
                                .and(eventHist.statEvetCd.ne("04"))
                                .and(eventHist.statEvetCd.ne("05"))
                                .and(eventHist.statEvetCd.notIn("03"))
                                .and(eventHist.znCd.eq(area))
                                .and(eventHist.znCd.eq(area))
                )
                .distinct().fetch();
    }

    @Override
    public List<IocStatEvetOutbHist> findFacEventTypeCountList(String startDtm, String endDtm) {
        return jpaQueryFactory.select(eventHist).from(eventHist)
                .join(eventInfo).on(eventInfo.statEvetCd.eq(eventHist.statEvetCd))
                .where(eventHist.outbDtm.goe(startDtm)
                        .and(eventHist.outbDtm.lt(endDtm))
                        .and(eventHist.svcThemeCd.eq("SSC"))
                        .and(eventHist.unitSvcCd.eq("002"))
                        .and(eventHist.statEvetGdCd.eq("01"))
                        .and(eventHist.statEvetCd.notIn("03")))
                .orderBy(eventHist.statEvetCd.asc())
                .distinct().fetch();
    }

    @Override
    public List<IocStatEvetOutbHist> findSubFacEventTypeCountList(String startDtm, String endDtm, String area) {
        return jpaQueryFactory.select(eventHist).from(eventHist)
                .join(eventInfo).on(eventInfo.statEvetCd.eq(eventHist.statEvetCd))
                .where(eventHist.outbDtm.goe(startDtm)
                        .and(eventHist.outbDtm.lt(endDtm))
                        .and(eventHist.svcThemeCd.eq("SSC"))
                        .and(eventHist.unitSvcCd.eq("002"))
                        .and(eventHist.statEvetGdCd.eq("01"))
                        .and(eventHist.statEvetCd.notIn("03"))
                        .and(eventHist.znCd.eq(area))
                )
                .orderBy(eventHist.statEvetCd.asc())
                .distinct().fetch();
    }


    @Override
    public List<BellResult> findBellCountList(String startDtm, String endDtm) {
        return jpaQueryFactory.select(Projections.constructor(
                        BellResult.class,
                        eventHist.znCd,
                        znInfo.znNm,
                        eventHist.znCd.count()
                )).from(eventHist).join(znInfo).on(znInfo.znCd.eq(eventHist.znCd))
                .where(eventHist.outbDtm.goe(startDtm)
                        .and(eventHist.outbDtm.lt(endDtm))
                        .and(eventHist.svcThemeCd.eq("SSC"))
                        .and(eventHist.statEvetCd.eq("01"))
                        .and(eventHist.unitSvcCd.eq("001"))
                        .and(eventHist.statEvetCd.notIn("03"))
                        .and(znInfo.znCd.ne("400"))
                        .and(znInfo.znCd.like("4%"))).groupBy(eventHist.znCd, znInfo.znNm).orderBy(eventHist.znCd.asc()).fetch();
    }

    @Override
    public List<BellResult> findSubBellCountList(String startDtm, String endDtm, String area) {
        return jpaQueryFactory.select(Projections.constructor(
                        BellResult.class,
                        eventHist.outbPlac,
                        facInfo.facNm,
                        eventHist.outbPlac.count()
                )).from(eventHist)
                .join(facInfo).on(facInfo.mgtNo.eq(eventHist.outbPlac))
                .where(eventHist.outbDtm.goe(startDtm)
                        .and(eventHist.outbDtm.lt(endDtm))
                        .and(eventHist.svcThemeCd.eq("SSC"))
                        .and(eventHist.statEvetCd.eq("01"))
                        .and(eventHist.unitSvcCd.eq("001"))
                        .and(eventHist.statEvetCd.notIn("03"))
                        .and(eventHist.znCd.eq(area))).groupBy(eventHist.outbPlac, facInfo.facNm).fetch();
    }

    @Override
    public List<FacTypeResult> findFacTypeCountList(String startDtm, String endDtm) {
        return jpaQueryFactory.select(Projections.constructor(
                        FacTypeResult.class,
                        eventHist.statEvetCd,
                        eventInfo.statEvetNm,
                        eventHist.statEvetCd.count()
                )).from(eventHist).join(eventInfo).on(eventInfo.svcThemeCd.eq(eventHist.svcThemeCd))
                .where(eventHist.outbDtm.goe(startDtm)
                        .and(eventHist.outbDtm.loe(endDtm))
                        .and(eventHist.svcThemeCd.eq("SSC"))
                        .and(eventHist.statEvetGdCd.eq("01"))
                        .and(eventHist.unitSvcCd.eq("002"))
                        .and(eventHist.statEvetCd.notIn("03"))
                        .and(eventInfo.znCd.eq(eventHist.znCd))
                        .and(eventHist.unitSvcCd.eq(eventInfo.unitSvcCd))
                        .and(eventInfo.statEvetCd.eq(eventHist.statEvetCd))
                        .and(eventInfo.statEvetNm.notLike("%상태"))
                )
                .groupBy(eventHist.statEvetCd, eventInfo.statEvetNm)
                .orderBy(eventHist.statEvetCd.asc())
                .distinct()
                .fetch();
    }

    @Override
    public List<FacTypeResult> findSubFacTypeCountList(String startDtm, String endDtm, String area) {
        return jpaQueryFactory.select(Projections.constructor(
                        FacTypeResult.class,
                        eventHist.statEvetCd,
                        eventInfo.statEvetNm,
                        eventHist.statEvetCd.count()
                )).from(eventHist).join(eventInfo).on(eventInfo.svcThemeCd.eq(eventHist.svcThemeCd))
                .where(eventHist.outbDtm.goe(startDtm)
                        .and(eventHist.outbDtm.loe(endDtm))
                        .and(eventHist.svcThemeCd.eq("SSC"))
                        .and(eventHist.statEvetGdCd.eq("01"))
                        .and(eventHist.unitSvcCd.eq("002"))
                        .and(eventHist.statEvetCd.notIn("03"))
                        .and(eventInfo.znCd.eq(eventHist.znCd))
                        .and(eventInfo.znCd.eq(area))
                        .and(eventHist.unitSvcCd.eq(eventInfo.unitSvcCd))
                        .and(eventInfo.statEvetCd.eq(eventHist.statEvetCd))
                        .and(eventInfo.statEvetNm.notLike("%상태"))
                )
                .groupBy(eventHist.statEvetCd, eventInfo.statEvetNm)
                .orderBy(eventHist.statEvetCd.asc())
                .distinct()
                .fetch();
    }

    @Override
    public List<ScResult> findScCountList(String startDtm, String endDtm) {

        return jpaQueryFactory
                .select(
                        Projections.constructor(
                                ScResult.class,
                                eventHist.outbPlac,
                                facInfo.facNm,
                                eventHist.count()
                        ))
                .from(eventHist)
                .join(facInfo).on(facInfo.mgtNo.eq(eventHist.outbPlac))
                .where(
                        eventHist.outbDtm.goe(startDtm),
                        eventHist.outbDtm.lt(endDtm),
                        eventHist.statEvetCd.in("01", "02"),
                        eventHist.statEvetCd.notIn("03"),
                        eventHist.svcThemeCd.eq("SSC"),
                        eventHist.unitSvcCd.eq("001")
                )
                .groupBy(eventHist.outbPlac, facInfo.facNm)
                .fetch();
    }

    @Override
    public List<ScResult> findSubScCountList(String startDtm, String endDtm, String area) {
        return jpaQueryFactory
                .select(
                        Projections.constructor(
                                ScResult.class,
                                eventHist.outbPlac,
                                facInfo.facNm,
                                eventHist.count()
                        ))
                .from(eventHist)
                .join(facInfo).on(facInfo.mgtNo.eq(eventHist.outbPlac))
                .where(
                        eventHist.outbDtm.goe(startDtm),
                        eventHist.outbDtm.lt(endDtm),
                        eventHist.statEvetCd.in("01", "02"),
                        eventHist.statEvetCd.notIn("03"),
                        eventHist.svcThemeCd.eq("SSC"),
                        eventHist.unitSvcCd.eq("001"),
                        eventHist.znCd.eq(area)
                )
                .groupBy(eventHist.outbPlac, facInfo.facNm)
                .fetch();
    }

    @Override
    public List<ScResult> findFacScCountList(String startDtm, String endDtm) {
        return jpaQueryFactory.select(
                        Projections.constructor(
                                ScResult.class,
                                eventHist.outbPlac,
                                facInfo.facNm,
                                eventHist.count()
                        )).from(eventHist).join(facInfo).on(facInfo.mgtNo.eq(eventHist.outbPlac))
                .where(eventHist.outbDtm.goe(startDtm)
                        .and(eventHist.outbDtm.lt(endDtm))
                        .and(eventHist.svcThemeCd.eq("SSC"))
                        .and(eventHist.statEvetGdCd.eq("01"))
                        .and(eventHist.unitSvcCd.eq("002"))
                        .and(eventHist.statEvetCd.notIn("03")))
                .orderBy(eventHist.count().desc())
                .limit(10)
                .groupBy(eventHist.outbPlac, facInfo.facNm)
                .fetch();
    }


    @Override
    public List<ScResult> findSubFacScCountList(String startDtm, String endDtm, String area, List<String> scList) {
        return jpaQueryFactory.select(
                        Projections.constructor(
                                ScResult.class,
                                eventHist.outbPlac,
                                facInfo.facNm,
                                eventHist.count()
                        )).from(eventHist).join(facInfo).on(facInfo.mgtNo.eq(eventHist.outbPlac))
                .where(eventHist.outbDtm.goe(startDtm)
                        .and(eventHist.outbDtm.lt(endDtm))
                        .and(eventHist.svcThemeCd.eq("SSC"))
                        .and(eventHist.statEvetGdCd.eq("01"))
                        .and(eventHist.unitSvcCd.eq("002"))
                        .and(eventHist.statEvetCd.notIn("03"))
                        .and(eventHist.znCd.eq(area))
                        .and(facInfo.mgtNo.in(scList))
                )
                .orderBy(eventHist.count().desc())
                .limit(5)
                .groupBy(eventHist.outbPlac, facInfo.facNm)
                .fetch();
    }

    @Override
    public List<TodayEventItem> findTodayScEventList(String startDtm, String endDtm, String mgtNo) {
        return jpaQueryFactory
                .select(Projections.constructor(
                        TodayEventItem.class,
                        eventHist.statEvetOutbSeqn,
                        eventInfo.statEvetNm,
                        eventHist.statEvetCd,
                        eventHist.statEvetGdCd,
                        eventHist.outbDtm,
                        Expressions.constant(""),
                        Expressions.constant(mgtNo),
                        eventHist.znCd
                ))
                .from(eventHist)
                .leftJoin(facInfo).on(facInfo.mgtNo.eq(eventHist.outbPlac))
                .leftJoin(eventInfo).on(eventInfo.statEvetCd.eq(eventHist.statEvetCd))
                .where(
                        eventHist.outbDtm.goe(startDtm + "000000000")
                                .and(eventHist.outbDtm.lt(endDtm + "235959999"))
                                .and(eventHist.svcThemeCd.eq("SSC"))
                                .and(eventHist.unitSvcCd.eq("002"))
                                .and(eventInfo.svcThemeCd.eq("SSC"))
                                .and(eventInfo.unitSvcCd.eq("002"))
                                .and(eventHist.outbPlac.eq(mgtNo))
                                .and(eventHist.statEvetCd.notIn("03"))
                )
                .fetch();
    }


    public BooleanBuilder makeSelectWhereBuilder(List<String> znCds, List<String> statEventCds, String startDtm, String endDtm, String plcId) {
        String unitSvcCd = plcId.equals(PLCID_NULL) ? "001" : "002";
        String statEvetGdCd = plcId.equals(PLCID_NULL) ? null : "00";


        BooleanBuilder whereBuilder = new BooleanBuilder();
        whereBuilder.and(eventHist.svcThemeCd.eq("SSC"))
                .and(eventHist.unitSvcCd.eq(unitSvcCd))
                .and(eventHist.statEvetCd.notIn("03"))
                .and(posHist.xCrdnt.isNotNull())
                .and(posHist.yCrdnt.isNotNull())
                .and(posHist.xCrdnt.ne("0"))
                .and(posHist.yCrdnt.ne("0"))
                .and(eventHist.outbPlac.contains("_"));
        ;

        if (statEvetGdCd != null) {
            whereBuilder.and(eventHist.statEvetGdCd.ne(statEvetGdCd));
        }

        if (!statEventCds.isEmpty()) {
            whereBuilder.and(eventHist.statEvetCd.in(statEventCds));
        }

        if (!startDtm.isEmpty() && !endDtm.isEmpty()) {
            whereBuilder.and(eventHist.outbDtm.between(startDtm, endDtm));
        }

        if (!znCds.isEmpty()) {
            whereBuilder.and(znInfo.znCd.in(znCds));
        }

        return whereBuilder;
    }


    private JPAQuery<EventDataResult> buildListBaseQuery() {
        return jpaQueryFactory.select(Projections.constructor(
                        EventDataResult.class,
                        eventHist.procSt,
                        eventInfo.statEvetNm,
                        unitSvcInfo.unitSvcCd,
                        znInfo.znNm,
                        znInfo.znCd,
                        facInfo.mgtNo,
                        facInfo.addrShort,
                        facInfo.posNm,
                        Expressions.stringTemplate("substring({0}, 1, 14)", eventHist.outbDtm),
                        Expressions.stringTemplate("substring({0}, 1, 14)", eventHist.clrDtm),
                        eventInfo.statEvetNm,
                        eventInfo.statEvetCd,
                        posHist.xCrdnt,
                        posHist.yCrdnt,
                        eventHist.statEvetCntn,
                        eventHist.statEvetOutbSeqn
                )).from(eventHist)
                .leftJoin(unitSvcInfo)
                .on(eventHist.znCd.eq(unitSvcInfo.znCd)
                        .and(eventHist.unitSvcCd.eq(unitSvcInfo.unitSvcCd))
                        .and(eventHist.svcThemeCd.eq(unitSvcInfo.svcThemeCd)))
                .leftJoin(znInfo)
                .on(unitSvcInfo.znCd.eq(znInfo.znCd))
                .leftJoin(facInfo)
                .on(eventHist.outbPlac.eq(facInfo.mgtNo))
                .leftJoin(eventInfo)
                .on(eventHist.statEvetCd.eq(eventInfo.statEvetCd).and(eventInfo.unitSvcCd.eq(eventHist.unitSvcCd).and(eventInfo.svcThemeCd.eq(eventHist.svcThemeCd).and(eventInfo.statEvetCd.eq(eventHist.statEvetCd).and(eventHist.evetGbCd.eq(eventInfo.evetGbCd))))))
                .leftJoin(posHist)
                .on(eventHist.statEvetOutbSeqn.eq(posHist.statEvetOutbSeqn)).distinct();
    }


}
