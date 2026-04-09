package com.eseict.ssc.monitoring.application.service;

import com.eseict.ssc.common.dto.SocketData;
import com.eseict.ssc.monitoring.application.dto.EventResultItem;
import com.eseict.ssc.facility.domain.entity.ErfFacInfo;
import com.eseict.ssc.facility.domain.entity.ErfPosCrdnt;
import com.eseict.ssc.repository.event.EventPosRepository;
import com.eseict.ssc.repository.fac.FacPosRepository;
import com.eseict.ssc.repository.fac.FacRepository;
import com.eseict.ssc.monitoring.application.util.EventSocketUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * EventCommandService — 이벤트 쓰기 전용 Application Service (CQRS Command Side)
 *
 * 담당 기능:
 *  - shareEventToFire : 이벤트 소방 공유 (procSt 1 → 4)
 *  - handleSocketPosData : 소켓 위치 데이터 처리 (xCrdnt/yCrdnt 갱신)
 */
@Service
@Slf4j
@RequiredArgsConstructor
public class EventCommandService {

    private final com.eseict.ssc.repository.event.EventRepository eventRepository;
    private final EventPosRepository  eventPosRepository;
    private final FacRepository       facRepository;
    private final FacPosRepository    facPosRepository;
    private final EventSocketUtil     eventSocketUtil;

    /** EventQueryService 를 주입받아 소방 공유 후 이벤트 상세 조회에 재사용 */
    private final EventQueryService   eventQueryService;

    // ── 공개 API ────────────────────────────────────────────────────────────

    /**
     * 소방 대시보드 공유: procSt '4' 로 업데이트 후 소켓 전송
     * (반환 타입: boolean — 기존과 동일)
     */
    public boolean shareEventToFire(String seqn) {
        int updated = eventRepository.updateProcStNameBySeqn(seqn);
        log.debug("소방 공유 procSt 업데이트 — seqn={}, result={}", seqn, updated);

        if (updated < 1) {
            log.warn("소방 공유 업데이트 실패 — seqn={}", seqn);
            return false;
        }

        EventResultItem shareInfo = eventQueryService.getEventInfoBySeqn(seqn);
        shareInfo.setProcSt("4");
        shareInfo.setConfStatus("1");

        try {
            eventSocketUtil.sendMessageSocket(shareInfo);
            log.info("소방 공유 소켓 전송 성공 — seqn={}", seqn);
            return true;
        } catch (Exception e) {
            log.error("소방 공유 소켓 전송 실패 — seqn={}", seqn, e);
            return false;
        }
    }

    /**
     * 소켓 위치 데이터 처리: 시설 좌표로 이벤트 위치 갱신
     * (반환 타입: EventResultItem — 기존과 동일)
     */
    public EventResultItem handleSocketPosData(SocketData.StatEvet st, String plcId) {
        EventResultItem socketEvent = eventQueryService.getEventInfoBySocketData(st);

        List<ErfFacInfo> facInfos = facRepository.findByMgtNo(plcId);
        if (facInfos.isEmpty()) {
            log.info("시설 정보 없음 — plcId={}", plcId);
            return socketEvent;
        }

        String facId = facInfos.get(0).getFacId();
        List<ErfPosCrdnt> positions = facPosRepository.findByFacId(facId);
        if (positions.isEmpty()) {
            log.info("시설 좌표 없음 — facId={}", facId);
            return socketEvent;
        }

        ErfPosCrdnt pos = positions.get(0);
        ErfFacInfo  fac = facInfos.get(0);

        socketEvent.setXcrdnt(pos.getXCrdnt());
        socketEvent.setYcrdnt(pos.getYCrdnt());
        socketEvent.setPosNm(fac.getPosNm());
        socketEvent.setAddrShort(fac.getAddrShort());

        int updated = eventPosRepository.updateXandYBySeqn(
                pos.getXCrdnt(), pos.getYCrdnt(), socketEvent.getStatEvetOutbSeqn());
        log.info("소켓 위치 갱신 — seqn={}, result={}", socketEvent.getStatEvetOutbSeqn(), updated);

        return socketEvent;
    }
}
