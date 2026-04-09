package com.eseict.ssc.cache;

import com.eseict.ssc.sms.domain.entity.OmsCommCdInfo;
import com.eseict.ssc.repository.oms.CommCdRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.time.Duration;
import java.time.Instant;
import java.util.Date;
import java.util.List;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentMap;

/**
 * OMS 공통 코드(재해 지구) 캐시 핸들러.
 *
 * - TTL: {@value TTL_HOURS}시간, 만료 시 동일 요청에서 즉시 재조회
 * - synchronized lock으로 중복 DB 호출 방지
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class CacheHandler {

    private static final String DS_CODE_KEY = "dsCodeIdentifier";
    private static final long   TTL_HOURS   = 1;

    private final CommCdRepository commCdRepository;

    private final Object lock = new Object();
    private final ConcurrentMap<String, CacheCommCd> cacheMap = new ConcurrentHashMap<>();

    // ── public API ────────────────────────────────────────────────────────────

    /**
     * 재해 지구(DS) 코드 목록을 반환한다.
     * 캐시가 없거나 TTL을 초과한 경우 DB에서 새로 조회한다.
     */
    public List<OmsCommCdInfo> getDsCodeIdentifier() {
        synchronized (lock) {
            CacheCommCd cached = cacheMap.get(DS_CODE_KEY);
            if (cached == null || isExpired(cached)) {
                return reload();
            }
            return cached.getList();
        }
    }

    // ── private helpers ───────────────────────────────────────────────────────

    /** DB에서 재조회 후 캐시에 갱신한다. */
    private List<OmsCommCdInfo> reload() {
        List<OmsCommCdInfo> list = commCdRepository.getDsCodeIdentifier();
        cacheMap.put(DS_CODE_KEY, new CacheCommCd(new Date(), list));
        log.debug("DS 코드 캐시 갱신. size={}", list.size());
        return list;
    }

    /** TTL 초과 여부를 판단한다. */
    private boolean isExpired(CacheCommCd cached) {
        Duration age = Duration.between(cached.getCreatedDate().toInstant(), Instant.now());
        return age.toHours() >= TTL_HOURS;
    }
}
