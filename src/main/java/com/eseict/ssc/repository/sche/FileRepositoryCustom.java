package com.eseict.ssc.repository.sche;


import com.eseict.ssc.schedule.application.dto.SocialFileResult;

import java.util.List;

public interface FileRepositoryCustom {
    List<SocialFileResult> findFilesByFileIds(List<String> fileIds);
}
