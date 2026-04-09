package com.eseict.ssc.repository.fac;

import com.eseict.ssc.facility.application.dto.FacItem;
import com.eseict.ssc.sms.application.dto.BroadDeviceInfo;
import com.eseict.ssc.facility.domain.entity.*;
import com.querydsl.core.BooleanBuilder;
import com.querydsl.core.types.Projections;
import com.querydsl.core.types.dsl.Expressions;
import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Repository;

import java.util.List;

@RequiredArgsConstructor
@Repository
@Slf4j
public class FacRepositoryImpl implements FacRepositoryCustom {


    private final JPAQueryFactory jpaQueryFactory;

    private final QErfFacInfo facInfo = QErfFacInfo.erfFacInfo;
    private final QErfPosCrdnt posInfo = QErfPosCrdnt.erfPosCrdnt;
    private final QErfFacClfy clfyInfo = QErfFacClfy.erfFacClfy;
    private final QErfCoInfo coInfo = QErfCoInfo.erfCoInfo;
    private final QErfFacClfyAddInfoData clfyAddInfo = QErfFacClfyAddInfoData.erfFacClfyAddInfoData;
    private final QTblAreaInfo areaInfo = QTblAreaInfo.tblAreaInfo;

    @Override
    public ErfPosCrdnt findSocketEventErfInfo(String facId) {
        return jpaQueryFactory.selectFrom(posInfo)
                .where(posInfo.facId.eq(facId)).fetchOne();
    }

    @Override
    public List<TblAreaInfo> findFacSubAreaCds(List<String> areaCds) {
        if (areaCds.isEmpty()) {
            return jpaQueryFactory.selectFrom(areaInfo)
                    .where(areaInfo.areaId.substring(8, 11).ne("000"))
                    .orderBy(areaInfo.areaId.asc()).fetch();
        } else {
            return jpaQueryFactory.selectFrom(areaInfo)
                    .where(areaInfo.areaId.substring(1, 7).in(areaCds)
                            .and(areaInfo.areaId.substring(8, 11).ne("000")))
                    .orderBy(areaInfo.areaId.asc()).fetch();
        }

    }

    @Override
    public List<FacItem> findFacListByAreaCds(List<String> areaCds, String scName, List<String> sscFacClfyIds) {
        return jpaQueryFactory.selectDistinct(Projections.constructor(
                        FacItem.class,
                        areaInfo.areaName,
                        facInfo.area,
                        facInfo.posNm,
                        facInfo.addrShort,
                        facInfo.facClfyId,
                        facInfo.facNm,
                        facInfo.facId,
                        clfyInfo.facClfyNm,
                        posInfo.xCrdnt,
                        posInfo.yCrdnt,
                        facInfo.updDtm,
                        facInfo.mgtNo,
                        facInfo.useYn,
                        clfyInfo.topFacClfyId
                )).from(facInfo).join(areaInfo).on(areaInfo.areaId.eq(facInfo.area))
                .join(posInfo).on(facInfo.facId.eq(posInfo.facId))
                .join(clfyInfo).on(clfyInfo.facClfyId.eq(facInfo.facClfyId))
                .where(makeFacListWhereBuiler(areaCds, sscFacClfyIds, scName))
                .orderBy(facInfo.facNm.asc())
                .fetch();
    }

    @Override
    public List<BroadDeviceInfo> findBroadDeviceLists(List<String> clfyIds) {

        return jpaQueryFactory.select(Projections.constructor(
                        BroadDeviceInfo.class,
                        facInfo.facId,
                        facInfo.addrShort,
                        coInfo.coNm,
                        facInfo.facNm,
                        facInfo.area,
                        facInfo.facTyp,
                        facInfo.mgtNo,
                        posInfo.xCrdnt,
                        posInfo.yCrdnt,
                        facInfo.setuDtm,
                        facInfo.facDesc,
                        clfyAddInfo.id.addInfoId,
                        clfyAddInfo.addInfoData,
                        facInfo.facClfyId,
                        Expressions.constant("정상")
                )).from(facInfo).join(posInfo).on(facInfo.facId.eq(posInfo.facId))
                .join(coInfo).on(facInfo.coId.eq(coInfo.coId))
                .join(clfyAddInfo).on(facInfo.facId.eq(clfyAddInfo.id.facId))
                .where(facInfo.mfmn.eq("22_EAS").and(facInfo.facClfyId.in(clfyIds))).fetch();
    }

    public BooleanBuilder makeFacListWhereBuiler(List<String> areaCds, List<String> sscFacClfyIds, String scName) {
        BooleanBuilder whereBuilder = new BooleanBuilder();
        whereBuilder.and(clfyInfo.facClfyId.in(sscFacClfyIds))
                .and(clfyInfo.useYn.eq(true));

        if (!areaCds.isEmpty()) {
            whereBuilder.and(facInfo.area.in(areaCds));
        }

        if (!scName.isEmpty()) {
            whereBuilder.and(facInfo.facNm.like(scName));
        }

        return whereBuilder;

    }
}
