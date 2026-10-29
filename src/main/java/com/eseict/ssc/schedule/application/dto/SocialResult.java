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
    private com.eseict.ssc.config.props.MediaCacheProperties.Policy mediaCache;

    public SocialResult(List<SocialResultItem> videos, List<SocialResultItem> norms, List<SocialResultItem> emers) {
        this.videos = videos; this.norms = norms; this.emers = emers;
    }
}
