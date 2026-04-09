package com.eseict.ssc.common.dto;

import lombok.Getter;

/**
 * WebSocket ping 메시지 VO.
 * WSPolling 에서 30초마다 각 핸들러의 세션에 전송한다.
 */
@Getter
public class WSCheck {
    private final String type = "ping";
}
