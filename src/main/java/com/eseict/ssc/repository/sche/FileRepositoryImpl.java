package com.eseict.ssc.repository.sche;

import com.eseict.ssc.schedule.application.dto.SocialFileResult;
import com.eseict.ssc.schedule.domain.entity.QScheUploadFileInfo;
import com.querydsl.core.types.Projections;
import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.List;


@RequiredArgsConstructor
@Repository
public class FileRepositoryImpl implements FileRepositoryCustom {


    private final JPAQueryFactory jpaQueryFactory;

    private final QScheUploadFileInfo fileInfo = QScheUploadFileInfo.scheUploadFileInfo;

    @Override
    public List<SocialFileResult> findFilesByFileIds(List<String> fileIds) {
        return jpaQueryFactory.select(Projections.constructor(
                SocialFileResult.class,
                fileInfo.fileId,
                fileInfo.fileNm,
                fileInfo.fileType
        )).from(fileInfo).where(fileInfo.fileId.in(fileIds)).fetch();
    }
}
