package com.eseict.ssc.sms.application.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class SendContent {
    private String eventSeq;
    private String title;
    private String content;
    private List<String> sndTarget;
    private String type;
}
