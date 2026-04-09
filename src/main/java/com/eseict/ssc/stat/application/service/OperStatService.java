package com.eseict.ssc.stat.application.service;

import com.eseict.ssc.stat.application.dto.CountResult;
import com.eseict.ssc.stat.application.dto.DateResult;
import com.eseict.ssc.stat.application.dto.FacTypeResult;
import com.eseict.ssc.stat.application.dto.OperStatResult;
import com.eseict.ssc.stat.application.dto.TimeResult;
import com.eseict.ssc.stat.domain.vo.GroupMode;
import com.eseict.ssc.repository.scm.OperRepository;
import com.google.common.base.Strings;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.*;

/**
 * OperStatService (refac) — 가동률 통계
 *
 * 기존(service/newStat/OperStatService):
 *   - StatUtil @Component 의존 (parseDate)
 *   - nested enum GroupMode 4벌 중복
 *   - decideGroupMode / makeGroupKey / generateAllDateKeys / toMonthWeekKey 4벌 중복
 *   - DAY 모드 특수 처리 분기
 * 개선:
 *   - StatUtil 제거 → StatDateUtil.* (static)
 *   - GroupMode → refac/stat/domain/vo/GroupMode
 *   - DAY 특수 케이스 제거 → StatDateUtil.makeGroupKey(dayKey, mode) 통일
 */
@Service
@Slf4j
@RequiredArgsConstructor
public class OperStatService {

    private final OperRepository operRepository;

    // ── 가동률 전체 통계 ────────────────────────────────────

    public OperStatResult getOperStat(String startDtm, String endDtm, String areaCd) {
        log.info(">>> oper stat start");
        long s, e;

        s = System.nanoTime();
        List<CountResult> gisStats = getCountOper(startDtm, endDtm, areaCd);
        e = System.nanoTime();
        log.info("oper gisStats time: {}초", (e - s) / 1_000_000_000.0);

        s = System.nanoTime();
        List<DateResult> dateStats = getDateOper(startDtm, endDtm, areaCd);
        e = System.nanoTime();
        log.info("oper dateStats time: {}초", (e - s) / 1_000_000_000.0);

        s = System.nanoTime();
        List<FacTypeResult> facTypeStats = getFacTypeOper(startDtm, endDtm, areaCd);
        e = System.nanoTime();
        log.info("oper facTypeStats time: {}초", (e - s) / 1_000_000_000.0);

        s = System.nanoTime();
        List<TimeResult> timeStats = getScOper(startDtm, endDtm, areaCd);
        e = System.nanoTime();
        log.info("oper timeStats time: {}초", (e - s) / 1_000_000_000.0);

        return new OperStatResult(gisStats, dateStats, facTypeStats, timeStats);
    }

    // ── 지역별 평균 가동률 ───────────────────────────────────

    public List<CountResult> getCountOper(String startDtm, String endDtm, String areaCd) {
        String s = startDtm + "000000000";
        String e = endDtm   + "235959999";
        return Strings.isNullOrEmpty(areaCd)
                ? operRepository.findOperCountList(s, e)
                : operRepository.findSubOperCountList(s, e, areaCd);
    }

    // ── 날짜별 평균 가동률 ───────────────────────────────────

    public List<DateResult> getDateOper(String startDtm, String endDtm, String areaCd) {
        GroupMode mode = StatDateUtil.decideGroupMode(startDtm, endDtm);
        String s = startDtm + "000000000";
        String e = endDtm   + "235959999";

        List<Object[]> rows = Strings.isNullOrEmpty(areaCd)
                ? operRepository.findOperDayAvg(s, e)
                : operRepository.findSubOperDayAvg(s, e, areaCd);

        // 버킷별 [sum, count] 누적 후 평균 재계산
        Map<String, long[]> accumMap = new LinkedHashMap<>();
        for (Object[] row : rows) {
            String dayKey = (String) row[0];
            int avgRate   = ((Number) row[1]).intValue();

            String finalKey = StatDateUtil.makeGroupKey(dayKey, mode);
            if (finalKey == null) continue;

            long[] acc = accumMap.computeIfAbsent(finalKey, k -> new long[]{0, 0});
            acc[0] += avgRate;
            acc[1]++;
        }

        Map<String, Integer> countMap = new LinkedHashMap<>();
        for (Map.Entry<String, long[]> entry : accumMap.entrySet()) {
            countMap.put(entry.getKey(), (int) (entry.getValue()[0] / entry.getValue()[1]));
        }

        List<DateResult> result = new ArrayList<>();
        for (String dateKey : StatDateUtil.generateAllDateKeys(startDtm, endDtm, mode)) {
            Map<String, Integer> filled = new LinkedHashMap<>();
            filled.put("가동률", countMap.getOrDefault(dateKey, 0));
            result.add(new DateResult(dateKey, filled));
        }
        return result;
    }

    // ── 시설물 유형별 평균 가동률 ────────────────────────────

    public List<FacTypeResult> getFacTypeOper(String startDtm, String endDtm, String areaCd) {
        String s = startDtm + "000000000";
        String e = endDtm   + "235959999";
        return Strings.isNullOrEmpty(areaCd)
                ? operRepository.findOperFacList(s, e)
                : operRepository.findSubOperFacList(s, e, areaCd);
    }

    // ── 지역별 평균 가동 시간 ────────────────────────────────

    public List<TimeResult> getScOper(String startDtm, String endDtm, String areaCd) {
        String s = startDtm + "000000000";
        String e = endDtm   + "235959999";
        return Strings.isNullOrEmpty(areaCd)
                ? operRepository.findOperScList(s, e)
                : operRepository.findSubOperScList(s, e, areaCd);
    }
}
