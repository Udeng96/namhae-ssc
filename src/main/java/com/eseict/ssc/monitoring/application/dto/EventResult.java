package com.eseict.ssc.monitoring.application.dto;

import lombok.*;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class EventResult {
    private long page;                        //  현재 페이지 번호
    private long cntPerPage;                  //  페이지당 Item 갯수
    private long totalCnt;                    //  전체 Item 갯수
    private long totalPage;                   //  전체 페이지 갯수
    private List<EventResultItem> eventList;
}
