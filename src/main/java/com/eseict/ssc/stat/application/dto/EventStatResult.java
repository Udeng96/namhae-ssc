package com.eseict.ssc.stat.application.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class EventStatResult {
    Integer allCnt;
    List<CountResult> gisStats;
    List<DateResult> eventDateStats;
    List<BellResult> eventBellStats;
    List<ScResult> eventScStats;
}
