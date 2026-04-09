package com.eseict.ssc.monitoring.domain.vo;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

import java.util.Arrays;
import java.util.Collections;
import java.util.EnumSet;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * 이벤트 처리 상태 (procSt)
 * 1=발생, 4=소방공유, 5=종료
 */
@Getter
@RequiredArgsConstructor
public enum EventStatus {

    OCCURRED       ("1", "발생"),
    SHARED_TO_FIRE ("4", "소방 공유"),
    TERMINATED     ("5", "종료");

    private final String code;
    private final String description;

    /** O(1) code → enum 역방향 조회 (Java 8 호환: toMap + unmodifiableMap) */
    private static final Map<String, EventStatus> CACHE =
            Collections.unmodifiableMap(
                    Arrays.stream(values())
                          .collect(Collectors.toMap(s -> s.code, s -> s)));

    /** 종료 상태 집합 (EnumSet → O(1) contains) */
    private static final EnumSet<EventStatus> FINISHED = EnumSet.of(SHARED_TO_FIRE, TERMINATED);

    public static EventStatus of(String code) {
        if (code == null) return null;
        EventStatus s = CACHE.get(code);
        if (s == null) throw new IllegalArgumentException("알 수 없는 이벤트 상태 코드: " + code);
        return s;
    }

    public boolean isActive()   { return this == OCCURRED; }
    public boolean isFinished() { return FINISHED.contains(this); }
}
