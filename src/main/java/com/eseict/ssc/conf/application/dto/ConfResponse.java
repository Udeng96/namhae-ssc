package com.eseict.ssc.conf.application.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class ConfResponse {
    private String status;
    private Integer count;
    private String message;
    private SessionInfo sessionInfo;


    @Data
    public class SessionInfo{
        private String mobileScheme;
        private String customerID;
        private String startTime;
        private String pcScheme;
        private int sessionId;
        private String endTime;
        private String extID;
        private String userID;
    }
}
