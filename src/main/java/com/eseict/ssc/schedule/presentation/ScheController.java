package com.eseict.ssc.schedule.presentation;

import com.eseict.ssc.config.ApiConstants;
import com.eseict.ssc.schedule.domain.entity.ScheContentScheduleInfo;
import com.eseict.ssc.schedule.application.service.ScheCommandService;
import com.eseict.ssc.schedule.application.service.ScheQueryService;
import io.swagger.annotations.ApiOperation;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * ScheController — 스케줄 CRUD 엔드포인트
 *
 * 기존: /newsche (ScheController)
 * 개선:
 *   - ScheService(God Class) → ScheQueryService + ScheCommandService 로 분리
 *   - @AllArgsConstructor → @RequiredArgsConstructor (명시적 final 주입 패턴)
 */
@Slf4j
@RequiredArgsConstructor
@RestController
@RequestMapping(value = "/sche", produces = ApiConstants.Common.API_PRODUCES)
public class ScheController {

    private final ScheQueryService   scheQueryService;
    private final ScheCommandService scheCommandService;

    @ApiOperation(value = "운영 대시보드의 모든 스케줄 조회")
    @GetMapping("")
    public ResponseEntity<List<ScheContentScheduleInfo>> getAllSchedules(
            @RequestParam(value = "znCd") String znCd) {
        return ResponseEntity.ok(scheQueryService.getAllSchedules(znCd));
    }

    @ApiOperation(value = "운영 대시보드의 콘텐츠 타입별 스케줄 조회")
    @GetMapping("/{contentType}")
    public ResponseEntity<List<ScheContentScheduleInfo>> getTypeSchedules(
            @PathVariable String contentType) {
        return ResponseEntity.ok(scheQueryService.getSchedulesByType(contentType));
    }

    @ApiOperation(value = "운영 대시보드의 콘텐츠 등록")
    @PostMapping("")
    public ResponseEntity<String> saveSchedules(
            @RequestBody List<ScheContentScheduleInfo> schedules) {
        return ResponseEntity.ok(scheCommandService.saveScheduleInfos(schedules));
    }

    @ApiOperation(value = "운영 대시보드의 콘텐츠 수정")
    @PutMapping("")
    public ResponseEntity<String> updateSchedules(
            @RequestBody List<ScheContentScheduleInfo> schedules) {
        return ResponseEntity.ok(scheCommandService.updateSchedule(schedules));
    }

    @ApiOperation(value = "운영 대시보드 콘텐츠 삭제")
    @DeleteMapping("/{grpId}")
    public ResponseEntity<String> deleteSchedule(
            @PathVariable String grpId) {
        return ResponseEntity.ok(scheCommandService.deleteSchedule(grpId));
    }
}
