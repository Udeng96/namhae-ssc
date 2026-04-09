package com.eseict.ssc.monitoring.application.util;

import com.eseict.ssc.common.dto.SocketData;
import com.eseict.ssc.monitoring.application.dto.FacEventSc;
import com.eseict.ssc.socket.rinoEvent.rcv.queue.event.SocketMsgQueue;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

/**
 * EventSocketUtil (refac) — 이벤트 소켓 전송 유틸
 *
 * 기존(service/newEvent/util/EventSocketUtil):
 *   - CommonUtil, ScheUtil, GeneralMessage, ScheContentScheduleInfo 등
 *     다수 레거시 의존성 보유
 *   - convertScheContentScheduleInfo(): 스케줄 전환 로직 (schedule 도메인 관심사)
 * 개선:
 *   - refac/monitoring 도메인에 맞는 기능만 포함
 *   - sendMessageSocket(): 소켓 메시지 발송 (EventCommandService 사용)
 *   - convertFacEventSocketResponse(): 소켓 이벤트 DTO 변환 (모니터링 관심사)
 *   - CommonUtil / ScheUtil 의존 제거 (DateTimeUtil static 호출로 대체 가능)
 *   - convertScheContentScheduleInfo() 제거 (schedule 도메인 책임)
 */
@Component
@Slf4j
public class EventSocketUtil {

    private static final Gson gson = new GsonBuilder().create();

    /**
     * 객체를 JSON 직렬화하여 소켓 큐에 적재
     * (기존 EventSocketUtil.sendMessageSocket 와 동일)
     */
    public void sendMessageSocket(Object event) {
        String message = gson.toJson(event);
        log.info("message:{}", event);
        SocketMsgQueue.getInstance().put(message);
    }

    /**
     * 상태 이벤트 소켓 데이터 → FacEventSc DTO 변환
     * (기존 EventSocketUtil.convertFacEventSocketResponse 와 동일)
     */
    public FacEventSc convertFacEventSocketResponse(SocketData.StatEvet socketData) {
        String uSvcOutbId      = socketData.getStatEvetId();
        String statEvetGdCd    = socketData.getStatEvetGdCd();
        String statEvetOutbDtm = socketData.getStatEvetOutbDtm();
        String scMgtNo  = socketData.getStatEvetItem().get(0).getValue();
        String facMgtNo = socketData.getStatEvetItem().get(1).getValue();
        if (facMgtNo.length() == 6 && facMgtNo.matches("^[0-9]+$")) {
            facMgtNo = scMgtNo + "_" + facMgtNo;
        }
        return new FacEventSc(uSvcOutbId, facMgtNo, statEvetGdCd,
                statEvetGdCd.equals("00") ? "정상" : "고장", statEvetOutbDtm);
    }
}
