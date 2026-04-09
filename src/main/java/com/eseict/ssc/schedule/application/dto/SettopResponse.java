package com.eseict.ssc.schedule.application.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode
@Data
public class SettopResponse {
    private String status; // "1" success / "0" fail
    private String message;
}
