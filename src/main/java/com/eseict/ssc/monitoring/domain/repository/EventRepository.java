package com.eseict.ssc.monitoring.domain.repository;

import com.eseict.ssc.monitoring.domain.entity.Event;

import java.util.Optional;

/**
 * EventRepository — 도메인 레이어 Port (인터페이스)
 *
 * Aggregate Root(Event) 단위 조작만 정의.
 * 복잡한 검색·집계 쿼리는 Application 레이어의 EventQueryService가
 * infrastructure의 EventQueryDslRepository를 직접 사용한다.
 */
public interface EventRepository {

    /** seqn(statEvetOutbSeqn)으로 이벤트 단건 조회 */
    Optional<Event> findBySeqn(String seqn);

    /** uSvcOutbId로 이벤트 조회 (소켓 수신 데이터 처리용) */
    Optional<Event> findByUSvcOutbId(String uSvcOutbId);

    /**
     * 이벤트 procSt 업데이트
     * @return 업데이트된 row 수 (1 이상이면 성공)
     */
    int updateProcSt(String seqn, String procSt);
}
