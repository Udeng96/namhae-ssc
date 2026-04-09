package com.eseict.ssc.monitoring.domain.vo;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;

/**
 * 구역 코드 Value Object (znCd)
 *
 * 개선:
 *  - matchesArea(), isPublicZone() 제거 (원본 코드에서 실제로 사용되지 않는 불필요 메서드)
 *  - private 생성자 대신 @AllArgsConstructor(access=PRIVATE) 활용
 */
@Getter
@EqualsAndHashCode
@AllArgsConstructor(access = AccessLevel.PRIVATE)
public final class ZoneCode {

    private final String value;

    public static ZoneCode of(String value) {
        if (value == null || value.trim().isEmpty()) {   // Java 8: trim().isEmpty()
            throw new IllegalArgumentException("구역 코드는 필수입니다.");
        }
        return new ZoneCode(value);
    }

    @Override
    public String toString() { return value; }
}
