package com.eseict.ssc.scheduler;

import com.eseict.ssc.config.websocket.*;
import com.eseict.ssc.common.dto.WSCheck;
import com.google.gson.Gson;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;

import java.util.concurrent.ConcurrentHashMap;

/**
 * WebSocket 세션 하트비트 스케줄러.
 *
 * <p>30초마다 각 핸들러의 열린 세션에 ping 메시지를 전송하여
 * 커넥션을 유지한다.</p>
 */
@Slf4j
@RequiredArgsConstructor
@Component
public class WSPolling {

    private static final long PING_INTERVAL_MS = 30_000;

    private final Gson gson;

    @Scheduled(fixedDelay = PING_INTERVAL_MS)
    public void socialPing()   { ping(SocialWebSocketConfig.getSessionMap(),        "SOCIAL"); }

    @Scheduled(fixedDelay = PING_INTERVAL_MS)
    public void noticePing()   { ping(NoticeWebSocketConfig.getSessionMap(),        "NOTICE"); }

    @Scheduled(fixedDelay = PING_INTERVAL_MS)
    public void videoPing()    { ping(VideoWebSocketConfig.getSessionMap(),         "VIDEO"); }

    @Scheduled(fixedDelay = PING_INTERVAL_MS)
    public void tvPing()       { ping(TVWebsocketConfig.getSessionMap(),            "TV"); }

    @Scheduled(fixedDelay = PING_INTERVAL_MS)
    public void eventPing()    { ping(RinoEventWebsocketConfig.getSessionMap(),     "EVENT"); }

    @Scheduled(fixedDelay = PING_INTERVAL_MS)
    public void facilityPing() { ping(RinoFacilityWebsocketConfig.getSessionMap(), "FACILITY"); }

    // ── private helpers ───────────────────────────────────────────────────────

    private void ping(ConcurrentHashMap<String, WebSocketSession> sessions, String tag) {
        TextMessage pingMsg = new TextMessage(gson.toJson(new WSCheck()));
        sessions.values().forEach(session -> {
            try {
                if (session.isOpen()) {
                    session.sendMessage(pingMsg);
                }
            } catch (Exception e) {
                log.error("[{}-PING] Failed to send ping to {}: {}", tag, session.getRemoteAddress(), e.getMessage(), e);
            }
        });
    }
}
