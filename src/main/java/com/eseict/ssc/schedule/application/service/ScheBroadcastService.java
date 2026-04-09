package com.eseict.ssc.schedule.application.service;

import com.eseict.common.net.http.HttpConnection;
import com.eseict.common.net.http.HttpConnectionException;
import com.eseict.ssc.config.ApiConstants;
import com.eseict.ssc.config.websocket.SocialWebSocketConfig;
import com.eseict.ssc.config.websocket.TVWebsocketConfig;
import com.eseict.ssc.schedule.application.dto.ScheSocketMessage;
import com.eseict.ssc.schedule.application.dto.SettopResponse;
import com.eseict.ssc.conf.domain.entity.BellConfInfo;
import com.eseict.ssc.conf.domain.entity.ConferenceSnrCenter;
import com.eseict.ssc.schedule.domain.entity.ScheContentScheduleInfo;
import com.eseict.ssc.schedule.domain.vo.SocketSendType;
import com.eseict.ssc.repository.conf.BellConfRepository;
import com.eseict.ssc.repository.conf.ConfRepository;
import com.eseict.ssc.repository.sche.ScheRepository;
import com.eseict.ssc.common.util.DateTimeUtil;
import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;

import java.io.IOException;
import java.util.Arrays;
import java.util.Collection;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;
import java.util.stream.Stream;

/**
 * ScheBroadcastService — 스케줄 전파 전담 서비스
 *
 * 기존: SocialScheService(32인치 WebSocket) + NotiScheService(72인치 WebSocket + 셋톱 HTTP) 분리
 * 개선:
 *   - sendViaWebSocket() 공통 헬퍼로 중복 제거
 *   - getConferencingScIds() 추출 (화상회의 + 비상벨 합산)
 *   - sendToTvMonitor() 변수명 개선 (webSocketScExceptionConfList → wsTargetScIds)
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class ScheBroadcastService {

    private final ConfRepository      confRepository;
    private final BellConfRepository  bellConfRepository;
    private final ScheRepository      scheRepository;

    @Value("${event.settop.url.second}")
    private String secondSetTopUrl;

    @Value("${event.settop.url.noti}")
    private String notiTvUrl;

    // ── 32인치 정보표출모니터 (Social WebSocket) ──────────────────────────────

    /**
     * 32인치 정보표출모니터에 스케줄을 WebSocket 으로 전송한다.
     *
     * <p>기존: SocialScheService.sendScheduleToSenior()
     */
    public void sendToSeniorMonitor(List<ScheContentScheduleInfo> schedules, SocketSendType sendType) {
        sendViaWebSocket(schedules, sendType, SocialWebSocketConfig.getSessionMap());
        log.info("스케쥴을 32인치 정보표출모니터에 전달했습니다.");
    }

    // ── 72인치 티비모니터 (TV WebSocket + 셋톱 HTTP) ──────────────────────────

    /**
     * 72인치 티비모니터에 스케줄을 전송한다.
     *
     * <p>화상회의·비상벨 회의 중인 경로당 제외.
     * <p>기존 긴급공지 WebSocket 수신 중인 경로당 → WebSocket 재전송.
     * <p>그 외 → 셋톱 HTTP 웹 전환 (UPLOAD 타입만).
     *
     * <p>기존: NotiScheService.sendScheduleToWide()
     *   - 변수명 webSocketScExceptionConfList 는 사실 "WebSocket 전송 대상" 목록이라 혼동 초래
     * <p>개선: wsTargetScIds (WebSocket 대상) 로 명확히 변경
     */
    public void sendToTvMonitor(List<ScheContentScheduleInfo> newSchedules, SocketSendType sendType) {
        List<String> conferencingScIds = getConferencingScIds();

        String nowDate = DateTimeUtil.getNowLocalDateTimeFreeFormat(ApiConstants.DATE.FORMAT_8);
        String nowTime = DateTimeUtil.getNowLocalDateTimeFreeFormat(ApiConstants.DATE.HOUR_FORMAT);
        String nowMin  = DateTimeUtil.getNowLocalDateTimeFreeFormat(ApiConstants.DATE.MIN_FORMAT);
        String nowSec  = DateTimeUtil.getNowLocalDateTimeFreeFormat(ApiConstants.DATE.SEC_FORMAT);

        // 현재 방송 중인 긴급공지 목록 (UPLOAD 시 방금 저장한 항목은 제외)
        List<ScheContentScheduleInfo> activeEmers = scheRepository
                .findBroadingContentByType(ApiConstants.CONTENT_TYPE.EMERGENCY, nowDate, nowTime, nowMin, nowSec);
        if (sendType.isUpload()) {
            String newGrpId = newSchedules.get(0).getContentGrpId();
            activeEmers = activeEmers.stream()
                    .filter(s -> !newGrpId.equals(s.getContentGrpId()))
                    .collect(Collectors.toList());
        }

        // 화상회의 제외 후 WebSocket 전송 대상 경로당
        List<String> wsTargetScIds = activeEmers.isEmpty()
                ? Collections.emptyList()
                : Arrays.stream(activeEmers.get(0).getContentArea().split(","))
                        .filter(id -> !conferencingScIds.contains(id))
                        .distinct()
                        .collect(Collectors.toList());

        // 새 스케줄 경로당 중 화상회의·WebSocket 대상 제외 → 셋톱 전환 대상
        List<String> settopScIds = Arrays.stream(newSchedules.get(0).getContentArea().split(","))
                .filter(id -> !conferencingScIds.contains(id) && !wsTargetScIds.contains(id))
                .collect(Collectors.toList());

        if (!wsTargetScIds.isEmpty()) {
            sendViaWebSocket(newSchedules, sendType, TVWebsocketConfig.getSessionMap());
        } else {
            log.info("웹소켓을 보낼 경로당이 없습니다.");
        }

        if (settopScIds.isEmpty()) {
            log.info("웹으로 전환할 경로당이 없습니다.");
        } else if (sendType.isUpload()) {
            sendViaSettop(settopScIds);
        } else {
            log.info("삭제, 업데이트의 타입은 셋톱 요청을 보내지 않습니다.");
        }
    }

    // ── private — 공통 WebSocket 전송 ────────────────────────────────────────

    /**
     * WebSocket 세션 맵에 스케줄 메시지를 전송한다.
     *
     * <p>기존: SocialScheService.sendScheduleToSenior() 와
     *          NotiScheService.sendScheduleUsingSocket() 가 동일한 구조 중복
     * <p>개선: 단일 private 헬퍼로 통합, sessionMap 을 파라미터로 받아 재사용
     */
    private void sendViaWebSocket(List<ScheContentScheduleInfo> schedules,
                                  SocketSendType sendType,
                                  ConcurrentHashMap<String, WebSocketSession> sessionMap) {
        ScheSocketMessage msg = new ScheSocketMessage(
                sendType.getCode() + "/" + schedules.get(0).getContentType(),
                schedules.get(0));
        TextMessage textMessage = new TextMessage(new Gson().toJson(msg));

        for (WebSocketSession session : sessionMap.values()) {
            try {
                session.sendMessage(textMessage);
            } catch (IOException e) {
                log.error("WebSocket 메시지 전송 실패: {}", e.getMessage());
            }
        }
    }

    // ── 셋톱 → TV 전환 (public) ───────────────────────────────────────────────

    /**
     * 경로당 셋톱박스에 TV(HDMI) 화면 전환을 요청한다.
     *
     * <p>기존: NotiScheService.requestSettopToTv()
     * <p>화상회의 종료 이벤트(handleConfEndSocket) 수신 시 호출된다.
     */
    public boolean requestSettopToTv(String scMgtNo) {
        Map<String, Object> header = new HashMap<>();
        header.put("Content-Type", "application/json");

        Map<String, Object> body = new HashMap<>();
        body.put("type", "package");
        body.put("slotid", scMgtNo + "_SetTop1");
        body.put("description", "HDMI 크라이저 App");
        body.put("pack", "com.krizer.hdmi_in_module");

        try {
            String response = (String) new HttpConnection().doPost(secondSetTopUrl, header, new Gson().toJson(body));
            log.info("settopToTvBody: {}", body);
            log.info("settopToTvResponse: {}", response);
            SettopResponse result = new Gson().fromJson(response, new com.google.gson.reflect.TypeToken<SettopResponse>() {}.getType());
            return "1".equals(result.getStatus());
        } catch (HttpConnectionException e) {
            log.error("Error on Send To Settop (TV): {}", e.getMessage());
            return false;
        }
    }

    // ── private — 셋톱 HTTP ───────────────────────────────────────────────────

    /**
     * 경로당 셋톱박스에 웹 화면 전환을 요청한다.
     *
     * <p>기존: NotiScheService.sendScheduleUsingSettop() — int 카운터 수동 증감
     */
    private void sendViaSettop(List<String> scIds) {
        log.info("셋톱 화면 전환 요청 — 대상 경로당 수: {}", scIds.size());
        int success = 0;
        int fail = 0;
        for (String scMgtNo : scIds) {
            log.info("{} 경로당 72인치 웹 전환 요청", scMgtNo);
            if (requestSettopToWeb(scMgtNo)) {
                success++;
                log.info("전환 성공: {}", scMgtNo);
            } else {
                fail++;
                log.info("전환 실패: {}", scMgtNo);
            }
        }
        log.info("셋톱 전환 결과 — 성공: {} / 실패: {}", success, fail);
    }

    private boolean requestSettopToWeb(String scMgtNo) {
        Map<String, Object> header = new HashMap<>();
        header.put("Content-Type", "application/json");

        Map<String, Object> body = new HashMap<>();
        body.put("type", "web");
        body.put("slotid", scMgtNo + "_SetTop1");
        body.put("description", "웹 페이지");
        body.put("url", notiTvUrl + scMgtNo);

        try {
            String response = (String) new HttpConnection<>().doPost(secondSetTopUrl, header, new Gson().toJson(body));
            SettopResponse result = new Gson().fromJson(response, new TypeToken<SettopResponse>() {}.getType());
            return "1".equals(result.getStatus());
        } catch (HttpConnectionException e) {
            log.error("셋톱 웹 전환 요청 실패: {}", e.getMessage());
            return false;
        }
    }

    // ── private — 화상회의 중인 경로당 ID 목록 ───────────────────────────────

    /**
     * 현재 화상회의(일반 + 비상벨) 중인 경로당 ID 목록을 반환한다.
     *
     * <p>기존: sendScheduleToWide() 내 인라인 → 의도 파악 어려움
     * <p>개선: 별도 메서드로 추출
     */
    private List<String> getConferencingScIds() {
        List<String> confIds = confRepository
                .findConferenceSeniorCenterByConferenceStatus("CONNECTING")
                .stream().map(ConferenceSnrCenter::getSetTopId).collect(Collectors.toList());
        List<String> bellIds = bellConfRepository
                .findNowBroadBellConfList()
                .stream().map(BellConfInfo::getPosId).collect(Collectors.toList());

        return Stream.of(confIds, bellIds)
                .flatMap(Collection::stream)
                .distinct()
                .collect(Collectors.toList());
    }
}
