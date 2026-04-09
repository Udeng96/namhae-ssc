package com.eseict.ssc.socket.rinoEvent.rcv.queue.event;
import com.eseict.ssc.config.websocket.RinoEventWebsocketConfig;
import com.eseict.ssc.config.websocket.RinoFacilityWebsocketConfig;
import lombok.extern.slf4j.Slf4j;
import org.json.JSONException;
import org.json.JSONObject;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;

import java.io.IOException;

@Slf4j
public class SocketMsgQueuePolling implements Runnable {

    private static final SocketMsgQueue msgQueue = SocketMsgQueue.getInstance();

    // 스레드의 실행 여부를 제어하는 플래그입니다.
    boolean bRunning = true;

    /**
     *
     * 메세지 큐에서 데이터를 가져옵니다.
     *
     * @name : run
     * @author : ssiky
     * @since : 2024. 12. 17.
     */
    @Override
    public void run() {
        while (bRunning) {
            try {
                // 큐가 비어있으면 새로운 메세지가 들어올때까지 대기합니다.
                String msg = msgQueue.take();
                // 메세지가 null이거나 비어있으면 다음 루프로 넘어갑니다.
                if (msg == null || msg.isEmpty()) {
                    continue;
                }
                // 메세지가 존재하면 sendToWebSocketClients 메서드를 호출하여 메세지를 전송합니다.
                sendToWebSocketClients(msg);
            } catch (InterruptedException e) {
                log.warn("Polling thread interrupted", e);
                // interrupt 상태를 복구합니다.
                Thread.currentThread().interrupt();
                // 필요에 따라 interrupt 발생 시 종료합니다. ssc에서는 사용되지 않습니다.
//                break;
            } catch (Exception e) {
                log.error("Unexpected exception in polling thread", e);
            }
        }
    }

    /**
     *
     * unitSvcCd의 값에 따라 다른 웹소켓 세션에 메세지를 전송합니다.
     *
     * @name : sendToWebSocketClients
     * @author : ssiky
     * @since : 2024. 12. 17.
     */
    private void sendToWebSocketClients(String msg) {
        try {
            JSONObject jsonRvcdMsg = new JSONObject(msg);
            // TODO 20241217 소켓 전송이 추가된다면 unitSvcCd가 아닌 다른 정보로 분기처리를 바꿔야함.
            String unitSvcCd = "";
            try {
                unitSvcCd = jsonRvcdMsg.getString("unitSvcCd");
            } catch (JSONException e) {
                log.warn("[QUEUE-POLL] unitSvcCd 없음, 시설물(002)로 기본 처리. msg={}", msg);
                unitSvcCd = "002";
            }

            if ("001".equals(unitSvcCd)) {
                RinoEventWebsocketConfig.getSessionMap().values().forEach(session -> sendMessage(session, msg));
                log.info("Event Situation Message sent to client: {}", msg);
            } else {
                RinoFacilityWebsocketConfig.getSessionMap().values().forEach(session -> sendMessage(session, msg));
                log.info("Facility Status Message sent to client: {}", msg);
            }
        } catch (Exception e) {
            log.error("Error while sending message to clients", e);
        }
    }

    /**
     *
     * 각 웹소켓 세션에 메세지를 전송합니다.
     *
     * @name : sendMessage
     * @author : ssiky
     * @since : 2024. 12. 17.
     */
    private void sendMessage(WebSocketSession session, String msg) {
        try {
            if (session.isOpen()) {
                session.sendMessage(new TextMessage(msg));
            } else {
                log.warn("Skipped closed WebSocket session.");
            }
        } catch (IOException e) {
            log.error("Failed to send message to client", e);
        }
    }

    public void stop() {
        bRunning = false;
    }

}
