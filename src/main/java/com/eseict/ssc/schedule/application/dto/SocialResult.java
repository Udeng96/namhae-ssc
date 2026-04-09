package com.eseict.ssc.schedule.application.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SocialResult {
    private List<SocialResultItem> videos;
    private List<SocialResultItem> norms;
    private List<SocialResultItem> emers;
}
