package com.eseict.ssc.repository.scm;

import com.eseict.ssc.stat.application.dto.CountResult;
import com.eseict.ssc.stat.application.dto.DateTypeItem;
import com.eseict.ssc.stat.application.dto.FacTypeResult;
import com.eseict.ssc.stat.application.dto.TimeResult;
import com.eseict.ssc.facility.domain.entity.QErfFacInfo;
import com.eseict.ssc.facility.domain.entity.QTblAreaInfo;
import com.eseict.ssc.facility.domain.entity.QOperatingHist;
import com.querydsl.core.types.Projections;
import com.querydsl.core.types.dsl.*;
import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * OperRepositoryImpl
 */
@RequiredArgsConstructor
@Repository
public class OperRepositoryImpl implements OperRepositoryCustom {

    private final JPAQueryFactory jpaQueryFactory;
    QOperatingHist operHist = QOperatingHist.operatingHist;
    QTblAreaInfo areaInfo = QTblAreaInfo.tblAreaInfo;
    QErfFacInfo facInfo = QErfFacInfo.erfFacInfo;

    @Override
    public List<CountResult> findOperCountList(String startDtm, String endDtm) {
        StringTemplate groupedAreaCd = Expressions.stringTemplate(
                "concat(substring({0}, 1, 7),'000')", operHist.centerArea);

        return jpaQueryFactory
                .select(Projections.constructor(
                        CountResult.class,
                        groupedAreaCd,
                        areaInfo.areaName,
                        Expressions.numberTemplate(Double.class, "AVG({0})", operHist.facilityOperatingRate)
                ))
                .from(operHist)
                .join(areaInfo).on(
                        Expressions.stringTemplate("substring({0}, 1, 7)", operHist.centerArea)
                                .eq(Expressions.stringTemplate("substring({0}, 1, 7)", areaInfo.areaId))
                )
                .where(
                        operHist.operatingType.eq("daily")
                                .and(operHist.calcTime.loe(endDtm))
                                .and(operHist.calcTime.goe(startDtm))
                                .and(groupedAreaCd.eq(areaInfo.areaId))
                )
                .groupBy(groupedAreaCd, areaInfo.areaName)
                .fetch();
    }

    public List<CountResult> findSubOperCountList(String startDtm, String endDtm, String area) {
        return jpaQueryFactory
                .select(Projections.constructor(
                        CountResult.class,
                        operHist.centerName,
                        facInfo.facNm,
                        Expressions.numberTemplate(Double.class, "AVG({0})", operHist.facilityOperatingRate)
                ))
                .from(operHist)
                .join(facInfo).on(facInfo.mgtNo.eq(operHist.centerName))
                .where(
                        operHist.operatingType.eq("daily")
                                .and(operHist.calcTime.loe(endDtm))
                                .and(operHist.calcTime.goe(startDtm))
                                .and(Expressions.stringTemplate(
                                        "concat(substring({0}, 1, 7),'000')", operHist.centerArea).eq(area)))
                .groupBy(facInfo.facNm, operHist.centerName)
                .fetch();
    }

    @Override
    public List<FacTypeResult> findOperFacList(String startDtm, String endDtm) {
        return jpaQueryFactory.select(Projections.constructor(
                        FacTypeResult.class,
                        operHist.facilityType,
                        new CaseBuilder()
                                .when(operHist.facilityType.contains("Bell")).then("비상벨")
                                .when(operHist.facilityType.contains("Fire")).then("화재 센서")
                                .when(operHist.facilityType.contains("Gas")).then("가스 센서")
                                .when(operHist.facilityType.contains("cctv")).then("CCTV")
                                .otherwise("셋톱 박스"),
                        Expressions.numberTemplate(Integer.class, "FLOOR(AVG({0}))", operHist.facilityOperatingRate)
                )).from(operHist)
                .where(operHist.calcTime.goe(startDtm)
                        .and(operHist.calcTime.loe(endDtm))
                        .and(operHist.operatingType.eq("daily")))
                .groupBy(operHist.facilityType)
                .fetch();
    }

    @Override
    public List<FacTypeResult> findSubOperFacList(String startDtm, String endDtm, String area) {
        return jpaQueryFactory.select(Projections.constructor(
                        FacTypeResult.class,
                        operHist.facilityType,
                        new CaseBuilder()
                                .when(operHist.facilityType.contains("Bell")).then("비상벨")
                                .when(operHist.facilityType.contains("Fire")).then("화재 센서")
                                .when(operHist.facilityType.contains("Gas")).then("가스 센서")
                                .when(operHist.facilityType.contains("cctv")).then("CCTV")
                                .otherwise("셋톱 박스"),
                        Expressions.numberTemplate(Integer.class, "FLOOR(AVG({0}))", operHist.facilityOperatingRate)
                )).from(operHist)
                .where(operHist.calcTime.goe(startDtm)
                        .and(operHist.calcTime.loe(endDtm))
                        .and(operHist.operatingType.eq("daily"))
                        .and(Expressions.stringTemplate(
                                "concat(substring({0}, 1, 7),'000')", operHist.centerArea).eq(area)))
                .groupBy(operHist.facilityType)
                .fetch();
    }

    @Override
    public List<TimeResult> findOperScList(String startDtm, String endDtm) {
        StringTemplate groupedAreaCd = Expressions.stringTemplate(
                "concat(substring({0}, 1, 7),'000')", operHist.centerArea);

        NumberTemplate<Integer> countExpr = Expressions.numberTemplate(
                Integer.class,
                "FLOOR(AVG({0} * 24 / 100))",
                operHist.facilityOperatingRate
        );

        return jpaQueryFactory
                .select(Projections.constructor(
                        TimeResult.class, // DTO에 맞게 변경
                        groupedAreaCd,
                        areaInfo.areaName,
                        countExpr
                ))
                .from(operHist)
                .join(areaInfo).on(
                        Expressions.stringTemplate("substring({0}, 1, 7)", operHist.centerArea)
                                .eq(Expressions.stringTemplate("substring({0}, 1, 7)", areaInfo.areaId))
                )
                .where(
                        operHist.operatingType.eq("daily")
                                .and(operHist.calcTime.between(startDtm, endDtm))
                                .and(groupedAreaCd.eq(areaInfo.areaId))
                )
                .groupBy(groupedAreaCd, areaInfo.areaName)
                .fetch();
    }

    @Override
    public List<TimeResult> findSubOperScList(String startDtm, String endDtm, String area) {
        StringTemplate groupedAreaCd = Expressions.stringTemplate(
                "concat(substring({0}, 1, 7),'000')", operHist.centerArea);

        NumberTemplate<Integer> countExpr = Expressions.numberTemplate(
                Integer.class,
                "FLOOR(AVG({0} * 24 / 100))",
                operHist.facilityOperatingRate
        );

        return jpaQueryFactory
                .select(Projections.constructor(
                        TimeResult.class, // DTO에 맞게 변경
                        operHist.centerName,
                        facInfo.facNm,
                        countExpr
                ))
                .from(operHist)
                .join(facInfo).on(facInfo.mgtNo.eq(operHist.centerName))
                .where(
                        operHist.operatingType.eq("daily")
                                .and(operHist.calcTime.between(startDtm, endDtm))
                                .and(groupedAreaCd.eq(area))
                )
                .groupBy(operHist.centerName, facInfo.facNm)
                .fetch();
    }
}
