package com.eseict.ssc.config.websocket;

import org.springframework.stereotype.Component;
import org.springframework.web.socket.WebSocketSession;

import java.util.concurrent.ConcurrentHashMap;

/** 스케줄 공지 WebSocket 핸들러 (/rino/social/notice). */
@Component
public class NoticeWebSocketConfig extends AbstractRinoWsHandler {

    private static final ConcurrentHashMap<String, WebSocketSession> SESSIONS = new ConcurrentHashMap<>();

    public static ConcurrentHashMap<String, WebSocketSession> getSessionMap() {
        return SESSIONS;
    }

    @Override
    protected String logPrefix() { return "NOTICE-WS"; }

    @Override
    protected ConcurrentHashMap<String, WebSocketSession> sessions() { return SESSIONS; }
}
