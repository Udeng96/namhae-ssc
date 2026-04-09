package com.eseict.ssc.sms.application.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class LastBroadDevice {
    private String id;
    private String pid;
    private String disabled;
    private String name;
    private String lon;
    private String lat;
}
