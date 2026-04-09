package com.eseict.ssc.schedule.application.service;

import com.eseict.ssc.config.ApiConstants;
import com.eseict.ssc.schedule.domain.entity.ScheContentScheduleInfo;
import com.eseict.ssc.schedule.domain.vo.ContentType;
import com.eseict.ssc.schedule.domain.vo.SocketSendType;
import com.eseict.ssc.repository.sche.ScheRepository;
import com.eseict.ssc.common.util.DateTimeUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.util.Arrays;
import java.util.Base64;
import java.util.List;
import java.util.stream.Collectors;

/**
 * ScheCommandService — 스케줄 등록·수정·삭제 전담 서비스
 *
 * 기존: ScheService 에 저장/수정/삭제 + afterSchedule + 중복 체크 + ID 생성이 혼재
 * 개선:
 *   - setSchedulesSaveForm(schedules, isVideo) → assignIds(schedules)
 *     isVideo 파라미터가 메서드 내부에서 전혀 사용되지 않아 제거 (사문화 파라미터)
 *   - chkDuplicateSchedule → hasDuplicateSchedule (boolean 의미 명확화)
 *   - afterSchedule: ContentType.isEmergency() / isSendToTv() 로 분기 의도 명시
 *     Integer.parseInt → Long.parseLong (날짜+시각 10자리 = 최대 99억 → int 오버플로 방지)
 *   - 방송 전파: ScheBroadcastService 에 위임 (sendToSeniorMonitor / sendToTvMonitor)
 *   - ScheUtil @Component 제거: generateId() private static 으로 인라인
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class ScheCommandService {

    private final ScheBroadcastService broadcastService;
    private final ScheRepository       scheRepository;

    // ── 스케줄 등록 ───────────────────────────────────────────────────────────

    /**
     * 스케줄을 저장하고 방송 전파를 트리거한다.
     *
     * <p>긴급공지(EMERGENCY)는 중복 체크를 건너뛴다.
     */
    public String saveScheduleInfos(List<ScheContentScheduleInfo> schedules) {
        if (schedules.isEmpty()) {
            log.info("등록할 스케줄이 없습니다.");
            return ApiConstants.SCHE_RESULT.NO_SHCEDULE;
        }

        ContentType type = ContentType.of(schedules.get(0).getContentType());
        boolean hasDuplicate = (type == null || !type.isEmergency()) && hasDuplicateSchedule(schedules);
        if (hasDuplicate) {
            return ApiConstants.SCHE_RESULT.DUPLICATE;
        }

        List<ScheContentScheduleInfo> saved = scheRepository.saveAll(assignIds(schedules));
        if (saved.isEmpty()) {
            log.info("스케줄 저장 실패");
            return ApiConstants.SCHE_RESULT.FAILED;
        }

        afterSchedule(saved, SocketSendType.UPLOAD);
        log.info("스케줄 저장 성공");
        return ApiConstants.SCHE_RESULT.SUCCESS;
    }

    // ── 스케줄 수정 ───────────────────────────────────────────────────────────

    /**
     * 기존 그룹 삭제 후 새 항목으로 교체하고 방송 전파를 트리거한다.
     */
    public String updateSchedule(List<ScheContentScheduleInfo> schedules) {
        if (schedules.isEmpty()) {
            log.info("수정할 스케줄이 없습니다.");
            return ApiConstants.SCHE_RESULT.FAILED;
        }

        ContentType type = ContentType.of(schedules.get(0).getContentType());
        boolean hasDuplicate = (type == null || !type.isEmergency()) && hasDuplicateSchedule(schedules);
        if (hasDuplicate) {
            return ApiConstants.SCHE_RESULT.DUPLICATE;
        }

        int deleted = scheRepository.deleteAllByContentGrpId(schedules.get(0).getContentGrpId());
        if (deleted == 0) {
            log.info("스케줄 수정 실패 — 삭제 대상 없음");
            return ApiConstants.SCHE_RESULT.FAILED;
        }

        List<ScheContentScheduleInfo> saved = scheRepository.saveAll(assignIds(schedules));
        if (saved.isEmpty()) {
            log.info("스케줄 수정 실패 — 재저장 오류");
            return ApiConstants.SCHE_RESULT.FAILED;
        }

        afterSchedule(saved, SocketSendType.UPDATE);
        log.info("스케줄 수정 성공");
        return ApiConstants.SCHE_RESULT.SUCCESS;
    }

    // ── 스케줄 삭제 ───────────────────────────────────────────────────────────

    public String deleteSchedule(String grpId) {
        List<ScheContentScheduleInfo> targets = scheRepository.findByContentGrpId(grpId);
        int deleted = scheRepository.deleteAllByContentGrpId(grpId);
        if (deleted == 0) {
            log.info("스케줄 삭제 실패");
            return ApiConstants.SCHE_RESULT.FAILED;
        }

        afterSchedule(targets, SocketSendType.DELETE);
        log.info("스케줄 삭제 성공");
        return ApiConstants.SCHE_RESULT.SUCCESS;
    }

    // ── private — 저장 후 방송 전파 ───────────────────────────────────────────

    /**
     * 저장된 스케줄을 32인치·72인치 모니터에 전파한다.
     *
     * <p>기존 afterSchedule() 대비 개선 사항:
     * <ul>
     *   <li>contentType 문자열 비교 → ContentType.isEmergency() / isSendToTv() 사용</li>
     *   <li>Integer.parseInt → Long.parseLong (날짜+시각 10자리, int 오버플로 방지)</li>
     *   <li>"refresh" 타이틀·내용은 프론트 웹 새로고침 트리거 용도 — TV 전송 제외</li>
     * </ul>
     */
    private void afterSchedule(List<ScheContentScheduleInfo> schedules, SocketSendType sendType) {
        ContentType type = ContentType.of(schedules.get(0).getContentType());

        List<ScheContentScheduleInfo> nowBroad;
        if (type != null && type.isEmergency()) {
            // 긴급공지: 시간 무관하게 저장 즉시 전송
            nowBroad = schedules;
        } else {
            String nowDate = DateTimeUtil.getNowLocalDateTimeFreeFormat(ApiConstants.DATE.FORMAT_8);
            String nowHour = DateTimeUtil.getNowLocalDateTimeFreeFormat(ApiConstants.DATE.HOUR_FORMAT);
            long nowVal = Long.parseLong(nowDate + nowHour);
            nowBroad = schedules.stream()
                    .filter(s -> Long.parseLong(s.getStartDtm() + s.getStartTime()) <= nowVal
                              && Long.parseLong(s.getEndDtm()   + s.getEndTime())   >= nowVal)
                    .collect(Collectors.toList());
        }

        if (nowBroad.isEmpty()) {
            log.info("지금 표출해야 할 스케줄이 없습니다.");
            return;
        }

        // 32인치 정보표출모니터 — 모든 콘텐츠 타입 전송
        broadcastService.sendToSeniorMonitor(nowBroad, sendType);

        // 72인치 티비모니터 — VIDEO·일반공지 제외, "refresh" 트리거 제외
        boolean isRefresh = "refresh".equals(nowBroad.get(0).getContentTitle())
                         || "refresh".equals(nowBroad.get(0).getContentCntn());
        if (type != null && type.isSendToTv() && !isRefresh) {
            broadcastService.sendToTvMonitor(nowBroad, sendType);
        }
    }

    // ── private — 중복 체크 ───────────────────────────────────────────────────

    /**
     * 같은 경로당에 같은 콘텐츠 타입·시간대 스케줄이 이미 존재하면 true.
     *
     * <p>기존: chkDuplicateSchedule — 변수명 암호화, 두 중첩 루프 의도 파악 어려움
     * <p>개선: hasDuplicateSchedule 로 boolean 의미 명확화, 내부 for 루프 → anyMatch 스트림
     */
    private boolean hasDuplicateSchedule(List<ScheContentScheduleInfo> schedules) {
        for (ScheContentScheduleInfo schedule : schedules) {
            List<String> newScIds = Arrays.asList(schedule.getContentArea().split(","));
            List<ScheContentScheduleInfo> conflicts = scheRepository.chkDuplication(
                    schedule.getContentType(),
                    schedule.getStartDtm() + schedule.getStartTime(),
                    schedule.getEndDtm()   + schedule.getEndTime(),
                    schedule.getContentGrpId());

            boolean anyOverlap = conflicts.stream()
                    .map(c -> Arrays.asList(c.getContentArea().split(",")))
                    .anyMatch(existingIds -> newScIds.stream().anyMatch(existingIds::contains));
            if (anyOverlap) return true;
        }
        return false;
    }

    // ── private — ID 할당 ─────────────────────────────────────────────────────

    /**
     * 스케줄 목록에 contentId 및 contentGrpId 를 새로 할당한다.
     *
     * <p>기존: setSchedulesSaveForm(schedules, boolean isVideo)
     *          → isVideo 가 메서드 내부에서 참조되는 코드가 없어 완전히 사문화
     * <p>개선: assignIds() 로 명칭 변경, isVideo 파라미터 제거
     */
    private List<ScheContentScheduleInfo> assignIds(List<ScheContentScheduleInfo> schedules) {
        String grpId = generateId();
        schedules.forEach(s -> {
            s.setContentId(generateId());
            s.setContentGrpId(grpId);
        });
        return schedules;
    }

    /**
     * SecureRandom 기반 URL-safe Base64 ID 생성 (16 바이트 → 22자)
     *
     * <p>기존: ScheUtil @Component 내 makeId() → @Component 의존 제거, private static 으로 인라인
     */
    private static String generateId() {
        byte[] bytes = new byte[16];
        new SecureRandom().nextBytes(bytes);
        return Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
    }
}
