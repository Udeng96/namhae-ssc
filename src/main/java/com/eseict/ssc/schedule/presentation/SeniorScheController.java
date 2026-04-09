package com.eseict.ssc.schedule.presentation;

import com.eseict.ssc.config.ApiConstants;
import com.eseict.ssc.schedule.application.dto.SocialResult;
import com.eseict.ssc.schedule.application.service.ScheQueryService;
import io.swagger.annotations.ApiOperation;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * SeniorScheController — 32인치 정보표출모니터 스케줄 조회 엔드포인트
 *
 * 기존: /seniorSche (SeniorScheController → SocialScheService)
 * 개선: ScheQueryService.getBroadContents() 로 위임
 */
@Slf4j
@RequiredArgsConstructor
@RestController
@RequestMapping(value = "/seniorSche", produces = ApiConstants.Common.API_PRODUCES)
public class SeniorScheController {

    private final ScheQueryService scheQueryService;

    @ApiOperation(value = "정보표출모니터(32인치)에 현 시간 방송되어야 할 모든 스케줄 조회")
    @GetMapping("/{scMgtNo}")
    public ResponseEntity<SocialResult> getBroadContents(
            @PathVariable String scMgtNo) {
        return ResponseEntity.ok(scheQueryService.getBroadContents(scMgtNo));
    }
}
