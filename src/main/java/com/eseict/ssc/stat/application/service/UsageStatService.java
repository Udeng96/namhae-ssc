package com.eseict.ssc.stat.application.service;

import com.eseict.ssc.config.ApiConstants;
import com.eseict.ssc.stat.application.dto.KeyCountItem;
import com.eseict.ssc.stat.application.dto.UsageStatResult;
import com.eseict.ssc.facility.domain.entity.ErfFacInfo;
import com.eseict.ssc.facility.domain.entity.TblAreaInfo;
import com.eseict.ssc.conf.domain.entity.ConferenceSnrCenter;
import com.eseict.ssc.facility.domain.entity.OperatingHist;
import com.eseict.ssc.stat.domain.vo.GroupMode;
import com.eseict.ssc.repository.conf.ConfSessionRepository;
import com.eseict.ssc.repository.conf.ConfSnrCenterRepository;
import com.eseict.ssc.repository.conf.ConfStatusRepository;
import com.eseict.ssc.repository.fac.FacAreaRepository;
import com.eseict.ssc.repository.fac.FacRepository;
import com.eseict.ssc.repository.sche.ScheRepository;
import com.eseict.ssc.repository.scm.OperRepository;
import com.eseict.ssc.repository.social.VmsRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.*;
import java.util.*;
import java.util.stream.Collectors;

/**
 * UsageStatService (refac) — 이용률 통계
 *
 * 기존(service/newStat/UsageStatService):
 *   - StatUtil @Component 의존 (parseDate)
 *   - nested enum GroupMode 4벌 중복
 *   - decideGroupMode / makeGroupKey / generateAllDateKeys / toMonthWeekKey 4벌 중복
 *   - getUsageStat 에서 getServiceUsage → (getOpenConfUsage + getConnConfUsage),
 *     이후 getOpenConfUsage + getConnConfUsage 를 다시 직접 호출 → DB 각 2회 중복 쿼리
 *   - areaRepository.findAll() 에서 지역 필터 패턴
 *     (substring(7,10)=="000" + 설천면/남면 제외) 이 getConnConfUsage / getContentAreaUsage 에 중복
 *   - areaRepository.findAll() → toMap(areaId, areaName) 이
 *     getVisitorUsage / getSeniorUsageRate 에 완전 동일하게 중복
 * 개선:
 *   - StatUtil 제거 → StatDateUtil.* (static)
 *   - GroupMode → refac/stat/domain/vo/GroupMode
 *   - 날짜 유틸 4벌 → StatDateUtil.* 1벌로 통합
 *   - getUsageStat: openConfUsage / connConfUsage 1회 계산 후 serviceUsage 합산 + 응답 공유
 *     → getOpenConfUsage / getConnConfUsage DB 쿼리 각 1회 절감
 *   - EXCLUDED_AREAS 상수 + activeAreaNames() 헬퍼:
 *     중복 지역 필터 패턴(설천면·남면 제외) 2벌 → 단일 private 메서드
 *   - loadAreaIdToNameMap() 헬퍼:
 *     areaId→areaName 맵 구축 패턴 2벌 → 단일 private 메서드
 */
@Service
@Slf4j
@RequiredArgsConstructor
public class UsageStatService {

    private final ConfStatusRepository   confStatusRepository;
    private final ConfSessionRepository  confSessionRepository;
    private final ScheRepository         scheRepository;
    private final ConfSnrCenterRepository confSnrCenterRepository;
    private final FacRepository          facRepository;
    private final VmsRepository          vmsRepository;
    private final FacAreaRepository      areaRepository;
    private final OperRepository         operRepository;

    /** 통계에서 제외할 지역명 — getConnConfUsage / getContentAreaUsage 에서 공통 사용 */
    private static final Set<String> EXCLUDED_AREAS =
            new HashSet<>(Arrays.asList("설천면", "남면"));

    // ── 전체 이용 통계 ────────────────────────────────────────

    /**
     * openConfUsage / connConfUsage 를 1회만 계산한 뒤
     * serviceUsage 합산과 UsageStatResult 응답에 재사용.
     *
     * 기존: getServiceUsage() → 내부에서 getOpenConfUsage + getConnConfUsage 호출,
     *       이후 getOpenConfUsage + getConnConfUsage 를 다시 개별 호출
     *       → 각 메서드 DB 쿼리 2회 발생 → 1회로 절감
     */
    public UsageStatResult getUsageStat(String startDtm, String endDtm) {
        log.info(">>> usage stat start");
        long s, e;

        // openConf / connConf: 1회 계산 → serviceUsage 합산 + 개별 응답 모두 사용
        s = System.nanoTime();
        List<KeyCountItem> openConfUsage = getOpenConfUsage(startDtm, endDtm);
        e = System.nanoTime();
        log.info("usage openConfUsage time: {}초", (e - s) / 1_000_000_000.0);

        s = System.nanoTime();
        List<KeyCountItem> connConfUsage = getConnConfUsage(startDtm, endDtm);
        e = System.nanoTime();
        log.info("usage connConfUsage time: {}초", (e - s) / 1_000_000_000.0);

        int videoCnt = getVideoScheCnt(startDtm, endDtm);
        List<KeyCountItem> serviceUsage = Arrays.asList(
                new KeyCountItem("화상회의 개설",   openConfUsage.stream().mapToInt(KeyCountItem::getCount).sum()),
                new KeyCountItem("화상회의 접속",   connConfUsage.stream().mapToInt(KeyCountItem::getCount).sum()),
                new KeyCountItem("콘텐츠 정보 제공", videoCnt)
        );

        s = System.nanoTime();
        List<KeyCountItem> visitorUsage = getVisitorUsage(startDtm, endDtm);
        e = System.nanoTime();
        log.info("usage visitorUsage time: {}초", (e - s) / 1_000_000_000.0);

        s = System.nanoTime();
        List<KeyCountItem> contentUsage = getContentUsage(startDtm, endDtm);
        e = System.nanoTime();
        log.info("usage contentUsage time: {}초", (e - s) / 1_000_000_000.0);

        s = System.nanoTime();
        List<KeyCountItem> contentAreaUsage = getContentAreaUsage(startDtm, endDtm);
        e = System.nanoTime();
        log.info("usage contentAreaUsage time: {}초", (e - s) / 1_000_000_000.0);

        s = System.nanoTime();
        List<KeyCountItem> seniorUsage = getSeniorUsageRate(startDtm, endDtm);
        e = System.nanoTime();
        log.info("usage seniorUsage time: {}초", (e - s) / 1_000_000_000.0);

        return new UsageStatResult(serviceUsage, visitorUsage, openConfUsage,
                connConfUsage, contentUsage, contentAreaUsage, seniorUsage);
    }

    // ── 서비스 이용 통계 (합계) — 단독 API 용 ───────────────

    public List<KeyCountItem> getServiceUsage(String startDtm, String endDtm) {
        int openCnt  = getOpenConfUsage(startDtm, endDtm).stream().mapToInt(KeyCountItem::getCount).sum();
        int connCnt  = getConnConfUsage(startDtm, endDtm).stream().mapToInt(KeyCountItem::getCount).sum();
        int videoCnt = getVideoScheCnt(startDtm, endDtm);
        return Arrays.asList(
                new KeyCountItem("화상회의 개설",   openCnt),
                new KeyCountItem("화상회의 접속",   connCnt),
                new KeyCountItem("콘텐츠 정보 제공", videoCnt)
        );
    }

    // ── 방문자 수 (line_cross 이벤트 건수, 지역별) ──────────

    public List<KeyCountItem> getVisitorUsage(String startDtm, String endDtm) {
        List<OperatingHist> records = operRepository
                .findOperatingHistByFacilityTypeAndCalcTimeBetween(
                        "line_cross", startDtm + "000000", endDtm + "235959");

        Map<String, Long> countMap = records.stream()
                .filter(h -> h.getCenterArea() != null && h.getCenterArea().length() >= 7)
                .collect(Collectors.groupingBy(
                        h -> h.getCenterArea().substring(0, 7) + "000",
                        Collectors.counting()
                ));

        // loadAreaIdToNameMap(): getVisitorUsage / getSeniorUsageRate 동일 패턴 → 1회 추출
        Map<String, String> areaMap = loadAreaIdToNameMap();
        areaMap.keySet().forEach(code -> countMap.putIfAbsent(code, 0L));

        return areaMap.entrySet().stream()
                .sorted(Map.Entry.comparingByKey())
                .map(entry -> new KeyCountItem(entry.getValue(), countMap.getOrDefault(entry.getKey(), 0L)))
                .collect(Collectors.toList());
    }

    // ── 날짜별 화상회의 개설 건수 (GroupMode 적용) ───────────

    public List<KeyCountItem> getOpenConfUsage(String startDtm, String endDtm) {
        GroupMode mode = StatDateUtil.decideGroupMode(startDtm, endDtm);

        LocalDateTime startDate = StatDateUtil.parseDate(startDtm).atStartOfDay();
        LocalDateTime endDate   = StatDateUtil.parseDate(endDtm).atTime(LocalTime.MAX);

        // 일별 개설 건수
        Map<String, Integer> dailyMap = confSessionRepository
                .findConferenceSessionByCreateDtmBetween(startDate, endDate)
                .stream()
                .collect(Collectors.groupingBy(
                        sess -> sess.getCreateDtm().toLocalDate()
                                .format(java.time.format.DateTimeFormatter.BASIC_ISO_DATE),
                        Collectors.summingInt(sess -> 1)
                ));

        // GroupMode 버킷으로 재집계
        Map<String, Integer> grouped = dailyMap.entrySet().stream()
                .collect(Collectors.groupingBy(
                        entry -> StatDateUtil.makeGroupKey(entry.getKey(), mode),
                        Collectors.summingInt(Map.Entry::getValue)
                ));

        return StatDateUtil.generateAllDateKeys(startDtm, endDtm, mode).stream()
                .map(key -> new KeyCountItem(key, grouped.getOrDefault(key, 0)))
                .collect(Collectors.toList());
    }

    // ── 지역별 화상회의 접속 건수 ────────────────────────────

    public List<KeyCountItem> getConnConfUsage(String startDtm, String endDtm) {
        LocalDateTime startDate = StatDateUtil.parseDate(startDtm).atStartOfDay();
        LocalDateTime endDate   = StatDateUtil.parseDate(endDtm).atTime(LocalTime.MAX);

        Map<String, String> facIdToZoneMap = confSnrCenterRepository.findAll().stream()
                .collect(Collectors.toMap(ConferenceSnrCenter::getId, ConferenceSnrCenter::getSnrZoneNm));

        Map<String, Long> zoneCountMap = new HashMap<>();
        confStatusRepository.findByCreatedTimeIsBetween(startDate, endDate).stream()
                .filter(r -> facIdToZoneMap.containsKey(r.getFacilityId()))
                .collect(Collectors.groupingBy(
                        r -> facIdToZoneMap.get(r.getFacilityId()),
                        Collectors.counting()
                ))
                .forEach(zoneCountMap::put);

        // activeAreaNames(): 동일 필터 패턴(설천면·남면 제외) getContentAreaUsage 와 중복 → 헬퍼
        activeAreaNames().forEach(nm -> zoneCountMap.putIfAbsent(nm, 0L));

        return zoneCountMap.entrySet().stream()
                .sorted(Map.Entry.<String, Long>comparingByValue().reversed())
                .map(entry -> new KeyCountItem(entry.getKey(), entry.getValue()))
                .collect(Collectors.toList());
    }

    // ── 콘텐츠 유형별 건수 ───────────────────────────────────

    public List<KeyCountItem> getContentUsage(String startDtm, String endDtm) {
        long vmsCount = vmsRepository.findVmsContents(startDtm + "000000", endDtm + "235959").size();
        return Arrays.asList(
                new KeyCountItem("긴급 공지",   getScheOverlapCnt(ApiConstants.CONTENT_TYPE.EMERGENCY, startDtm, endDtm)),
                new KeyCountItem("일반 공지",   getScheOverlapCnt(ApiConstants.CONTENT_TYPE.NORMAL,    startDtm, endDtm)),
                new KeyCountItem("콘텐츠 정보", getVideoScheCnt(startDtm, endDtm)),
                new KeyCountItem("전광판",      vmsCount)
        );
    }

    // ── 지역별 콘텐츠 제공 건수 ──────────────────────────────

    public List<KeyCountItem> getContentAreaUsage(String startDtm, String endDtm) {
        Map<String, String> scMapToArea = facRepository.findByFacClfyId(ApiConstants.FAC_SC_CENTER)
                .stream().collect(Collectors.toMap(ErfFacInfo::getMgtNo, ErfFacInfo::getArea));

        Map<String, String> areaIdToName = areaRepository.findAll().stream()
                .collect(Collectors.toMap(TblAreaInfo::getAreaId, TblAreaInfo::getAreaName));

        // 날짜 overlap 필터 (sc.startDtm <= endDtm && sc.endDtm >= startDtm)
        Map<String, Long> scCountMap = scheRepository.findAll().stream()
                .filter(sc -> sc.getStartDtm() != null && sc.getEndDtm() != null
                        && sc.getStartDtm().compareTo(endDtm) <= 0
                        && sc.getEndDtm().compareTo(startDtm) >= 0)
                .filter(sc -> sc.getContentArea() != null && !sc.getContentArea().isEmpty())
                .flatMap(sc -> Arrays.stream(sc.getContentArea().replace("\"", "").split(",")))
                .map(String::trim)
                .filter(a -> !a.isEmpty())
                .collect(Collectors.groupingBy(a -> a, Collectors.counting()));

        // scMgtNo → 지역명 매핑
        Map<String, Long> areaCountMap = new HashMap<>();
        scCountMap.forEach((mgtNo, count) -> {
            String areaCd = scMapToArea.get(mgtNo);
            if (areaCd != null) {
                String areaNm = areaIdToName.get(areaCd.substring(0, 7) + "000");
                if (areaNm != null) areaCountMap.merge(areaNm, count, Long::sum);
            }
        });

        long vmsCount = vmsRepository.findVmsContents(startDtm + "000000", endDtm + "235959").size();

        // activeAreaNames(): 동일 필터 패턴(설천면·남면 제외) getConnConfUsage 와 중복 → 헬퍼
        activeAreaNames().forEach(nm -> areaCountMap.putIfAbsent(nm, 0L));

        return areaCountMap.entrySet().stream()
                .map(entry -> new KeyCountItem(entry.getKey(), entry.getValue() + vmsCount))
                .collect(Collectors.toList());
    }

    // ── 경로당 이용률 (지역별 평균 가동률) ───────────────────

    public List<KeyCountItem> getSeniorUsageRate(String startDtm, String endDtm) {
        List<OperatingHist> records = operRepository
                .findOperatingHistByFacilityTypeAndCalcTimeBetween(
                        "line_cross", startDtm + "000000", endDtm + "235959");

        Map<String, Double> rateMap = records.stream()
                .filter(h -> h.getFacilityOperatingRate() != null
                        && !h.getFacilityOperatingRate().isEmpty()
                        && h.getCenterArea() != null
                        && h.getCenterArea().length() >= 7)
                .collect(Collectors.groupingBy(
                        h -> h.getCenterArea().substring(0, 7) + "000",
                        Collectors.averagingDouble(h -> Double.parseDouble(h.getFacilityOperatingRate()))
                ));

        // loadAreaIdToNameMap(): getVisitorUsage / getSeniorUsageRate 동일 패턴 → 1회 추출
        Map<String, String> areaMap = loadAreaIdToNameMap();
        areaMap.keySet().forEach(code -> rateMap.putIfAbsent(code, 0.0));

        return areaMap.entrySet().stream()
                .sorted(Map.Entry.comparingByKey())
                .map(entry -> new KeyCountItem(
                        entry.getValue(),
                        (long) Math.floor(rateMap.getOrDefault(entry.getKey(), 0.0))
                ))
                .collect(Collectors.toList());
    }

    // ── private 헬퍼 ────────────────────────────────────────

    /**
     * 유효 지역명 목록 — substring(7,10)=="000" 조건 충족, 설천면·남면 제외
     * getConnConfUsage / getContentAreaUsage 에서 동일 패턴으로 중복 → 1벌로 통합
     */
    private List<String> activeAreaNames() {
        return areaRepository.findAll().stream()
                .filter(a -> a.getAreaId().substring(7, 10).equals("000"))
                .map(TblAreaInfo::getAreaName)
                .filter(nm -> !EXCLUDED_AREAS.contains(nm))
                .collect(Collectors.toList());
    }

    /**
     * areaId → areaName 맵 — substring(7,10)=="000" 조건 충족 지역만 포함
     * getVisitorUsage / getSeniorUsageRate 에서 완전 동일한 패턴으로 중복 → 1벌로 통합
     */
    private Map<String, String> loadAreaIdToNameMap() {
        return areaRepository.findAll().stream()
                .filter(a -> a.getAreaId().substring(7, 10).equals("000"))
                .collect(Collectors.toMap(TblAreaInfo::getAreaId, TblAreaInfo::getAreaName));
    }

    private int getScheOverlapCnt(String contentType, String startDtm, String endDtm) {
        return (int) scheRepository.findByContentType(contentType).stream()
                .filter(sc -> sc.getStartDtm() != null && sc.getEndDtm() != null
                        && sc.getStartDtm().compareTo(endDtm) <= 0
                        && sc.getEndDtm().compareTo(startDtm) >= 0)
                .count();
    }

    private int getVideoScheCnt(String startDtm, String endDtm) {
        return getScheOverlapCnt(ApiConstants.CONTENT_TYPE.VIDEO, startDtm, endDtm);
    }
}
