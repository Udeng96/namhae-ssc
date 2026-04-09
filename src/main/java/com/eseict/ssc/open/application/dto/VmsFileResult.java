package com.eseict.ssc.open.application.dto;

import com.eseict.ssc.open.domain.entity.VmsContent;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class VmsFileResult {
    private List<VmsContent> vmsImages;
    private List<VmsContent> vmsVideos;
}
