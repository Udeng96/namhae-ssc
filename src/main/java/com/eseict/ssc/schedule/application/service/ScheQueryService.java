package com.eseict.ssc.schedule.application.service;

import com.eseict.ssc.config.ApiConstants;
import com.eseict.ssc.schedule.application.dto.SocialFileResult;
import com.eseict.ssc.schedule.application.dto.SocialResult;
import com.eseict.ssc.schedule.application.dto.SocialResultItem;
import com.eseict.ssc.monitoring.domain.entity.IocUcityZnInfo;
import com.eseict.ssc.schedule.domain.entity.ScheContentScheduleInfo;
import com.eseict.ssc.schedule.domain.entity.ScheUploadFileInfo;
import com.eseict.ssc.facility.domain.entity.ScFacInfo;
import com.eseict.ssc.repository.event.EventZnInfoRepository;
import com.eseict.ssc.repository.sche.FileRepository;
import com.eseict.ssc.repository.sche.ScheRepository;
import com.eseict.ssc.repository.scm.ScFacRepository;
import com.eseict.ssc.common.util.DateTimeUtil;
import com.google.common.base.Strings;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * ScheQueryService — 스케줄 조회 전담 서비스
 *
 * 기존 ScheService / SocialScheService / NotiScheService 에 분산된 조회 로직을 통합.
 * - getAllSchedules: znCd="400" 데드 코드 제거 (DB에 해당 구역 없음)
 * - getBroadContents / getBroadNotiContents: resolveFileInfo() 헬퍼로 반복 패턴 제거
 * - ScheUtil @Component 제거: toResultItems() private static 으로 인라인
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class ScheQueryService {

    private final ScheRepository        scheRepository;
    private final ScFacRepository       scFacRepository;
    private final EventZnInfoRepository  eventZnInfoRepository;
    private final FileRepository        fileRepository;

    /** 파일 없음을 나타내는 기본 SocialFileResult */
    private static final SocialFileResult NONE_FILE =
            new SocialFileResult("none", "none", "none", true);

    // ── 스케줄 목록 조회 ──────────────────────────────────────────────────────

    /**
     * znCd 기준으로 스케줄 목록을 조회한다.
     *
     * <p>기존: znCd="400" 분기가 존재했으나, DB에 znCd="400" 구역이 없어
     *          findByZnCd("400")이 항상 빈 리스트를 반환 → 데드 코드로 제거
     *
     * <ul>
     *   <li>znCd 없음 → 전체 스케줄 (outbDtm 역순)</li>
     *   <li>znCd 있음 → 해당 구역의 editorType="006" 스케줄만</li>
     * </ul>
     */
    public List<ScheContentScheduleInfo> getAllSchedules(String znCd) {
        if (Strings.isNullOrEmpty(znCd)) {
            return scheRepository.findAll().stream()
                    .sorted(Comparator.comparing(ScheContentScheduleInfo::getOutbDtm).reversed())
                    .collect(Collectors.toList());
        }

        List<IocUcityZnInfo> znInfos = eventZnInfoRepository.findByZnCd(znCd);
        if (znInfos.isEmpty()) {
            log.info("구역 정보를 찾을 수 없습니다: znCd={}", znCd);
            return Collections.emptyList();
        }

        List<ScFacInfo> scInfos = scFacRepository.findByTopAreaName(znInfos.get(0).getZnNm());
        if (scInfos.isEmpty()) {
            return Collections.emptyList();
        }

        String areaIdPrefix = scInfos.get(0).getMgtNo().split("_")[0] + "_";

        return scheRepository.findByContentAreaContaining(areaIdPrefix).stream()
                .filter(c -> !Strings.isNullOrEmpty(c.getEditorType())
                        && "006".equals(c.getEditorType())
                        && Arrays.stream(c.getContentArea().split(","))
                                 .allMatch(item -> item.startsWith(areaIdPrefix)))
                .collect(Collectors.toList());
    }

    public List<ScheContentScheduleInfo> getSchedulesByType(String contentType) {
        return scheRepository.findByContentType(contentType);
    }

    // ── 현재 방송 중인 콘텐츠 조회 ───────────────────────────────────────────

    /**
     * 32인치 정보표출모니터용 — 현재 방송해야 할 콘텐츠를 경로당(scMgtNo) 기준으로 조회.
     *
     * <p>기존: SocialScheService.getBroadContents()
     *   - 파일 조회 패턴(none 처리 + Optional)이 3곳에 중복
     * <p>개선: resolveFileInfo() / extractBackImageFileId() 헬퍼로 통합
     */
    public SocialResult getBroadContents(String scMgtNo) {
        String[] now = nowDateTimeParts();
        String nowDate = now[0], nowHour = now[1], nowMin = now[2], nowSec = now[3];

        List<ScheContentScheduleInfo> videos = filterByArea(
                scheRepository.findBroadingContentByType(ApiConstants.CONTENT_TYPE.VIDEO, nowDate, nowHour, nowMin, nowSec), scMgtNo);
        List<ScheContentScheduleInfo> norms = filterByArea(
                scheRepository.findBroadingContentByType(ApiConstants.CONTENT_TYPE.NORMAL, nowDate, nowHour, nowMin, nowSec), scMgtNo);
        List<ScheContentScheduleInfo> emers = filterByArea(
                scheRepository.findBroadingContentByType(ApiConstants.CONTENT_TYPE.EMERGENCY, nowDate, nowHour, nowMin, nowSec), scMgtNo);

        SocialResult result = new SocialResult();

        result.setVideos(videos.isEmpty() ? Collections.emptyList()
                : toResultItems(videos, fileRepository.findFilesByFileIds(
                        Arrays.asList(videos.get(0).getContentFile().split(",")))));

        if (norms.isEmpty()) {
            result.setNorms(Collections.emptyList());
        } else {
            String fileId = extractBackImageFileId(norms.get(0).getBackImage());
            result.setNorms(toResultItems(norms,
                    Collections.singletonList(resolveFileInfo(fileId))));
        }

        if (emers.isEmpty()) {
            result.setEmers(Collections.emptyList());
        } else {
            String backImage = emers.get(0).getBackImage();
            List<SocialFileResult> emerFiles = Strings.isNullOrEmpty(backImage)
                    ? Collections.emptyList()
                    : Collections.singletonList(
                            new SocialFileResult(backImage, backImage, ApiConstants.CONTENT_TYPE.EMERGENCY, false));
            result.setEmers(toResultItems(emers, emerFiles));
        }

        return result;
    }

    /**
     * 72인치 티비모니터용 — 현재 방송해야 할 긴급공지를 경로당 기준으로 조회.
     *
     * <p>기존: NotiScheService.getBroadNotiContents()
     *   - 일반공지 조회 로직은 주석 처리된 채 방치 → 제거
     */
    public SocialResult getBroadNotiContents(String scMgtNo) {
        String[] now = nowDateTimeParts();
        String nowDate = now[0], nowHour = now[1], nowMin = now[2], nowSec = now[3];

        List<ScheContentScheduleInfo> emers = filterByArea(
                scheRepository.findBroadingContentByType(ApiConstants.CONTENT_TYPE.EMERGENCY, nowDate, nowHour, nowMin, nowSec), scMgtNo);

        SocialResult result = new SocialResult();
        result.setVideos(Collections.emptyList());
        result.setNorms(Collections.emptyList());
        result.setEmers(emers.isEmpty()
                ? Collections.emptyList()
                : toResultItems(emers, Collections.emptyList()));

        return result;
    }

    // ── private helpers ───────────────────────────────────────────────────────

    /** 해당 경로당(scMgtNo) 을 contentArea 에 포함하는 스케줄만 필터 */
    private static List<ScheContentScheduleInfo> filterByArea(
            List<ScheContentScheduleInfo> list, String scMgtNo) {
        return list.stream()
                .filter(s -> s.getContentArea().contains(scMgtNo))
                .collect(Collectors.toList());
    }

    /**
     * fileId → SocialFileResult 변환
     *
     * <p>기존: null/"none"/"" 체크 + Optional.findById() 패턴이 getBroadContents 내 3곳 중복
     * <p>개선: 단일 메서드로 통합
     */
    private SocialFileResult resolveFileInfo(String fileId) {
        if (fileId == null || fileId.isEmpty() || "none".equals(fileId)) {
            return NONE_FILE;
        }
        Optional<ScheUploadFileInfo> info = fileRepository.findById(fileId);
        return info.map(f -> new SocialFileResult(f.getFileId(), f.getFileNm(), f.getFileType(), true))
                   .orElse(NONE_FILE);
    }

    /**
     * backImage 에서 파일 ID 추출
     *
     * <p>backImage 가 콤마로 구분된 경우 두 번째 요소(인덱스 1)가 32인치용 파일 ID
     */
    private static String extractBackImageFileId(String backImage) {
        if (backImage == null) return "none";
        return backImage.contains(",") ? backImage.split(",")[1] : backImage;
    }

    /**
     * ScheContentScheduleInfo 리스트 → SocialResultItem 리스트 변환
     *
     * <p>기존: ScheUtil.setContentForm() (@Component) — 10인자 positional constructor
     * <p>개선: private static 인라인
     */
    private static List<SocialResultItem> toResultItems(
            List<ScheContentScheduleInfo> scheList, List<SocialFileResult> files) {
        return scheList.stream()
                .map(s -> new SocialResultItem(
                        s.getContentId(), s.getContentTitle(), s.getContentCntn(),
                        s.getContentType(), s.getContentArea(),
                        s.getStartDtm() + s.getStartTime(),
                        s.getEndDtm() + s.getEndTime(),
                        s.getExpireDtm(), s.getExpireTime(), files))
                .collect(Collectors.toList());
    }

    /** [nowDate, nowHour, nowMin, nowSec] 배열 반환 — 반복 4줄 패턴 통합 */
    private static String[] nowDateTimeParts() {
        return new String[]{
                DateTimeUtil.getNowLocalDateTimeFreeFormat(ApiConstants.DATE.FORMAT_8),
                DateTimeUtil.getNowLocalDateTimeFreeFormat(ApiConstants.DATE.HOUR_FORMAT),
                DateTimeUtil.getNowLocalDateTimeFreeFormat(ApiConstants.DATE.MIN_FORMAT),
                DateTimeUtil.getNowLocalDateTimeFreeFormat(ApiConstants.DATE.SEC_FORMAT)
        };
    }
}
