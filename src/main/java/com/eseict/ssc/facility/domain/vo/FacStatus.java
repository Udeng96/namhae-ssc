package com.eseict.ssc.facility.domain.vo;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

import java.util.Arrays;
import java.util.Collections;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * 시설물 상태 코드 (statEvetGdCd)
 *
 * "00" = 정상, "01" = 고장
 * enum 전환으로 런타임 문자열 비교 제거 → O(1) 역방향 조회
 */
@Getter
@RequiredArgsConstructor
public enum FacStatus {

    NORMAL("00", "정상"),
    ERROR ("01", "고장");

    private final String code;
    private final String description;

    /** O(1) code → enum 역방향 조회 (Java 8 호환) */
    private static final Map<String, FacStatus> CACHE =
            Collections.unmodifiableMap(
                    Arrays.stream(values())
                          .collect(Collectors.toMap(s -> s.code, s -> s)));

    public static FacStatus of(String code) {
        if (code == null) return null;
        FacStatus s = CACHE.get(code);
        if (s == null) throw new IllegalArgumentException("알 수 없는 시설물 상태 코드: " + code);
        return s;
    }

    public boolean isError() { return this == ERROR; }

    @Override
    public String toString() { return code; }
}
