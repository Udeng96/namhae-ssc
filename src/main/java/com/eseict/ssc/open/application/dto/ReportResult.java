package com.eseict.ssc.open.application.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class ReportResult {
    private String resultCode;
    private String resultType;
    private String resultTime;
    private String resultTitle;
    private String resultMessage;
}
