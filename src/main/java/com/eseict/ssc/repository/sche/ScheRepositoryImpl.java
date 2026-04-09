package com.eseict.ssc.repository.sche;

import com.eseict.ssc.config.ApiConstants;
import com.eseict.ssc.schedule.domain.entity.QScheContentScheduleInfo;
import com.eseict.ssc.schedule.domain.entity.ScheContentScheduleInfo;
import com.querydsl.core.BooleanBuilder;
import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Repository;

import java.util.List;


@RequiredArgsConstructor
@Repository
@Slf4j
public class ScheRepositoryImpl implements ScheRepositoryCustom {


    private final JPAQueryFactory jpaQueryFactory;
    private final QScheContentScheduleInfo scheInfo = QScheContentScheduleInfo.scheContentScheduleInfo;

    // 컨텐츠 타입별 표출 기간이 지난 컨텐츠 조회
    @Override
    public List<ScheContentScheduleInfo> findOverContentByContentType(String contentType, String nowDate, String nowTime) {
        return jpaQueryFactory
                .select(scheInfo)
                .from(scheInfo)
                .where(scheInfo.contentType.eq(contentType)
                        .and(scheInfo.endDtm.loe(nowDate))
                        .and(scheInfo.endTime.loe(nowTime))) // 현재 시간이 끝 시간보다 크거나 같으면 이미 지난 것.
                .fetch();
    }

    // 컨텐츠 타입별 표출되지 않는 컨텐츠 조회
    @Override
    public List<ScheContentScheduleInfo> findPendingContentByType(String contentType, String nowDate, String nowTime) {
        return jpaQueryFactory
                .select(scheInfo)
                .from(scheInfo)
                .where(scheInfo.contentType.eq(contentType)
                        .and(scheInfo.endDtm.gt(nowDate))
                        .and(scheInfo.endTime.gt(nowTime))) // 현재시간이 아직 끝시간보다 작으면
                // 같으면이 안되는 이유는 끝 시간은 해당 시간이 되자마자 컨텐츠가 종료되어야 하기 때문.
                .fetch();
    }

    // 현재 표출중인 컨텐츠
    @Override
    public List<ScheContentScheduleInfo> findBroadingContentByType(String contentType, String nowDate, String nowTime, String nowMin, String nowSec) {
        BooleanBuilder where = new BooleanBuilder();
        where.and(scheInfo.contentType.eq(contentType));


        if(!contentType.equals(ApiConstants.CONTENT_TYPE.EMERGENCY)){
            where.and(scheInfo.startDtm.loe(nowDate));
            where.and(scheInfo.startTime.loe(nowTime));
            where.and(scheInfo.endDtm.goe(nowDate));
            where.and(scheInfo.endTime.gt(nowTime));
        }else{
            where.and(scheInfo.expireDtm.goe(nowDate+nowTime+nowMin+nowSec));
            where.and(scheInfo.contentTitle.notLike("%비상벨 회의 종료%"));
            where.and(scheInfo.contentTitle.notLike("%refresh%"));
        }
        return jpaQueryFactory
                .select(scheInfo)
                .from(scheInfo)
                .where(where)
                .fetch();
    }

    @Override
    public List<ScheContentScheduleInfo> chkDuplication(String contentType, String startDtm, String endDtm, String contentGrpId) {
        BooleanBuilder whereBuilder = new BooleanBuilder();
        whereBuilder.and(scheInfo.startDtm.concat(scheInfo.startTime).lt(endDtm));
        whereBuilder.and(scheInfo.endDtm.concat(scheInfo.endTime).goe(startDtm));
        whereBuilder.and(scheInfo.startDtm.concat(scheInfo.startTime).eq(startDtm));
        whereBuilder.and(scheInfo.contentType.eq(contentType));


        if(!contentGrpId.isEmpty()){
            log.info("contentGrpId : {}", contentGrpId);
            whereBuilder.and(scheInfo.contentGrpId.ne(contentGrpId));
        }

        return jpaQueryFactory
                .select(scheInfo)
                .from(scheInfo)
                .where(whereBuilder)
                .fetch();
    }
}
