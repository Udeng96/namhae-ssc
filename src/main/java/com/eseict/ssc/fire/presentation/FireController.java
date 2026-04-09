package com.eseict.ssc.fire.presentation;

import com.eseict.ssc.config.ApiConstants;
import com.eseict.ssc.monitoring.application.dto.EventResult;
import com.eseict.ssc.monitoring.application.service.EventQueryService;
import io.swagger.annotations.ApiOperation;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * FireController — 소방 이벤트(비상벨, procSt="4") 조회 엔드포인트
 *
 * 기존: /fire (FireController extends ControllerSupport)
 *   - EventService.getFireEvents() 위임
 *   - ControllerSupport 불필요한 상속
 * 개선:
 *   - EventQueryService.getFireEvents() 위임 (refac monitoring 서비스)
 *   - ControllerSupport 상속 제거 → @RestController 직접 사용
 *   - produces 명시 (ApiConstants.Common.API_PRODUCES)
 */
@Slf4j
@RequiredArgsConstructor
@RestController
@RequestMapping(value = "/fire", produces = ApiConstants.Common.API_PRODUCES)
public class FireController {

    private final EventQueryService eventQueryService;

    @ApiOperation(value = "소방 이벤트 목록 조회",
                  notes = "procSt='4'(소방 처리) 이벤트를 전체 페이지 수집 후 요청 페이지로 재페이징하여 반환")
    @GetMapping("/events")
    public ResponseEntity<EventResult> getFireEvents(
            @RequestParam(defaultValue = "400") List<String> znCd,
            @RequestParam(defaultValue = "00")  List<String> statEvetCd,
            @RequestParam(defaultValue = "")    String startDtm,
            @RequestParam(defaultValue = "")    String endDtm,
            @RequestParam(defaultValue = "")    String plcId,
            @RequestParam(defaultValue = "0")   int pageNumber) {
        return ResponseEntity.ok(
                eventQueryService.getFireEvents(
                        startDtm, endDtm, plcId, znCd,
                        statEvetCd,
                        pageNumber));
    }
}
