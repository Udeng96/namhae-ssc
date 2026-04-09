package com.eseict.ssc.stat.application.service;

import com.eseict.ssc.config.ApiConstants;
import com.eseict.ssc.stat.application.dto.CountResult;
import com.eseict.ssc.stat.application.dto.DateResult;
import com.eseict.ssc.stat.application.dto.ScResult;
import com.eseict.ssc.stat.application.dto.BellResult;
import com.eseict.ssc.stat.application.dto.EventStatResult;
import com.eseict.ssc.facility.domain.entity.ErfFacInfo;
import com.eseict.ssc.monitoring.domain.entity.IocStatEvetOutbHist;
import com.eseict.ssc.monitoring.domain.entity.IocUcityZnInfo;
import com.eseict.ssc.stat.domain.vo.GroupMode;
import com.eseict.ssc.repository.event.EventRepository;
import com.eseict.ssc.repository.event.EventZnInfoRepository;
import com.eseict.ssc.repository.fac.FacRepository;
import com.google.common.base.Strings;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;
import java.util.*;
import java.util.stream.Collectors;

/**
 * EventStatService (refac) — 이벤트 통계
 *
 * 기존(service/newStat/EventStatService):
 *   - FacService 의존 (getAllScList → 내부적으로 facRepository 호출)
 *   - StatUtil @Component 의존 (parseDate)
 *   - nested enum GroupMode 4벌 중복
 *   - decideGroupMode / makeGroupKey / generateAllDateKeys / toMonthWeekKey 4벌 중복
 *   - DAY 모드 특수 처리 분기 (makeGroupKey 와 중복 로직)
 *   - 비상벨 getBellEvents: areaCd 있을 때 area 변환 버그
 *   - getCountEvents: 22줄 지역별 집계 + 빈 지역 채우기 로직 직접 구현
 *   - getDateEvents: 19줄 날짜×코드 집계 + 빈 날짜 채우기 로직 직접 구현
 *     (FacStatService 와 완전 동일한 중복 코드)
 *   - putIfAbsent(k, new HashMap<>()).get(k) 이중 맵 조회
 * 개선:
 *   - FacService 제거 → FacRepository 직접 사용 (findByFacClfyId)
 *   - StatUtil 제거 → StatDateUtil.parseDate() (static)
 *   - GroupMode → refac/stat/domain/vo/GroupMode
 *   - 날짜 유틸 4벌 → StatDateUtil.* (static)
 *   - DAY 특수 케이스 제거 → StatDateUtil.makeGroupKey(dayKey, mode) 통일
 *   - 비상벨 버그 수정: scId 키 고정, areaCd 유무에 따라 znCdToNmMap / scIdToNmMap 선택
 *   - getCountEvents: StatDateUtil.buildCountResult / buildSubCountResult 로 22줄→5줄
 *   - getDateEvents:  StatDateUtil.buildDateResults 로 19줄→7줄, computeIfAbsent 적용
 */
@RequiredArgsConstructor
@Service
@Slf4j
public class EventStatService {

    private final EventRepository      eventRepository;
    private final EventZnInfoRepository eventZnInfoRepository;
    private final FacRepository        facRepository;   // FacService 대신 직접 사용

    // ── 캐시 ────────────────────────────────────────────────
    private Map<String, String> scIdToAreaMap;   // scId → area 코드
    private Map<String, String> scIdToNmMap;     // scId → 시설물명 (비상벨 SC별 조회용)
    private List<IocUcityZnInfo> znList;          // 지역 목록 캐시
    private Map<String, String> znCdToNmMap;      // znCd → znNm

    @PostConstruct
    public void init() {
        List<ErfFacInfo> allScList = facRepository.findByFacClfyId(ApiConstants.FAC_SC_CENTER);
        scIdToAreaMap = allScList.stream()
                .collect(Collectors.toMap(ErfFacInfo::getMgtNo, ErfFacInfo::getArea, (a, b) -> a));
        scIdToNmMap = allScList.stream()
                .collect(Collectors.toMap(ErfFacInfo::getMgtNo, ErfFacInfo::getFacNm, (a, b) -> a));
        log.info("[EventStatService] SC 캐시 로딩 완료: {}건", scIdToAreaMap.size());

        znList = eventZnInfoRepository.findAll().stream()
                .filter(z -> !z.getZnCd().equals("400") && z.getZnCd().startsWith("4"))
                .sorted(Comparator.comparing(IocUcityZnInfo::getZnCd))
                .collect(Collectors.toList());
        znCdToNmMap = znList.stream()
                .collect(Collectors.toMap(IocUcityZnInfo::getZnCd, IocUcityZnInfo::getZnNm));
        log.info("[EventStatService] 지역 캐시 로딩 완료: {}건", znList.size());
    }

    // ── 전체 이벤트 통계 ────────────────────────────────────

    public EventStatResult getEventStat(String startDtm, String endDtm, String areaCd) {
        log.info(">>> event stat start");
        long s, e;

        s = System.nanoTime();
        List<CountResult> gisStats = getCountEvents(startDtm, endDtm, areaCd);
        e = System.nanoTime();
        log.info("gisStats time: {}초", (e - s) / 1_000_000_000.0);

        s = System.nanoTime();
        List<DateResult> dateStats = getDateEvents(startDtm, endDtm, areaCd);
        e = System.nanoTime();
        log.info("dateStats time: {}초", (e - s) / 1_000_000_000.0);

        s = System.nanoTime();
        List<BellResult> bellStats = getBellEvents(startDtm, endDtm, areaCd);
        e = System.nanoTime();
        log.info("bellStats time: {}초", (e - s) / 1_000_000_000.0);

        s = System.nanoTime();
        List<ScResult> scStats = getScEvents(startDtm, endDtm, areaCd);
        e = System.nanoTime();
        log.info("scStats time: {}초", (e - s) / 1_000_000_000.0);

        int totalCnt = gisStats.stream().mapToInt(CountResult::getCount).sum();
        return new EventStatResult(totalCnt, gisStats, dateStats, bellStats, scStats);
    }

    // ── 지역별 이벤트 건수 ──────────────────────────────────

    public List<CountResult> getCountEvents(String startDtm, String endDtm, String areaCd) {
        String s = startDtm + "000000000", e = endDtm + "235959999";
        return Strings.isNullOrEmpty(areaCd)
                ? StatDateUtil.buildCountResult(eventRepository.countGroupByZnCd(s, e), znCdToNmMap, znList)
                : StatDateUtil.buildSubCountResult(eventRepository.countByOutbPlacSub(s, e, areaCd));
    }

    // ── 날짜별 × 이벤트타입별 건수 ─────────────────────────

    public List<DateResult> getDateEvents(String startDtm, String endDtm, String areaCd) {
        GroupMode mode = StatDateUtil.decideGroupMode(startDtm, endDtm);
        String s = startDtm + "000000000", e = endDtm + "235959999";
        List<Object[]> rows = Strings.isNullOrEmpty(areaCd)
                ? eventRepository.countByDayAndStat(s, e)
                : eventRepository.countByDayAndStatSub(s, e, areaCd);
        return StatDateUtil.buildDateResults(rows, mode, Arrays.asList("01", "02", "03"), startDtm, endDtm);
    }

    // ── 비상벨(SC)별 이벤트 건수 ───────────────────────────
    // areaCd 없음 → 지역(znCd) 단위 집계, 빈 지역 0으로 채워 znCd 순 정렬
    // areaCd 있음 → SC 단위 반환 (scId, scNm, count)
    //
    // 버그 수정: countBySc JPQL 쿼리는 outbPlac IS NOT NULL 조건이 있어
    //            outbPlac 미설정 비상벨 이벤트가 전체 제외됨 →
    //            outbPlac 필터 없는 QueryDSL findBellCountList/findSubBellCountList 로 교체

    public List<BellResult> getBellEvents(String startDtm, String endDtm, String areaCd) {
        String start = startDtm + "000000000";
        String end   = endDtm   + "235959999";

        // areaCd 있음 → SC 단위 집계 (outbPlac 기준)
        if (!Strings.isNullOrEmpty(areaCd)) {
            return eventRepository.findSubBellCountList(start, end, areaCd);
        }

        // areaCd 없음 → 지역(znCd) 단위 집계
        List<BellResult> fromDB = eventRepository.findBellCountList(start, end);

        // 결과 없는 지역 0으로 채우기
        Set<String> existingIds = fromDB.stream()
                .map(BellResult::getKeyId)
                .collect(Collectors.toSet());
        List<BellResult> result = new ArrayList<>(fromDB);
        for (IocUcityZnInfo zn : znList) {
            if (!existingIds.contains(zn.getZnCd())) {
                result.add(new BellResult(zn.getZnCd(), zn.getZnNm(), 0));
            }
        }
        result.sort(Comparator.comparing(BellResult::getKeyId));
        return result;
    }

    // ── 상위 SC 이벤트 발생 비율 ────────────────────────────

    public List<ScResult> getScEvents(String startDtm, String endDtm, String areaCd) {
        int limit = Strings.isNullOrEmpty(areaCd) ? 10 : 5;
        List<Object[]> rows = Strings.isNullOrEmpty(areaCd)
                ? eventRepository.countTopScWithGlobalPercent(startDtm + "000000000", endDtm + "235959999", limit)
                : eventRepository.countTopScWithGlobalPercentSub(startDtm + "000000000", endDtm + "235959999", limit, areaCd);

        List<ScResult> result = new ArrayList<>();
        for (Object[] row : rows) {
            String scId  = (String) row[0];
            String scNm  = (String) row[1];
            int percent  = ((Number) row[3]).intValue();
            result.add(new ScResult(scId, scNm, percent));
        }
        return result;
    }

    // ── 상황별 지역 이벤트 건수 Map (HomeRoot 위젯용) ───────

    public Map<String, Integer> getSituationEventList(String startDtm, String endDtm) {
        List<IocStatEvetOutbHist> events = eventRepository
                .findAllByOutbDtmBetweenAndSvcThemeCdAndUnitSvcCdAndZnCdIsNot(
                        startDtm + "000000000", endDtm + "235959999", "SSC", "001", "503");

        return events.stream()
                .filter(ev -> ev.getOutbPlac() != null
                        && !ev.getOutbPlac().isEmpty()
                        && ev.getOutbPlac().contains("_")
                        && !"04".equals(ev.getStatEvetCd())
                        && !"05".equals(ev.getStatEvetCd()))
                .collect(Collectors.groupingBy(
                        IocStatEvetOutbHist::getZnCd,
                        Collectors.collectingAndThen(Collectors.counting(), Long::intValue)
                ));
    }

    public String transferScIdToArea(String scId) {
        return scIdToAreaMap.getOrDefault(scId, "");
    }
}
