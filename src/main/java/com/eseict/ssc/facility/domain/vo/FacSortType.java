package com.eseict.ssc.facility.domain.vo;

import lombok.RequiredArgsConstructor;

import java.util.Arrays;
import java.util.Collections;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * 시설물 목록 정렬 기준
 *
 * 기존: getFacs() 내 if/else 체인으로 comparator 분기
 * 개선: priority() 메서드 하나로 정렬 우선순위 위임 → 서비스 코드 단순화
 */
@RequiredArgsConstructor
public enum FacSortType {

    /** 정상(00) 우선 */
    NORMAL("normal"),
    /** 고장(01) 우선 */
    ERROR ("error"),
    /** 정렬 없음 — 지역 순서 유지 */
    NONE  ("none");

    private final String code;

    /** O(1) code → enum 역방향 조회 (Java 8 호환) */
    private static final Map<String, FacSortType> CACHE =
            Collections.unmodifiableMap(
                    Arrays.stream(values())
                          .collect(Collectors.toMap(t -> t.code, t -> t)));

    /**
     * 알 수 없는 코드 → NONE 으로 안전하게 폴백
     */
    public static FacSortType of(String code) {
        if (code == null) return NONE;
        FacSortType t = CACHE.get(code);
        return t != null ? t : NONE;
    }

    /**
     * 상태코드(sc) 기준 정렬 우선순위 — 낮을수록 앞에 위치
     *
     * @param statusCode 시설물 상태값 ("00" = 정상, "01" = 고장)
     */
    public int priority(String statusCode) {
        switch (this) {
            case NORMAL: return "00".equals(statusCode) ? 0 : 1;
            case ERROR:  return "01".equals(statusCode) ? 0 : 1;
            default:     return 0; // NONE — 모두 동일 우선순위
        }
    }
}
