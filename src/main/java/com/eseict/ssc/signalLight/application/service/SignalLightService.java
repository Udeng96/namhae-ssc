package com.eseict.ssc.signalLight.application.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.io.OutputStream;
import java.net.Socket;

/**
 * SignalLightService (refac) — 경광봉 TCP 소켓 제어
 *
 * 기존(service/signalLight/SignalLightService) 개선:
 *   - try-with-resources 로 Socket 자동 close (finally 블록 제거)
 *   - isOn=false 시 꺼짐 명령만 전송 (기존: isOn 파라미터 미사용, 항상 ON→OFF 시퀀스)
 *   - e.printStackTrace() 제거 → log.error 로 통일
 *   - buildOnData() / buildOffData() private 헬퍼로 데이터 생성 로직 분리
 */
@Slf4j
@Service
public class SignalLightService {

    @Value("${signal.light.ip}")
    private String signalLightIp;

    @Value("${signal.light.port}")
    private int signalLightPort;

    @Value("${signal.light.cnt}")
    private int signalLightCnt;

    @Value("${signal.light.term}")
    private int signalLightTerm;

    /**
     * 경광봉 ON/OFF 명령 전송
     *
     * @param isOn true → 경광봉 ON (점멸 후 소등), false → 즉시 소등
     */
    public void sendSignalLightCommand(boolean isOn) {
        log.info("()() signal light command received — isOn={}, target={}:{}", isOn, signalLightIp, signalLightPort);

        try (Socket socket = new Socket(signalLightIp, signalLightPort)) {
            OutputStream output = socket.getOutputStream();

            if (isOn) {
                blinkAndOff(output);
            } else {
                sendOff(output);
            }

            log.info("()() light on/off process end, socket closed!!");
        } catch (Exception e) {
            log.error("()() signal light command failed: {}", e.getMessage(), e);
        }
    }

    // ── private ─────────────────────────────────────────────────────────────

    /** 경광봉 점멸(signalLightCnt 회) 후 소등 */
    private void blinkAndOff(OutputStream output) throws IOException, InterruptedException {
        for (int j = 0; j < signalLightCnt; j++) {
            output.write(buildOnData());
            output.flush();
            log.info("()() light on process end");

            Thread.sleep(signalLightTerm * 1000L);

            // 한 번에 안꺼지는 경우가 있어 5회 반복 전송
            for (int i = 0; i < 5; i++) {
                log.info("()() light off process start : {}", i);
                output.write(buildOffData());
                output.flush();
                Thread.sleep(200L);
            }
        }
        log.info("()() light off process end");
    }

    /** 경광봉 즉시 소등 (5회 반복) */
    private void sendOff(OutputStream output) throws IOException, InterruptedException {
        for (int i = 0; i < 5; i++) {
            output.write(buildOffData());
            output.flush();
            Thread.sleep(200L);
        }
        log.info("()() light off process end");
    }

    /**
     * 점등/점멸 명령 바이트 배열 생성
     * W(0x57) + alarm(0x03) + red/yellow/green/blue Blink(0x02) + sound ON(0x01) + spare(0x00,0x00)
     */
    private byte[] buildOnData() {
        byte[] data = new byte[10];
        data[0] = 0x57; // 'W'rite
        data[1] = 0x03; // sound type → alarm
        data[2] = 0x02; // red    Blink
        data[3] = 0x02; // yellow Blink
        data[4] = 0x02; // green  Blink
        data[5] = 0x02; // blue   Blink
        data[6] = 0x00; // white  Off
        data[7] = 0x01; // sound ON
        data[8] = 0x00;
        data[9] = 0x00;
        return data;
    }

    /**
     * 소등 명령 바이트 배열 생성
     * W(0x57) + alarm(0x03) + all Off(0x00) + sound Off(0x00) + spare(0x00,0x00)
     */
    private byte[] buildOffData() {
        byte[] data = new byte[10];
        data[0] = 0x57; // 'W'rite
        data[1] = 0x03; // sound type → alarm
        // data[2..9] = 0x00 (all off) — byte 기본값이 0 이므로 명시적 할당 생략
        return data;
    }
}
