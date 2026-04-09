package com.eseict.ssc.sms.application.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class BroadArea {

    String dsName;
    private List<BroadInfo> list;

    public BroadArea(String dsName) {
        this.dsName = dsName;
    }
}
