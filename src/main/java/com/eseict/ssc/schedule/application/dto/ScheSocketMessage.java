package com.eseict.ssc.schedule.application.dto;

import com.eseict.ssc.schedule.domain.entity.ScheContentScheduleInfo;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ScheSocketMessage {
    private String postType;
    private ScheContentScheduleInfo message;
}
