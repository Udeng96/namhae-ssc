package com.eseict.ssc.stat.application.service;

import com.eseict.ssc.stat.application.dto.CountResult;
import com.eseict.ssc.stat.application.dto.DateResult;
import com.eseict.ssc.stat.application.dto.ScResult;
import com.eseict.ssc.stat.application.dto.FacStatResult;
import com.eseict.ssc.stat.application.dto.FacTypeResult;
import com.eseict.ssc.monitoring.domain.entity.IocStatEvetInfo;
import com.eseict.ssc.monitoring.domain.entity.IocUcityZnInfo;
import com.eseict.ssc.stat.domain.vo.GroupMode;
import com.eseict.ssc.repository.event.EventInfoRepository;
import com.eseict.ssc.repository.event.EventRepository;
import com.eseict.ssc.repository.event.EventZnInfoRepository;
import com.google.common.base.Strings;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;
import java.util.*;
import java.util.stream.Collectors;

/**
 * FacStatService (refac) — 시설물 고장 통계
 *
 * 기존(service/newStat/FacStatService):
 *   - StatUtil @Component 의존 (parseDate)
 *   - nested enum GroupMode 4벌 중복
 *   - decideGroupMode / makeGroupKey / generateAllDateKeys / toMonthWeekKey 4벌 중복
 *   - DAY 모드 특수 처리 분기
 *   - getCountEvents: 22줄 집계 + 빈 지역 채우기 로직 직접 구현
 *     (EventStatService 와 완전 동일한 중복 코드)
 *   - getDateEvents: 19줄 날짜×코드 집계 직접 구현
 *     (EventStatService 와 완전 동일한 중복 코드)
 *   - putIfAbsent(k, new HashMap<>()).get(k) 이중 맵 조회
 * 개선:
 *   - StatUtil 제거 → StatDateUtil.* (static)
 *   - GroupMode → refac/stat/domain/vo/GroupMode
 *   - DAY 특수 케이스 제거 → StatDateUtil.makeGroupKey(dayKey, mode) 통일
 *   - getCountEvents: StatDateUtil.buildCountResult / buildSubCountResult 로 22줄→5줄
 *   - getDateEvents:  StatDateUtil.buildDateResults 로 19줄→7줄, computeIfAbsent 적용
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class FacStatService {

    private final EventRepository      eventRepository;
    private final EventZnInfoRepository eventZnInfoRepository;
    private final EventInfoRepository  eventInfoRepository;

    // ── 캐시 ────────────────────────────────────────────────
    private List<IocUcityZnInfo> znList;
    private Map<String, String>  znCdToNmMap;
    private Map<String, String>  facStatCdToNmMap;  // statEvetCd → 이름 ("센서" 우선)

    @PostConstruct
    public void init() {
        znList = eventZnInfoRepository.findAll().stream()
                .filter(z -> !z.getZnCd().equals("400") && z.getZnCd().startsWith("4"))
                .sorted(Comparator.comparing(IocUcityZnInfo::getZnCd))
                .collect(Collectors.toList());
        znCdToNmMap = znList.stream()
                .collect(Collectors.toMap(IocUcityZnInfo::getZnCd, IocUcityZnInfo::getZnNm));

        // statEvetCd별 이름: "센서"가 포함된 이름 우선, 없으면 기존 이름 유지
        facStatCdToNmMap = eventInfoRepository.findBySvcThemeCdAndUnitSvcCd("SSC", "002").stream()
                .collect(Collectors.toMap(
                        IocStatEvetInfo::getStatEvetCd,
                        IocStatEvetInfo::getStatEvetNm,
                        (existing, newVal) -> newVal.contains("센서") ? newVal : existing
                ));

        log.info("[FacStatService] 캐시 로딩 완료: znList={}건, facStatCd={}건",
                znList.size(), facStatCdToNmMap.size());
    }

    // ── 시설물 고장 전체 통계 ────────────────────────────────

    public FacStatResult getFacStat(String startDtm, String endDtm, String areaCd) {
        log.info(">>> fac stat start");
        long s, e;

        s = System.nanoTime();
        List<CountResult> gisStats = getCountEvents(startDtm, endDtm, areaCd);
        e = System.nanoTime();
        log.info("fac gisStats time: {}초", (e - s) / 1_000_000_000.0);

        s = System.nanoTime();
        List<DateResult> dateStats = getDateEvents(startDtm, endDtm, areaCd);
        e = System.nanoTime();
        log.info("fac dateStats time: {}초", (e - s) / 1_000_000_000.0);

        s = System.nanoTime();
        List<FacTypeResult> facTypeStats = getFacEvents(startDtm, endDtm, areaCd);
        e = System.nanoTime();
        log.info("fac facTypeStats time: {}초", (e - s) / 1_000_000_000.0);

        s = System.nanoTime();
        List<ScResult> scStats = getScEvents(startDtm, endDtm, areaCd);
        e = System.nanoTime();
        log.info("fac scStats time: {}초", (e - s) / 1_000_000_000.0);

        int totalCnt = gisStats.stream().mapToInt(CountResult::getCount).sum();
        return new FacStatResult(totalCnt, gisStats, dateStats, facTypeStats, scStats);
    }

    // ── 지역별 시설물 고장 건수 ──────────────────────────────

    public List<CountResult> getCountEvents(String startDtm, String endDtm, String areaCd) {
        String s = startDtm + "000000000", e = endDtm + "235959999";
        return Strings.isNullOrEmpty(areaCd)
                ? StatDateUtil.buildCountResult(eventRepository.countFacByZnCd(s, e), znCdToNmMap, znList)
                : StatDateUtil.buildSubCountResult(eventRepository.countFacByOutbPlacSub(s, e, areaCd));
    }

    // ── 날짜별 × 고장타입별 건수 ────────────────────────────

    public List<DateResult> getDateEvents(String startDtm, String endDtm, String areaCd) {
        GroupMode mode = StatDateUtil.decideGroupMode(startDtm, endDtm);
        String s = startDtm + "000000000", e = endDtm + "235959999";
        List<Object[]> rows = Strings.isNullOrEmpty(areaCd)
                ? eventRepository.countFacByDay(s, e)
                : eventRepository.countFacByDaySub(s, e, areaCd);
        return StatDateUtil.buildDateResults(rows, mode, Arrays.asList("01", "02", "03", "04", "05"), startDtm, endDtm);
    }

    // ── 고장 유형(statEvetCd)별 건수 ────────────────────────

    public List<FacTypeResult> getFacEvents(String startDtm, String endDtm, String areaCd) {
        List<Object[]> rows = Strings.isNullOrEmpty(areaCd)
                ? eventRepository.countFacByStat(startDtm + "000000000", endDtm + "235959999")
                : eventRepository.countFacByStatSub(startDtm + "000000000", endDtm + "235959999", areaCd);

        List<FacTypeResult> result = new ArrayList<>();
        for (Object[] row : rows) {
            String statCd = (String) row[0];
            String statNm = facStatCdToNmMap.getOrDefault(statCd, statCd);
            int count = ((Number) row[1]).intValue();
            result.add(new FacTypeResult(statCd, statNm, count));
        }
        return result;
    }

    // ── 상위 SC 고장 발생 비율 ───────────────────────────────

    public List<ScResult> getScEvents(String startDtm, String endDtm, String areaCd) {
        int limit = Strings.isNullOrEmpty(areaCd) ? 10 : 5;
        List<Object[]> rows = Strings.isNullOrEmpty(areaCd)
                ? eventRepository.countFacSc(startDtm + "000000000", endDtm + "235959999", limit)
                : eventRepository.countFacScSub(startDtm + "000000000", endDtm + "235959999", areaCd, limit);

        List<ScResult> result = new ArrayList<>();
        for (Object[] row : rows) {
            String scId  = (String) row[0];
            String scNm  = (String) row[1];
            int percent  = ((Number) row[3]).intValue();
            result.add(new ScResult(scId, scNm, percent));
        }
        return result;
    }
}
