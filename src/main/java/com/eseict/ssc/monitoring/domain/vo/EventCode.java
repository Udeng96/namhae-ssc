package com.eseict.ssc.monitoring.domain.vo;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

import java.util.Arrays;
import java.util.Collections;
import java.util.EnumSet;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * 이벤트 코드 (statEvetCd) — 알려진 5개 코드를 enum으로 관리
 *
 * VO class → enum 전환 이유:
 *  - 코드가 고정 집합(01~05)이므로 enum이 타입 안전, O(1) 조회에 더 적합
 *  - isExcludedFromSearch()를 boolean 필드로 선언 → 런타임 문자열 비교 불필요
 *  - isFireOrGas()를 EnumSet으로 O(1) 처리
 */
@Getter
@RequiredArgsConstructor
public enum EventCode {

    BELL   ("01", false),
    FIRE   ("02", false),
    GAS    ("03", true),
    ETC_04 ("04", true),
    ETC_05 ("05", true);

    private final String code;
    /** 이벤트 목록 검색에서 제외되는 코드 여부 (03·04·05) */
    private final boolean excludedFromSearch;

    /** O(1) code → enum 역방향 조회 (Java 8 호환) */
    private static final Map<String, EventCode> CACHE =
            Collections.unmodifiableMap(
                    Arrays.stream(values())
                          .collect(Collectors.toMap(e -> e.code, e -> e)));

    /** 화재·가스 집합 (EnumSet → O(1) contains) */
    private static final EnumSet<EventCode> FIRE_GAS = EnumSet.of(FIRE, GAS);

    public static EventCode of(String code) {
        if (code == null) return null;
        EventCode ec = CACHE.get(code);
        if (ec == null) throw new IllegalArgumentException("알 수 없는 이벤트 코드: " + code);
        return ec;
    }

    public boolean isFireOrGas() { return FIRE_GAS.contains(this); }

    @Override
    public String toString() { return code; }
}
