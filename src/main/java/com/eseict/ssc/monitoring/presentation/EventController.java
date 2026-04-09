package com.eseict.ssc.monitoring.presentation;

import com.eseict.ssc.monitoring.application.dto.EventHeatmap;
import com.eseict.ssc.monitoring.application.dto.EventResult;
import com.eseict.ssc.monitoring.application.dto.TodayEventItem;
import com.eseict.ssc.monitoring.application.service.EventCommandService;
import com.eseict.ssc.monitoring.application.service.EventQueryService;
import io.swagger.annotations.ApiImplicitParam;
import io.swagger.annotations.ApiImplicitParams;
import io.swagger.annotations.ApiOperation;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * EventController (refac) — 얇은 컨트롤러 (Thin Controller)
 *
 * 역할: HTTP 요청/응답 변환만 담당
 * 비즈니스 로직은 EventQueryService / EventCommandService 로 위임
 *
 * 엔드포인트: 기존 /newevent 동일 (반환 타입 일치)
 */
@RestController
@RequestMapping(value = "/event", produces = "application/json;charset=UTF-8")
@Slf4j
@RequiredArgsConstructor
public class EventController {

    private final EventQueryService   eventQueryService;
    private final EventCommandService eventCommandService;

    @ApiOperation(value = "이벤트 리스트 조회")
    @ApiImplicitParams({
            @ApiImplicitParam(name = "znCd",       value = "지역 코드 (전체: 400)",   dataType = "List", paramType = "query"),
            @ApiImplicitParam(name = "statEvetCd", value = "이벤트 코드 (전체: 00)", dataType = "List", paramType = "query"),
            @ApiImplicitParam(name = "startDtm",   value = "시작 날짜",              dataType = "String", paramType = "query"),
            @ApiImplicitParam(name = "endDtm",     value = "종료 날짜",              dataType = "String", paramType = "query"),
            @ApiImplicitParam(name = "plcId",      value = "경로당 아이디",           dataType = "String", paramType = "query"),
            @ApiImplicitParam(name = "pageNumber", value = "페이지 번호 (0-base)",    dataType = "int",    paramType = "query")
    })
    @GetMapping("")
    public ResponseEntity<EventResult> getEventList(
            @RequestParam(defaultValue = "400") List<String> znCd,
            @RequestParam(defaultValue = "00")  List<String> statEvetCd,
            @RequestParam(defaultValue = "")    String startDtm,
            @RequestParam(defaultValue = "")    String endDtm,
            @RequestParam(defaultValue = "")    String plcId,
            @RequestParam(defaultValue = "0")   int pageNumber) {
        return ResponseEntity.ok(
                eventQueryService.getEvents(startDtm, endDtm, plcId, znCd, statEvetCd, pageNumber));
    }

    @ApiOperation(value = "경로당 오늘 상태 이벤트 조회")
    @GetMapping("/today/{mgtNo}")
    public ResponseEntity<List<TodayEventItem>> getTodayScEventList(
            @PathVariable String mgtNo,
            @RequestParam String startDtm,
            @RequestParam String endDtm) {
        return ResponseEntity.ok(
                eventQueryService.getTodayScEventList(startDtm, endDtm, mgtNo));
    }

    @ApiOperation(value = "히트맵 조회")
    @ApiImplicitParams({
            @ApiImplicitParam(name = "startDtm",   value = "시작 날짜",     required = true, dataType = "String", paramType = "query"),
            @ApiImplicitParam(name = "endDtm",     value = "종료 날짜",     required = true, dataType = "String", paramType = "query"),
            @ApiImplicitParam(name = "statEvetCd", value = "이벤트 종류",   required = true, dataType = "String", paramType = "query")
    })
    @GetMapping("/heatmap")
    public ResponseEntity<List<EventHeatmap>> getHeatmap(
            @RequestParam(defaultValue = "") String startDtm,
            @RequestParam(defaultValue = "") String endDtm,
            @RequestParam                   String statEvetCd) {
        return ResponseEntity.ok(
                eventQueryService.getHeatmapList(startDtm, endDtm, statEvetCd));
    }

    @ApiOperation(value = "소방 이벤트 공유")
    @ApiImplicitParam(name = "seqn", value = "공유할 이벤트 ID", required = true, dataType = "String", paramType = "query")
    @PostMapping("/share")
    public ResponseEntity<String> shareEventToFire(@RequestParam String seqn) {
        return ResponseEntity.ok(
                eventCommandService.shareEventToFire(seqn) ? seqn : "");
    }
}
