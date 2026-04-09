package com.eseict.ssc.config.websocket;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.io.EOFException;
import java.util.concurrent.ConcurrentHashMap;

/**
 * WebSocket 텍스트 핸들러 공통 기반 클래스.
 *
 * <p>6개의 핸들러(Event, Facility, Social, Video, Notice, TV)가 동일한 세션 관리
 * 로직을 복붙하던 것을 이 클래스로 통합한다.</p>
 *
 * <p>서브클래스에서 구현해야 하는 항목:</p>
 * <ul>
 *   <li>{@link #logPrefix()} — 로그 접두어 (예: "EVENT-WS")</li>
 *   <li>{@link #sessions()}  — 핸들러 고유의 세션 맵 반환</li>
 * </ul>
 *
 * <p>서브클래스에서 정적(static) {@code getSessionMap()} 메서드를
 * 별도로 선언하여 기존 폴링 코드(WSPolling, SocketMsgQueuePolling)와의
 * 하위 호환성을 유지한다.</p>
 */
abstract class AbstractRinoWsHandler extends TextWebSocketHandler {

    /** 실제 서브클래스 이름으로 로거를 생성한다. */
    protected final Logger log = LoggerFactory.getLogger(getClass());

    // ── 서브클래스 계약 ────────────────────────────────────────────────────────

    /** 로그 접두어. 예: "EVENT-WS", "FACILITY-WS" */
    protected abstract String logPrefix();

    /** 이 핸들러가 관리하는 세션 맵을 반환한다. */
    protected abstract ConcurrentHashMap<String, WebSocketSession> sessions();

    // ── 공통 콜백 ─────────────────────────────────────────────────────────────

    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        sessions().put(session.getId(), session);
        super.afterConnectionEstablished(session);
        log.info("[{}] Opened :: {} // count: {}", logPrefix(), session.getRemoteAddress(), sessions().size());
    }

    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) {
        try {
            if (session.isOpen()) {
                log.info("[{}] message: {}", logPrefix(), message.getPayload());
                super.handleTextMessage(session, message);
            } else {
                log.warn("[{}] Session is closed, skipped message :: {}", logPrefix(), session.getRemoteAddress());
            }
        } catch (EOFException e) {
            log.info("[{}] EOF while handling message: {}", logPrefix(), message.getPayload());
            cleanupSession(session);
        } catch (Exception e) {
            log.error("[{}] Error while handling message", logPrefix(), e);
            cleanupSession(session);
        }
    }

    @Override
    public void handleTransportError(WebSocketSession session, Throwable exception) {
        String msg = exception.getMessage();
        if (exception instanceof EOFException || (msg != null && msg.contains("Broken pipe"))) {
            log.info("[{}] EOF or Broken pipe for session {}: {}", logPrefix(), session.getRemoteAddress(), msg);
        } else {
            log.error("[{}] Transport error for session {}: {}", logPrefix(), session.getRemoteAddress(), msg, exception);
        }
        cleanupSession(session);
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus closeStatus) {
        cleanupSession(session);
    }

    // ── 공통 유틸 ─────────────────────────────────────────────────────────────

    protected void cleanupSession(WebSocketSession session) {
        try {
            if (session.isOpen()) {
                session.close();
            }
        } catch (Exception e) {
            log.error("[{}] Error while closing session {}: {}", logPrefix(), session.getRemoteAddress(), e.getMessage(), e);
        } finally {
            sessions().remove(session.getId());
            log.info("[{}] Session removed :: {} // count: {}", logPrefix(), session.getRemoteAddress(), sessions().size());
        }
    }
}
