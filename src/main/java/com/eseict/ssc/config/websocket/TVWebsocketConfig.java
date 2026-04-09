package com.eseict.ssc.config.websocket;

import org.springframework.stereotype.Component;
import org.springframework.web.socket.WebSocketSession;

import java.util.concurrent.ConcurrentHashMap;

/** TV 공지 WebSocket 핸들러 (/rino/tv/notice). */
@Component
public class TVWebsocketConfig extends AbstractRinoWsHandler {

    private static final ConcurrentHashMap<String, WebSocketSession> SESSIONS = new ConcurrentHashMap<>();

    public static ConcurrentHashMap<String, WebSocketSession> getSessionMap() {
        return SESSIONS;
    }

    @Override
    protected String logPrefix() { return "TV-WS"; }

    @Override
    protected ConcurrentHashMap<String, WebSocketSession> sessions() { return SESSIONS; }
}
