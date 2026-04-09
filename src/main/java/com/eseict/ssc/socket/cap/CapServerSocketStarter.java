package com.eseict.ssc.socket.cap;

import com.eseict.ssc.socket.cap.alert.AlertClient;
import io.netty.channel.ChannelHandlerContext;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * CAP 서버 클라이언트 시작/재시작 관리 컴포넌트.
 *
 * {@code map} 은 AlertHandler 가 연결 수립/종료 시 직접 접근하므로 public static 으로 유지한다.
 */
@Component
@Slf4j
public class CapServerSocketStarter {

    /** 활성 CAP 채널 맵. key = "host:port", AlertHandler 에서 관리 */
    public static final Map<String, ChannelHandlerContext> map = new ConcurrentHashMap<>();

    @Value("${cap.server.ip}")
    private String capServerIp;

    @Value("${cap.server.port}")
    private String capServerPort;

    /** CAP 서버에 재연결한다. */
    public void reStart() {
        try {
            AlertClient alertClient = new AlertClient(capServerIp, Integer.parseInt(capServerPort));
            alertClient.start();
            log.info("CAP 클라이언트 재시작: {}:{}", capServerIp, capServerPort);
        } catch (Exception e) {
            throw new RuntimeException(
                    "CAP 서버 연결 실패: " + capServerIp + ":" + capServerPort, e);
        }
    }
}
