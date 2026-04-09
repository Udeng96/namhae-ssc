package com.eseict.ssc.monitoring.infrastructure.repository;

import com.eseict.ssc.monitoring.domain.entity.Event;
import com.eseict.ssc.monitoring.domain.repository.EventRepository;
import com.eseict.ssc.monitoring.domain.vo.*;
import com.eseict.ssc.monitoring.domain.entity.IocStatEvetOutbHist;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;

/**
 * EventRepositoryAdapter — 도메인 포트(EventRepository) 구현체
 *
 * 기존 JPA EventRepository 를 Adapter 패턴으로 감싸
 * 도메인 레이어가 인프라 세부 구현에 의존하지 않도록 격리한다.
 */
@Component
@RequiredArgsConstructor
public class EventRepositoryAdapter implements EventRepository {

    /** 기존 JPA + QueryDSL 복합 레포지터리 */
    private final com.eseict.ssc.repository.event.EventRepository jpaRepository;

    @Override
    public Optional<Event> findBySeqn(String seqn) {
        return jpaRepository.findById(seqn).map(this::toDomain);
    }

    @Override
    public Optional<Event> findByUSvcOutbId(String uSvcOutbId) {
        List<IocStatEvetOutbHist> items = jpaRepository.findByuSvcOutbId(uSvcOutbId);
        return items.isEmpty() ? Optional.empty() : Optional.of(toDomain(items.get(0)));
    }

    @Override
    public int updateProcSt(String seqn, String procSt) {
        // 현재 기존 레포지터리는 '4' 로만 업데이트 가능 (하드코딩).
        // 도메인 인터페이스는 범용 파라미터를 제공하므로,
        // 향후 Native Query 등으로 확장 가능한 구조를 유지.
        return jpaRepository.updateProcStNameBySeqn(seqn);
    }

    // ── 엔티티 → 도메인 객체 변환 ─────────────────────────────────────────

    private Event toDomain(IocStatEvetOutbHist e) {
        return Event.builder()
                .seqn(e.getStatEvetOutbSeqn())
                .zoneCode(safeZoneCode(e.getZnCd()))
                .eventCode(safeEventCode(e.getStatEvetCd()))
                .eventType(safeEventType(e.getUnitSvcCd()))
                .status(safeEventStatus(e.getProcSt()))
                .gradeCode(e.getStatEvetGdCd())
                .location(e.getOutbPlac())
                .occurredAt(e.getOutbDtm())
                .clearedAt(e.getClrDtm())
                .coordinates(Coordinates.of(null, null)) // 좌표는 별도 테이블 조회 필요
                .svcThemeCd(e.getSvcThemeCd())
                .build();
    }

    /** null·blank 허용 안전 변환 (Java 8 호환: trim().isEmpty()) */
    private static ZoneCode safeZoneCode(String v) {
        return (v != null && !v.trim().isEmpty()) ? ZoneCode.of(v) : null;
    }

    private static EventCode safeEventCode(String v) {
        try { return EventCode.of(v); } catch (IllegalArgumentException e) { return null; }
    }

    private static EventType safeEventType(String v) {
        try { return EventType.of(v); } catch (IllegalArgumentException e) { return null; }
    }

    private static EventStatus safeEventStatus(String v) {
        try { return EventStatus.of(v); } catch (IllegalArgumentException e) { return null; }
    }
}
