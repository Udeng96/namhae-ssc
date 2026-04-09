package com.eseict.ssc.cache;

import com.eseict.common.cache.CacheException;
import com.eseict.ssc.sms.application.dto.DeptTarget;
import com.eseict.ssc.sms.application.service.SmsService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

/**
 * 부서별 SMS 수신 대상 캐시.
 *
 * - Spring Bean으로 관리 (Singleton 패턴, WebApplicationContextUtil 제거)
 * - 최초 요청 시 DB에서 로드 (lazy init)
 * - 수동 갱신: {@link #refresh()}
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class DepartmentCacheImpl implements DepartmentCache {

    private final SmsService smsService;

    /** 캐시 데이터. volatile로 가시성 보장. */
    private volatile List<DeptTarget> cache = Collections.emptyList();

    // ── DepartmentCache ───────────────────────────────────────────────────────

    /**
     * 부서 목록을 반환한다.
     * 캐시가 비어 있으면 DB에서 자동으로 로드한다.
     */
    @Override
    public synchronized List<DeptTarget> getData() throws CacheException {
        if (cache.isEmpty()) {
            load();
        }
        return new ArrayList<>(cache);
    }

    // ── public operations ─────────────────────────────────────────────────────

    /**
     * 캐시를 비우고 다음 요청 시 DB에서 재로드되도록 한다.
     * 부서 정보가 변경된 경우 호출한다.
     */
    public synchronized void refresh() {
        cache = Collections.emptyList();
        log.info("부서 캐시 초기화. 다음 요청 시 재로드.");
    }

    // ── private helpers ───────────────────────────────────────────────────────

    /** DB에서 부서 목록을 조회하여 캐시를 채운다. */
    private void load() throws CacheException {
        List<DeptTarget> list = smsService.getTarget();
        if (list == null || list.isEmpty()) {
            log.error("부서 정보 로드 실패 — DB가 비어있거나 오류 발생");
            throw new CacheException("부서 정보를 불러올 수 없습니다.");
        }
        cache = new ArrayList<>(list);
        log.info("부서 캐시 로드 완료. size={}", cache.size());
    }
}
