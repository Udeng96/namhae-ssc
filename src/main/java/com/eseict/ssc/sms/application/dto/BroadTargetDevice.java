package com.eseict.ssc.sms.application.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class BroadTargetDevice {
    private String dsNm;
    private String dsCode;
    private List<String> deviceNameList = new ArrayList<>();
}
