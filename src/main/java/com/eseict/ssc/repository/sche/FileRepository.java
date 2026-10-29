package com.eseict.ssc.repository.sche;

import com.eseict.ssc.schedule.domain.entity.ScheUploadFileInfo;
import com.eseict.ssc.repository.sche.FileRepositoryCustom;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface FileRepository extends JpaRepository<ScheUploadFileInfo, String>, FileRepositoryCustom {

    List<ScheUploadFileInfo> findByNormalYn(String normalYn);

    /** 정렬 지정 가능한 오버로드 — Spring Data JPA 가 Sort 파라미터를 자동 적용. */
    List<ScheUploadFileInfo> findByNormalYn(String normalYn, Sort sort);

    List<ScheUploadFileInfo> findAllByFileNmAndFileTypeAndNormalYn(String fileNm, String fileType, String normalYn);
}
