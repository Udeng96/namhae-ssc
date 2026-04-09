package com.eseict.ssc.schedule.domain.vo;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

import java.util.Arrays;
import java.util.Collections;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * 소켓 전송 유형
 *
 * 기존: ApiConstants.SOCKET_SEND_TYPE 문자열 상수를 .equals() 로 비교
 * 개선: isUpload() 메서드로 셋톱 HTTP 요청 여부 판별 의도 명시
 */
@Getter
@RequiredArgsConstructor
public enum SocketSendType {

    UPLOAD("UPLOAD"),
    UPDATE("UPDATE"),
    DELETE("DELETE");

    private final String code;

    /** O(1) code → enum 역방향 조회 (Java 8 호환) */
    private static final Map<String, SocketSendType> CACHE =
            Collections.unmodifiableMap(
                    Arrays.stream(values())
                          .collect(Collectors.toMap(t -> t.code, t -> t)));

    public static SocketSendType of(String code) {
        if (code == null) return null;
        SocketSendType t = CACHE.get(code);
        if (t == null) throw new IllegalArgumentException("알 수 없는 소켓 전송 유형: " + code);
        return t;
    }

    /**
     * 셋톱박스 HTTP 전환 요청은 UPLOAD 타입에만 수행한다.
     * UPDATE / DELETE 는 웹소켓으로만 처리.
     */
    public boolean isUpload() { return this == UPLOAD; }

    @Override
    public String toString() { return code; }
}
