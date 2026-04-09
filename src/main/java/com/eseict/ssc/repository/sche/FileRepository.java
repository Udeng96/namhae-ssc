package com.eseict.ssc.repository.sche;

import com.eseict.ssc.schedule.domain.entity.ScheUploadFileInfo;
import com.eseict.ssc.repository.sche.FileRepositoryCustom;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface FileRepository extends JpaRepository<ScheUploadFileInfo, String>, FileRepositoryCustom {

    List<ScheUploadFileInfo> findByNormalYn(String normalYn);

    List<ScheUploadFileInfo> findAllByFileNmAndFileTypeAndNormalYn(String fileNm, String fileType, String normalYn);
}
