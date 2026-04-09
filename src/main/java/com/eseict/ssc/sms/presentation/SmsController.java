package com.eseict.ssc.sms.presentation;

import com.eseict.common.cache.CacheException;
import com.eseict.ssc.cache.DepartmentCache;
import com.eseict.ssc.sms.application.dto.DeptTarget;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Collections;
import java.util.List;

import static com.eseict.ssc.config.ApiConstants.Common.API_PRODUCES;

/**
 * SmsController (refac) — SMS 수신 대상 조회
 *
 * 개선: PublicDepartmentCache.getInstance() → DepartmentCache DI 전환
 */
@RestController
@RequiredArgsConstructor
@Slf4j
@RequestMapping(value = "/sms", produces = API_PRODUCES)
public class SmsController {

    private final DepartmentCache departmentCache;

    @GetMapping("/target")
    public ResponseEntity<List<DeptTarget>> getTarget() {
        try {
            return ResponseEntity.ok(departmentCache.getData());
        } catch (CacheException e) {
            log.error("부서 대상 정보 로드 실패", e);
            return ResponseEntity.ok(Collections.emptyList());
        }
    }
}
