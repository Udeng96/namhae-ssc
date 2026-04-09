package com.eseict.ssc.config.websocket;

import org.springframework.stereotype.Component;
import org.springframework.web.socket.WebSocketSession;

import java.util.concurrent.ConcurrentHashMap;

/** 스케줄 영상 WebSocket 핸들러 (/rino/social/video). */
@Component
public class VideoWebSocketConfig extends AbstractRinoWsHandler {

    private static final ConcurrentHashMap<String, WebSocketSession> SESSIONS = new ConcurrentHashMap<>();

    public static ConcurrentHashMap<String, WebSocketSession> getSessionMap() {
        return SESSIONS;
    }

    @Override
    protected String logPrefix() { return "VIDEO-WS"; }

    @Override
    protected ConcurrentHashMap<String, WebSocketSession> sessions() { return SESSIONS; }
}
