package com.eseict.ssc.config.websocket;

import org.springframework.stereotype.Component;
import org.springframework.web.socket.WebSocketSession;

import java.util.concurrent.ConcurrentHashMap;

/** 이벤트 현황탭 WebSocket 핸들러 (/rino/event). */
@Component
public class RinoEventWebsocketConfig extends AbstractRinoWsHandler {

    private static final ConcurrentHashMap<String, WebSocketSession> SESSIONS = new ConcurrentHashMap<>();

    public static ConcurrentHashMap<String, WebSocketSession> getSessionMap() {
        return SESSIONS;
    }

    @Override
    protected String logPrefix() { return "EVENT-WS"; }

    @Override
    protected ConcurrentHashMap<String, WebSocketSession> sessions() { return SESSIONS; }
}
