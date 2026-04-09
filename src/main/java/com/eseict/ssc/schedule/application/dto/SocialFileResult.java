package com.eseict.ssc.schedule.application.dto;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SocialFileResult {

    String fileId;
    String fileNm;
    String fileType;
    boolean isNoti;

    public  SocialFileResult(String fileId, String fileNm, String fileType){
        this.fileId = fileId;
        this.fileNm = fileNm;
        this.fileType = fileType;
        this.isNoti = false;
    }

}
