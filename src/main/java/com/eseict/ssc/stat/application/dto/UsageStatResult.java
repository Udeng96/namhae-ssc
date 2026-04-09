package com.eseict.ssc.stat.application.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class UsageStatResult {
    List<KeyCountItem> serviceUsage;
    List<KeyCountItem> visitorUsage;
    List<KeyCountItem> openConfUsage;
    List<KeyCountItem> connConfUsage;
    List<KeyCountItem> contentUsage;
    List<KeyCountItem> contentAreaUsage;
    List<KeyCountItem> seniorUsage;     // 경로당 이용률
}
