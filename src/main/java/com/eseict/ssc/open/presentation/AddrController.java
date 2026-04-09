package com.eseict.ssc.open.presentation;

import com.eseict.ssc.open.application.dto.AddrResponse;
import com.eseict.ssc.open.application.service.AddrService;
import io.swagger.annotations.ApiOperation;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

import static com.eseict.ssc.config.ApiConstants.Common.API_PRODUCES;

/**
 * AddrController (refac) — 주소 검색
 *
 * 기존: /addr/search → service/newOpen/AddrService
 * 개선:
 *   - /refac/addr/search 경로 (refac 전용)
 *   - refac.open.application.service.AddrService 참조 (리팩토링된 서비스)
 */
@RestController
@RequestMapping(value = "/addr", produces = API_PRODUCES)
@Slf4j
@RequiredArgsConstructor
public class AddrController {

    private final AddrService addrService;

    @ApiOperation(value = "주소 검색", notes = "지역의 키워드를 사용하여 해당 지역의 주소 정보를 가져온다.")
    @GetMapping("/search")
    public ResponseEntity<List<AddrResponse>> searchAddr(String keyword) {
        return ResponseEntity.ok(addrService.getAddrList(keyword));
    }
}
