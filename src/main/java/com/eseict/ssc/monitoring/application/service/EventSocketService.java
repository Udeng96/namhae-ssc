package com.eseict.ssc.monitoring.application.service;

import com.eseict.ssc.config.ApiConstants;
import com.eseict.ssc.common.dto.SocketData;
import com.eseict.ssc.common.util.DateTimeUtil;
import com.eseict.ssc.facility.domain.entity.ErfFacInfo;
import com.eseict.ssc.facility.domain.entity.ScFacInfo;
import com.eseict.ssc.monitoring.application.dto.EventResultItem;
import com.eseict.ssc.monitoring.application.util.EventSocketUtil;
import com.eseict.ssc.schedule.application.service.ScheBroadcastService;
import com.eseict.ssc.schedule.domain.entity.ScheContentScheduleInfo;
import com.eseict.ssc.schedule.domain.vo.SocketSendType;
import com.eseict.ssc.repository.fac.FacRepository;
import com.eseict.ssc.repository.sche.ScheRepository;
import com.eseict.ssc.repository.scm.ScFacRepository;
import com.eseict.ssc.socket.rinoEvent.message.GeneralMessage;
import com.google.gson.Gson;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.util.Collections;
import java.util.List;
import java.util.Map;

/**
 * EventSocketService — 리노 이벤트 소켓 메시지 처리
 *
 * 기존(service/newEvent/EventProcService) refac 이전:
 *   - EventService.getEventInfoBySocketData() → EventQueryService.getEventInfoBySocketData()
 *   - service.newEvent.util.EventSocketUtil → refac.monitoring.application.util.EventSocketUtil
 *   - SocialScheService.sendScheduleToSenior() → ScheBroadcastService.sendToSeniorMonitor()
 *   - NotiScheService.requestSettopToTv() → ScheBroadcastService.requestSettopToTv()
 *   - convertScheContentScheduleInfo() : schedule 도메인 의존 로직을 private static 으로 인라인
 */
@Slf4j
@RequiredArgsConstructor
@Service
public class EventSocketService {

    private static final Gson gson = new Gson();

    private final EventQueryService    eventQueryService;
    private final EventSocketUtil      eventSocketUtil;
    private final ScheBroadcastService broadcastService;
    private final ScheRepository       scheRepository;
    private final ScFacRepository      scFacRepository;
    private final FacRepository        facRepository;

    // ── 공개 API ────────────────────────────────────────────────────────────

    /**
     * 리노 소켓 수신 메시지를 파싱하여 상황/상태 이벤트를 처리한다.
     * (기존 EventProcService.handleEventSocket() 와 동일)
     */
    public void handleEventSocket(Object socketObj) {
        if (!(socketObj instanceof GeneralMessage)) {
            log.warn("socketObj is not a GeneralMessage: {}", socketObj);
            return;
        }

        GeneralMessage gm = (GeneralMessage) socketObj;
        Map bodyMap = parseBody(gm.getBody());

        if (bodyMap == null) {
            log.warn("bodyObj is not Map, String, byte[], or int[]: {}", gm.getBody());
            return;
        }

        Object statEvetObj  = bodyMap.get("StatEvet");
        String statEvetJson = gson.toJson(statEvetObj);
        SocketData.StatEvet statEvet = gson.fromJson(statEvetJson, SocketData.StatEvet.class);

        if (statEvet.getStatEvetId().startsWith("001", 6)) {
            log.info("HANDLE SITUATION SOCKET START");
            situationSocket(statEvet);
        } else {
            log.info("HANDLE STATUS SOCKET START");
            statusSocket(statEvet);
        }
    }

    // ── private ─────────────────────────────────────────────────────────────

    @SuppressWarnings("unchecked")
    private Map parseBody(Object bodyObj) {
        if (bodyObj instanceof Map)    return (Map) bodyObj;
        if (bodyObj instanceof String) return gson.fromJson((String) bodyObj, Map.class);
        if (bodyObj instanceof byte[]) {
            return gson.fromJson(new String((byte[]) bodyObj, StandardCharsets.UTF_8), Map.class);
        }
        if (bodyObj instanceof int[]) {
            int[] intArr  = (int[]) bodyObj;
            byte[] byteArr = new byte[intArr.length];
            for (int i = 0; i < intArr.length; i++) byteArr[i] = (byte) intArr[i];
            return gson.fromJson(new String(byteArr, StandardCharsets.UTF_8), Map.class);
        }
        return null;
    }

    private void updateScFacInfo(String mgtNo) {
        List<ScFacInfo> todaySitEvet = scFacRepository.findTodaySitEvetByMgtNo(mgtNo);
        int updateCount = scFacRepository.updateTodaySitEvet(
                todaySitEvet.get(0).getTodaySitEvet() + 1, mgtNo);

        if (updateCount != 0) {
            log.info("{} 경로당의 오늘 발생 이벤트: {}", mgtNo, todaySitEvet.get(0).getTodaySitEvet() + 1);
        } else {
            log.info("{} 경로당의 발생 이벤트 수 업데이트에 실패했습니다.", mgtNo);
        }
    }

    private void situationSocket(SocketData.StatEvet st) {
        updateScFacInfo(st.getOutbPosNm());

        String id = st.getStatEvetId();
        if (id.startsWith("02", 10) || id.startsWith("03", 10)) {
            handleOtherEventSocket(st);             // 화재 / 가스
        } else if (id.startsWith("01", 10)) {
            handleEmerBellSocket(st);               // 비상벨
        } else if (id.startsWith("04", 10)) {
            handleConfEndSocket(st);                // 화상회의 종료
        }
    }

    /** 화재·가스 상황 이벤트 — 운영 대시보드 전송 + 32인치 정보표출 모니터 스케줄 전송 */
    private void handleOtherEventSocket(SocketData.StatEvet st) {
        EventResultItem otherEvent = setExtraInfo(eventQueryService.getEventInfoBySocketData(st));
        eventSocketUtil.sendMessageSocket(otherEvent);

        ScheContentScheduleInfo scheInfo  = toScheContentScheduleInfo(otherEvent);
        ScheContentScheduleInfo saveResult = scheRepository.save(scheInfo);
        broadcastService.sendToSeniorMonitor(Collections.singletonList(saveResult), SocketSendType.UPLOAD);
        log.info("HANDLE FIRE OR GAS SOCKET EVENT SUCCESS");
    }

    /** 비상벨 상황 이벤트 — 운영 대시보드 전송 */
    private void handleEmerBellSocket(SocketData.StatEvet st) {
        EventResultItem bellSocket = setExtraInfo(eventQueryService.getEventInfoBySocketData(st));
        log.info("bellSocket: {}", bellSocket);
        eventSocketUtil.sendMessageSocket(bellSocket);
        log.info("HANDLE BELL SOCKET EVENT SUCCESS");
    }

    /** 화상회의 종료 이벤트 — 셋톱박스 TV 전환 요청 */
    private void handleConfEndSocket(SocketData.StatEvet st) {
        String outbPlac = st.getOutbPosNm();

        if (!outbPlac.contains("_")) {
            List<ErfFacInfo> facInfos = facRepository.findByFacNm(outbPlac);
            if (!facInfos.isEmpty()) {
                outbPlac = facInfos.get(0).getMgtNo();
            }
        }

        log.info("회의가 종료되어 티비 전환을 요청합니다. :: {}", st.getStatEvetOutbDtm());
        boolean result = broadcastService.requestSettopToTv(outbPlac);
        if (result) {
            log.info("{} 경로당 모니터의 티비 전환에 성공했습니다.", outbPlac);
        } else {
            log.info("{} 경로당 모니터의 티비 전환에 실패했습니다.", outbPlac);
        }
        log.info("HANDLE CONF END SOCKET EVENT SUCCESS");
    }

    /** 상태 이벤트 — 운영 대시보드 전송 */
    private void statusSocket(SocketData.StatEvet st) {
        eventSocketUtil.sendMessageSocket(eventSocketUtil.convertFacEventSocketResponse(st));
        log.info("HANDLE STATUS SOCKET EVENT SUCCESS");
    }

    private EventResultItem setExtraInfo(EventResultItem item) {
        item.setConfStatus("");
        item.setConfUserId("");
        item.setClrDtm("");
        return item;
    }

    /**
     * 화재·가스 이벤트 → 32인치 정보표출 모니터용 ScheContentScheduleInfo 변환
     *
     * <p>기존: service.newEvent.util.EventSocketUtil.convertScheContentScheduleInfo()
     * <p>EventSocketUtil(refac) 에서 "schedule 도메인 책임" 으로 제거되어 여기서 인라인 처리
     */
    private static ScheContentScheduleInfo toScheContentScheduleInfo(EventResultItem event) {
        String now14  = DateTimeUtil.getNowLocalDateTimeFreeFormat(ApiConstants.DATE.FORMAT_14);
        String now8   = DateTimeUtil.getNowLocalDateTimeFreeFormat(ApiConstants.DATE.FORMAT_8);
        String nowHour = DateTimeUtil.getNowLocalDateTimeFreeFormat(ApiConstants.DATE.HOUR_FORMAT);

        String eventCd   = event.getStatEvetCd();
        boolean isGas    = "03".equals(eventCd);
        String title     = isGas ? "가스 발생" : "화재 발생";
        String content   = isGas ? ApiConstants.CONTENT_MESSAGE.GAS : ApiConstants.CONTENT_MESSAGE.FIRE;

        return ScheContentScheduleInfo.builder()
                .contentId(event.getStatEvetOutbSeqn())
                .contentTitle(title)
                .startDtm(now8)
                .endDtm(now8)
                .repeatDate("")
                .contentArea(event.getOutbPlac())
                .contentFile("")
                .contentType(ApiConstants.CONTENT_TYPE.SENIOR_EVENT)
                .contentCntn(content)
                .backImage("")
                .expireTime("7000")
                .colorType("notice-emer")
                .startTime(nowHour)
                .endTime(nowHour)
                .contentGrpId(event.getStatEvetOutbSeqn())
                .outbDtm(now14)
                .expireDtm("")
                .editorType("001")
                .build();
    }
}
