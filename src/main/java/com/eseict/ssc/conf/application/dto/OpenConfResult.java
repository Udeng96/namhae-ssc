package com.eseict.ssc.conf.application.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class OpenConfResult {
    private String seqn;
    private String statEvetOutbSeqn;        // 시퀀스
    private String mobileScheme;            // 모바일 회의 주소(안드로이드셋톱)
    private String pcScheme;                // pc 회의주소
    private String startTime;               // 회의 시작 시간
    private String endTime;                 // 회의 종료 시간
    private String userId;                  // 유저아이디 (경로당 셋톱박스 아이디)
    private String plcId;                   // 경로당 아이디
    private String plcNm;                   // 경로당 이름
    private String confStatus;              // 회의 상태
}
