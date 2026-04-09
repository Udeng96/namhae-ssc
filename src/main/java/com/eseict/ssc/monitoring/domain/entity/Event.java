package com.eseict.ssc.monitoring.domain.entity;

import com.eseict.ssc.monitoring.domain.vo.*;
import lombok.Builder;
import lombok.Getter;

/**
 * Event — Monitoring 바운디드 컨텍스트의 Aggregate Root
 *
 * DB 테이블: ioc_stat_evet_outb_hist (IOC 스키마)
 * 비즈니스 규칙:
 *   - procSt "1"=발생, "4"=소방공유, "5"=종료
 *   - unitSvcCd "001"=상황(긴급벨·화재·가스), "002"=현황(시설고장)
 *
 * 개선:
 *  - @Builder(toBuilder=true) 도입 → shareToFire() 에서 전체 필드 재나열 불필요
 *  - isActive() 를 EventStatus.isActive() 에 위임 (중복 제거)
 */
@Getter
@Builder(toBuilder = true)
public class Event {

    private final String      seqn;         // statEvetOutbSeqn (PK)
    private final ZoneCode    zoneCode;     // znCd
    private final EventCode   eventCode;   // statEvetCd
    private final EventType   eventType;   // unitSvcCd
    private final EventStatus status;      // procSt
    private final String      gradeCode;   // statEvetGdCd
    private final String      location;    // outbPlac (SNS 위치 or mgtNo)
    private final String      occurredAt;  // outbDtm
    private final String      clearedAt;   // clrDtm
    private final Coordinates coordinates;
    private final String      svcThemeCd;  // 고정값: "SSC"

    // ── 도메인 행동 ─────────────────────────────────────────

    public boolean isActive()   { return status != null && status.isActive(); }
    public boolean isFinished() { return status != null && status.isFinished(); }

    /** SNS 위치 여부: outbPlac에 "_" 포함 */
    public boolean hasValidLocation() { return location != null && location.contains("_"); }

    /** 좌표 유효 여부 */
    public boolean hasValidCoordinates() { return coordinates != null && coordinates.isValid(); }

    /**
     * 소방 대시보드 공유: procSt 1 → 4 (SHARED_TO_FIRE)
     * toBuilder() 를 사용해 status 만 변경한 새 인스턴스 반환 (불변 원칙)
     *
     * @throws IllegalStateException 이미 종료된 이벤트에 호출한 경우
     */
    public Event shareToFire() {
        if (!isActive()) {
            throw new IllegalStateException("이미 처리된 이벤트는 소방 공유할 수 없습니다. seqn=" + seqn);
        }
        return this.toBuilder().status(EventStatus.SHARED_TO_FIRE).build();
    }
}
