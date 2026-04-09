package com.eseict.ssc.stat.application.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class FacStatResult {
    Integer allCnt;
    List<CountResult> gisStats;
    List<DateResult> facDateStats;
    List<FacTypeResult> facTypeStats;
    List<ScResult> facScStats;
}
