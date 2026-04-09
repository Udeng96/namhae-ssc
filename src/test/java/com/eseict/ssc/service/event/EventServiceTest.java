//package com.eseict.ssc.service.event;
//
//import com.eseict.ssc.newDomain.dto.event.EventResult;
//import com.eseict.ssc.service.newEvent.EventService;
//import lombok.RequiredArgsConstructor;
//import lombok.extern.slf4j.Slf4j;
//import org.junit.jupiter.api.BeforeEach;
//import org.junit.jupiter.api.DisplayName;
//import org.junit.jupiter.api.Test;
//import org.springframework.boot.test.context.SpringBootTest;
//import org.springframework.transaction.annotation.Transactional;
//
//import java.util.Collections;
//import java.util.List;
//
//import static org.junit.jupiter.api.Assertions.assertFalse;
//import static org.junit.jupiter.api.Assertions.assertNotNull;
//
//@Slf4j
//@SpringBootTest
//@Transactional
//@RequiredArgsConstructor
//class EventServiceTest {
//
//
//
//    final EventService eventService;
//
//    // 요구사항부터 정리를 해보자.
//
//    // 각 테스트 실행 전에 공통적으로 해야 할 작업 작성
//    @BeforeEach
//    public void before(){
//
//    }
//    @Test
//    @DisplayName("오류 없이 정상 호출되는 이벤트 리스트")
//    public void noException_eventList(){
//        String startDtm = "20240707";
//        String endDtm = "20250707";
//        String plcId = ""; // 빈 값이면 상황, 채워져 있으면 상태
//        List<String> znCd = Collections.singletonList("400"); // 400이면 전체
//        List<String> statEvetCd = Collections.singletonList("00"); // 00이면 전체
//        int pageNum = 0; // 0이면 오늘 이벤트 , 0보다 높으면 지난 이벤트
//
//        EventResult result = eventService.getEvents(startDtm, endDtm, plcId, znCd, statEvetCd, pageNum);
//
//        assertNotNull(result);
//        assertFalse(result.getEventList().isEmpty(), "해당 조건에 만족하는 이벤트가 없음");
//    }
//
//    @Test
//    @DisplayName("날짜 ")
//    public void validateDateRange_bothNullOrEmpty_noException(){
//    }
//}