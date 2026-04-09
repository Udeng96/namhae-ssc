package com.eseict.ssc.schedule.domain.vo;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

import java.util.Arrays;
import java.util.Collections;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * 스케줄 콘텐츠 유형
 *
 * 기존: ApiConstants.CONTENT_TYPE 문자열 상수를 .equals() 로 직접 비교
 * 개선: enum 으로 전환 → isEmergency() / isSendToTv() 메서드로 분기 의도 명시
 */
@Getter
@RequiredArgsConstructor
public enum ContentType {

    VIDEO        ("VIDEO",    "동영상"),
    NORMAL       ("NOTICE_N", "일반공지"),
    EMERGENCY    ("NOTICE_E", "긴급공지"),
    SENIOR_EVENT ("NOTICE_S", "경로당행사");

    private final String code;
    private final String description;

    /** O(1) code → enum 역방향 조회 (Java 8 호환) */
    private static final Map<String, ContentType> CACHE =
            Collections.unmodifiableMap(
                    Arrays.stream(values())
                          .collect(Collectors.toMap(t -> t.code, t -> t)));

    /**
     * 알 수 없는 코드 → null 반환 (기존 동작 유지)
     */
    public static ContentType of(String code) {
        return code == null ? null : CACHE.get(code);
    }

    /** 긴급공지: 시간 필터 없이 저장 즉시 전송 */
    public boolean isEmergency() { return this == EMERGENCY; }

    /**
     * 72인치 티비모니터 전송 대상 여부
     * VIDEO·일반공지는 티비로 보내지 않는다.
     */
    public boolean isSendToTv() { return this != VIDEO && this != NORMAL; }

    @Override
    public String toString() { return code; }
}
