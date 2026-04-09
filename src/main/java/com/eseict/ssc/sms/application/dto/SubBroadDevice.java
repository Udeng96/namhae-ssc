package com.eseict.ssc.sms.application.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class SubBroadDevice {

    private String id;
    private String pid;
    private String disabled;
    private String name;
    private String lon;
    private String lat;
    List<LastBroadDevice> childBroadDeviceList;

    public SubBroadDevice(String id, String pid, String disabled, String name) {
        this.id = id;
        this.pid = pid;
        this.disabled = disabled;
        this.name = name;
    }

    public SubBroadDevice(String id, String pid, String disabled, String name, List<LastBroadDevice> childBroadDeviceList) {
        this.id = id;
        this.pid = pid;
        this.disabled = disabled;
        this.name = name;
        this.childBroadDeviceList = childBroadDeviceList;
    }
}
