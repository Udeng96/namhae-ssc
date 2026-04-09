package com.eseict.ssc.monitoring.domain.vo;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;

/**
 * 좌표 Value Object (xCrdnt / yCrdnt)
 * 유효성 검증: 두 값 모두 "0"이 아닌 non-blank여야 유효
 *
 * 개선: private 생성자 대신 @AllArgsConstructor(access=PRIVATE) 활용
 */
@Getter
@EqualsAndHashCode
@AllArgsConstructor(access = AccessLevel.PRIVATE)
public final class Coordinates {

    private final String x;
    private final String y;

    public static Coordinates of(String x, String y) {
        String safeX = (x != null && !x.trim().isEmpty()) ? x : "0";  // Java 8: trim().isEmpty()
        String safeY = (y != null && !y.trim().isEmpty()) ? y : "0";
        return new Coordinates(safeX, safeY);
    }

    /** xCrdnt, yCrdnt 모두 "0"이 아닌 경우에만 유효 */
    public boolean isValid() { return !"0".equals(x) && !"0".equals(y); }

    @Override
    public String toString() { return "(" + x + ", " + y + ")"; }
}
