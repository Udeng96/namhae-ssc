package com.eseict.ssc.schedule.presentation;

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

import static com.eseict.ssc.config.ApiConstants.Common.API_PRODUCES;

/**
 * NotiScheController — 72인치 티비모니터 스케줄 조회 엔드포인트
 *
 * 기존: /notiSche (NotiScheController → NotiScheService)
 *   - 주석 처리된 POST /tv/{scMgtNo} (셋톱 → TV 전환) 엔드포인트 방치
 * 개선:
 *   - ScheQueryService.getBroadNotiContents() 로 위임
 *   - 사용되지 않는 TV 전환 엔드포인트 제거 (주석 코드 정리)
 */
@Slf4j
@RequiredArgsConstructor
@RestController
@RequestMapping(value = "/notiSche", produces = API_PRODUCES)
public class NotiScheController {

    private final ScheQueryService scheQueryService;

    @ApiOperation(value = "티비 모니터(72인치)에 현 시간 방송되어야 할 모든 스케줄 조회")
    @GetMapping("/{scMgtNo}")
    public ResponseEntity<SocialResult> getBroadNotiContents(
            @PathVariable String scMgtNo) {
        return ResponseEntity.ok(scheQueryService.getBroadNotiContents(scMgtNo));
    }
}
