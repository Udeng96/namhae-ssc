package com.eseict.ssc.config.websocket;

import org.springframework.stereotype.Component;
import org.springframework.web.socket.WebSocketSession;

import java.util.concurrent.ConcurrentHashMap;

/** 시설물 현황탭 WebSocket 핸들러 (/rino/facility). */
@Component
public class RinoFacilityWebsocketConfig extends AbstractRinoWsHandler {

    private static final ConcurrentHashMap<String, WebSocketSession> SESSIONS = new ConcurrentHashMap<>();

    public static ConcurrentHashMap<String, WebSocketSession> getSessionMap() {
        return SESSIONS;
    }

    @Override
    protected String logPrefix() { return "FACILITY-WS"; }

    @Override
    protected ConcurrentHashMap<String, WebSocketSession> sessions() { return SESSIONS; }
}
