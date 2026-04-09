package com.eseict.ssc.sms.application.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class BroadContent {
    String eventSeq;
    String broadcastDirTitle;
    String broadcastDirText;
    String sendDtm;
    String broadcastId;
    List<BroadContentSc> termKeySetList;
}
