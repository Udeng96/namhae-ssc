package com.eseict.ssc.stat.presentation;

import com.eseict.ssc.config.ApiConstants;
import com.eseict.ssc.stat.application.dto.KeyCountItem;
import com.eseict.ssc.stat.application.dto.EventStatResult;
import com.eseict.ssc.stat.application.dto.FacStatResult;
import com.eseict.ssc.stat.application.dto.OperStatResult;
import com.eseict.ssc.stat.application.dto.UsageStatResult;
import com.eseict.ssc.stat.application.service.EventStatService;
import com.eseict.ssc.stat.application.service.FacStatService;
import com.eseict.ssc.stat.application.service.OperStatService;
import com.eseict.ssc.stat.application.service.UsageStatService;
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
 * StatController — 통계 도메인 엔드포인트
 *
 * 기존: /newstat (StatController)
 *   - StatService(God Class) → 이벤트 + 시설물 + 가동률 전체 처리
 *   - UsageService → 이용률 통계 전체 처리
 * 개선:
 *   - EventStatService  : 이벤트 통계 (비상벨 버그 수정 포함)
 *   - FacStatService    : 시설물 통계
 *   - OperStatService   : 가동률 통계
 *   - UsageStatService  : 이용률 통계 (seniorUsage 신규 추가)
 *   - @PostConstruct 캐시로 N+1 해소 (SC 목록, 지역 목록)
 */
@Slf4j
@RequiredArgsConstructor
@RestController
@RequestMapping(value = "/stat", produces = ApiConstants.Common.API_PRODUCES)
public class StatController {

    private final EventStatService  eventStatService;
    private final FacStatService    facStatService;
    private final OperStatService   operStatService;
    private final UsageStatService  usageStatService;

    // ── 이용률 ────────────────────────────────────────────────────────────────

    @ApiOperation(value = "이용률 전체 통계", notes = "이용률 탭의 모든 통계 (seniorUsage 포함)")
    @GetMapping("/usage")
    public ResponseEntity<UsageStatResult> getAllUsage(
            @RequestParam String startDtm,
            @RequestParam String endDtm) {
        return ResponseEntity.ok(usageStatService.getUsageStat(startDtm, endDtm));
    }

    @ApiOperation(value = "서비스 이용 통계", notes = "화상회의 개설·접속 합계 및 콘텐츠 정보 제공 건수")
    @GetMapping("/usage/service")
    public ResponseEntity<List<KeyCountItem>> getServiceUsage(
            @RequestParam String startDtm,
            @RequestParam String endDtm) {
        return ResponseEntity.ok(usageStatService.getServiceUsage(startDtm, endDtm));
    }

    @ApiOperation(value = "경로당 방문자 통계", notes = "line_cross 이벤트 기반 지역별 방문자 수")
    @GetMapping("/usage/sc")
    public ResponseEntity<List<KeyCountItem>> getVisitorUsage(
            @RequestParam String startDtm,
            @RequestParam String endDtm) {
        return ResponseEntity.ok(usageStatService.getVisitorUsage(startDtm, endDtm));
    }

    @ApiOperation(value = "날짜별 화상회의 개설 통계", notes = "GroupMode(일/주/월/년) 버킷 적용, 비상벨 화상회의 제외")
    @GetMapping("/usage/confOpen")
    public ResponseEntity<List<KeyCountItem>> getOpenConfUsage(
            @RequestParam String startDtm,
            @RequestParam String endDtm) {
        return ResponseEntity.ok(usageStatService.getOpenConfUsage(startDtm, endDtm));
    }

    @ApiOperation(value = "지역별 화상회의 접속 통계", notes = "facilityId → snrZoneNm 매핑 후 지역별 집계, 비상벨 화상회의 제외")
    @GetMapping("/usage/confConn")
    public ResponseEntity<List<KeyCountItem>> getConnConfUsage(
            @RequestParam String startDtm,
            @RequestParam String endDtm) {
        return ResponseEntity.ok(usageStatService.getConnConfUsage(startDtm, endDtm));
    }

    @ApiOperation(value = "콘텐츠 유형별 건수", notes = "긴급공지·일반공지·콘텐츠정보·전광판 집계")
    @GetMapping("/usage/content/count")
    public ResponseEntity<List<KeyCountItem>> getContentUsage(
            @RequestParam String startDtm,
            @RequestParam String endDtm) {
        return ResponseEntity.ok(usageStatService.getContentUsage(startDtm, endDtm));
    }

    @ApiOperation(value = "지역별 콘텐츠 제공 건수", notes = "스케줄 기간 overlap 필터 + 지역별 집계 (VMS 포함)")
    @GetMapping("/usage/content/area")
    public ResponseEntity<List<KeyCountItem>> getContentAreaUsage(
            @RequestParam String startDtm,
            @RequestParam String endDtm) {
        return ResponseEntity.ok(usageStatService.getContentAreaUsage(startDtm, endDtm));
    }

    @ApiOperation(value = "경로당 이용률", notes = "line_cross 기반 지역별 평균 가동률 (신규)")
    @GetMapping("/usage/senior")
    public ResponseEntity<List<KeyCountItem>> getSeniorUsageRate(
            @RequestParam String startDtm,
            @RequestParam String endDtm) {
        return ResponseEntity.ok(usageStatService.getSeniorUsageRate(startDtm, endDtm));
    }

    // ── 가동률 ────────────────────────────────────────────────────────────────

    @ApiOperation(value = "가동률 전체 통계", notes = "지역별·날짜별·시설물별·경로당별 가동 통계")
    @GetMapping("/oper")
    public ResponseEntity<OperStatResult> getOperStat(
            @RequestParam String startDtm,
            @RequestParam String endDtm,
            @RequestParam(defaultValue = "") String area) {
        return ResponseEntity.ok(operStatService.getOperStat(startDtm, endDtm, area));
    }

    // ── 이벤트 통계 ───────────────────────────────────────────────────────────

    @ApiOperation(value = "이벤트 전체 통계", notes = "날짜별·타입별·비상벨·경로당별 발생 통계")
    @GetMapping("/event")
    public ResponseEntity<EventStatResult> getEventStat(
            @RequestParam String startDtm,
            @RequestParam String endDtm,
            @RequestParam(defaultValue = "") String area) {
        return ResponseEntity.ok(eventStatService.getEventStat(startDtm, endDtm, area));
    }

    // ── 시설물 통계 ───────────────────────────────────────────────────────────

    @ApiOperation(value = "시설물 전체 통계", notes = "날짜별·고장타입별·경로당별 발생 통계")
    @GetMapping("/fac")
    public ResponseEntity<FacStatResult> getFacStat(
            @RequestParam String startDtm,
            @RequestParam String endDtm,
            @RequestParam(defaultValue = "") String area) {
        return ResponseEntity.ok(facStatService.getFacStat(startDtm, endDtm, area));
    }
}
