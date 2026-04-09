package com.eseict.ssc.monitoring.domain.vo;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

import java.util.Arrays;
import java.util.Collections;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * 이벤트 서비스 유형 (unitSvcCd)
 * 001=상황(긴급벨·화재·가스), 002=현황(시설 고장)
 */
@Getter
@RequiredArgsConstructor
public enum EventType {

    SITUATION ("001", "상황"),
    STATUS    ("002", "현황");

    private final String code;
    private final String description;

    /** O(1) code → enum 역방향 조회 (Java 8 호환) */
    private static final Map<String, EventType> CACHE =
            Collections.unmodifiableMap(
                    Arrays.stream(values())
                          .collect(Collectors.toMap(t -> t.code, t -> t)));

    public static EventType of(String code) {
        if (code == null) return null;
        EventType t = CACHE.get(code);
        if (t == null) throw new IllegalArgumentException("알 수 없는 이벤트 유형 코드: " + code);
        return t;
    }
}
