package com.eseict.ssc.sms.application.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class BroadSendTarget {
    private String targetInfo;
    private String targetSpotName;
}
