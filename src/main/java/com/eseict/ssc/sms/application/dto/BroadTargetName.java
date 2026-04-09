package com.eseict.ssc.sms.application.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class BroadTargetName {
    private String dsNm;
    private String dsCode;
    private List<String> deviceNameList = new ArrayList<>();

    public BroadTargetName(String dsCode, String deviceName) {
        this.dsCode = dsCode;
        deviceNameList.add(deviceName.trim());
    }

    public void addDeviceName(String deviceName) {
        deviceNameList.add(deviceName);
    }

    public String makeTargetDeviceMessage() {
        String TargetDeviceMessage = this.dsNm + "<";
        for (String deviceName : this.deviceNameList) {
            TargetDeviceMessage += deviceName + ",";
        }
        TargetDeviceMessage = TargetDeviceMessage.substring(0, TargetDeviceMessage.length() - 1);
        TargetDeviceMessage += ">";
        return TargetDeviceMessage;
    }
}
