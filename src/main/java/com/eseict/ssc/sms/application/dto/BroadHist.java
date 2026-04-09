package com.eseict.ssc.sms.application.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class BroadHist {
    private String eventType;
    private String msgTitle;
    private String msgContent;
    private String targetList;
    private String sendTime;
    private int lastTtsKey;
}
