package com.eseict.ssc.schedule.application.dto;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class SocialResultItem {
    String contentId;
    String contentTitle;
    String contentCntn;
    String contentType;
    String contentArea;
    String startDtm;
    String endDtm;
    String expireDtm;
    String expireTime;
    List<SocialFileResult> fileList;
}
