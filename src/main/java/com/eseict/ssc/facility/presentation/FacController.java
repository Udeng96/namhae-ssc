package com.eseict.ssc.facility.presentation;

import com.eseict.ssc.facility.application.dto.FacCctv;
import com.eseict.ssc.facility.application.dto.FacExcelItem;
import com.eseict.ssc.facility.domain.entity.ErfFacInfo;
import com.eseict.ssc.facility.domain.entity.ScFacInfo;
import com.eseict.ssc.facility.application.service.FacCommandService;
import com.eseict.ssc.facility.application.service.FacQueryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import static com.eseict.ssc.config.ApiConstants.Common.API_PRODUCES;

/**
 * FacController — 시설물 API 엔드포인트
 *
 * 비즈니스 로직 없이 FacQueryService / FacCommandService 에 위임만 한다.
 * 기존 /newfac → /refac/fac 로 매핑 변경.
 */
@RestController
@RequestMapping(value = "/fac", produces = API_PRODUCES)
@RequiredArgsConstructor
public class FacController {

    private final FacQueryService   facQueryService;
    private final FacCommandService facCommandService;

    /**
     * 경로당 시설물 목록 조회
     *
     * sortType: normal(정상 우선) | error(고장 우선) | none(지역 순서)
     */
    @GetMapping("")
    public ResponseEntity<List<ScFacInfo>> getFacs(
            @RequestParam(value = "areaCd",     required = false, defaultValue = "400")    List<String> areaCd,
            @RequestParam(value = "centerName", required = false, defaultValue = "")       String centerName,
            @RequestParam(value = "sortType",   required = false, defaultValue = "normal") String sortType
    ) {
        return ResponseEntity.ok(facQueryService.getFacs(areaCd, centerName, sortType));
    }

    /** 전체 경로당 시설물 목록 조회 */
    @GetMapping("/sc")
    public ResponseEntity<List<ErfFacInfo>> getScList() {
        return ResponseEntity.ok(facQueryService.getAllScList());
    }

    /** 특정 시설물 이벤트 상태 업데이트 */
    @PutMapping("/status/{id}")
    public ResponseEntity<String> updateFacStatus(
            @PathVariable String id,
            @RequestParam(value = "status", defaultValue = "01") String status
    ) {
        return ResponseEntity.ok(facCommandService.updateFacStatus(id, status));
    }

    /** 시설물 엑셀 일괄 등록 */
    @PostMapping("/batch")
    public ResponseEntity<List<String>> saveFacsFromExcel(
            @RequestBody List<FacExcelItem> excelList
    ) {
        return ResponseEntity.ok(facCommandService.saveFacsFromExcel(excelList));
    }

    /** 방범 CCTV 목록 조회 */
    @GetMapping("/cctv/crime")
    public ResponseEntity<List<FacCctv>> getCrimeCctvs() {
        return ResponseEntity.ok(facQueryService.getCrimeCctvs());
    }

    /** 경로당 CCTV 목록 조회 */
    @GetMapping("/cctv/sc")
    public ResponseEntity<List<FacCctv>> getScCctvs() {
        return ResponseEntity.ok(facQueryService.getScCctvs());
    }
}
