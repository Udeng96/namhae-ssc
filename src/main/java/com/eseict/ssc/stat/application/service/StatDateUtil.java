package com.eseict.ssc.stat.application.service;

import com.eseict.ssc.stat.application.dto.CountResult;
import com.eseict.ssc.stat.application.dto.DateResult;
import com.eseict.ssc.monitoring.domain.entity.IocUcityZnInfo;
import com.eseict.ssc.stat.domain.vo.GroupMode;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.Period;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.time.temporal.TemporalAdjusters;
import java.util.*;
import java.util.stream.Collectors;

/**
 * 날짜 그룹핑 유틸 — 4개 통계 서비스에서 공용으로 사용하는 static 유틸
 *
 * 기존: StatUtil @Component (parseDate 포함), 각 서비스에 4벌 중복된
 *       decideGroupMode / makeGroupKey / generateAllDateKeys / toMonthWeekKey
 * 개선:
 *   - @Component 의존 제거 → static 메서드로 통합
 *   - makeGroupKey: DAY 특수 케이스 제거 — 8자리 yyyyMMdd를 직접 파싱하여 모든 GroupMode 통일 처리
 *   - 4벌 중복 → 단일 클래스 1벌로 통합
 *   - buildCountResult / buildSubCountResult / buildDateResults:
 *     EventStatService·FacStatService 에서 동일 패턴으로 중복된
 *     "지역별 건수 집계 + 빈 지역 0 채우기" 와 "날짜×코드 집계 + 빈 날짜 0 채우기" 로직 통합
 *     computeIfAbsent 으로 putIfAbsent+get 이중 맵 조회 제거
 */
public final class StatDateUtil {

    private static final DateTimeFormatter FMT_YMD = DateTimeFormatter.ofPattern("yyyyMMdd");

    private StatDateUtil() { /* 인스턴스 생성 불가 */ }

    // ── parseDate ──────────────────────────────────────────────────────────────
    // 기존 StatUtil.parseDate() 대체 — yyyyMMdd / yyyyMM / yyyy 길이별 보정

    public static LocalDate parseDate(String dt) {
        if (dt == null) return LocalDate.now();
        if (dt.length() == 6) return LocalDate.parse(dt + "01", FMT_YMD);
        if (dt.length() == 4) return LocalDate.parse(dt + "0101", FMT_YMD);
        return LocalDate.parse(dt, FMT_YMD);
    }

    // ── decideGroupMode ────────────────────────────────────────────────────────
    // 기존: 4개 서비스 각자 private decideGroupMode() → 1벌로 통합

    public static GroupMode decideGroupMode(String startDtm, String endDtm) {
        LocalDate s = parseDate(startDtm);
        LocalDate e = parseDate(endDtm);
        Period p = Period.between(s, e);
        if (p.getYears() >= 1)  return GroupMode.YEAR;
        if (p.getMonths() >= 1) return GroupMode.MONTH;
        if (p.getDays() > 7)    return GroupMode.WEEK;
        return GroupMode.DAY;
    }

    // ── makeGroupKey ───────────────────────────────────────────────────────────
    // 입력: yyyyMMdd (8자리) — SQL dayKey 또는 BASIC_ISO_DATE 포맷 모두 허용
    // 기존: EventStatService / FacStatService / OperStatService 에서 DAY 케이스만 특수 처리 후
    //       나머지는 makeGroupKey(dayKey + "000000000", mode) 로 17자리 전달하던 방식 제거
    //       → 8자리 직접 파싱으로 통일

    public static String makeGroupKey(String ymd8, GroupMode mode) {
        if (ymd8 == null || ymd8.length() < 8) return null;
        try {
            int y = Integer.parseInt(ymd8.substring(0, 4));
            int m = Integer.parseInt(ymd8.substring(4, 6));
            int d = Integer.parseInt(ymd8.substring(6, 8));
            switch (mode) {
                case DAY:   return String.format("%04d/%02d/%02d", y, m, d);
                case WEEK:  return toMonthWeekKey(LocalDate.of(y, m, d));
                case MONTH: return String.format("%04d년 %02d월", y, m);
                case YEAR:  return y + "년";
                default:    return null;
            }
        } catch (Exception ex) {
            return null;
        }
    }

    // ── generateAllDateKeys ────────────────────────────────────────────────────
    // GroupMode 별 전체 날짜 키 목록 생성 (빈 버킷 채우기용)

    public static List<String> generateAllDateKeys(String startDtm, String endDtm, GroupMode mode) {
        List<String> keys = new ArrayList<>();
        LocalDate start = parseDate(startDtm);
        LocalDate end   = parseDate(endDtm);

        switch (mode) {
            case DAY:
                for (LocalDate d = start; !d.isAfter(end); d = d.plusDays(1)) {
                    keys.add(String.format("%04d/%02d/%02d", d.getYear(), d.getMonthValue(), d.getDayOfMonth()));
                }
                break;
            case WEEK:
                Set<String> weekKeys = new LinkedHashSet<>();
                for (LocalDate d = start; !d.isAfter(end); d = d.plusDays(1)) {
                    String key = toMonthWeekKey(d);
                    if (key != null) weekKeys.add(key);
                }
                keys.addAll(weekKeys);
                break;
            case MONTH:
                for (LocalDate d = start.withDayOfMonth(1); !d.isAfter(end); d = d.plusMonths(1)) {
                    keys.add(String.format("%04d년 %02d월", d.getYear(), d.getMonthValue()));
                }
                break;
            case YEAR:
                for (int y = start.getYear(); y <= end.getYear(); y++) {
                    keys.add(y + "년");
                }
                break;
        }
        return keys;
    }

    // ── toMonthWeekKey ─────────────────────────────────────────────────────────
    // "MM월 N주" 포맷 — 해당 월 첫 월요일 이전이면 null (주 경계 밖)

    public static String toMonthWeekKey(LocalDate date) {
        LocalDate firstDayOfMonth = date.withDayOfMonth(1);
        LocalDate firstMonday = firstDayOfMonth.getDayOfWeek() == DayOfWeek.MONDAY
                ? firstDayOfMonth
                : firstDayOfMonth.with(TemporalAdjusters.next(DayOfWeek.MONDAY));
        if (date.isBefore(firstMonday)) return null;
        int week = (int) ChronoUnit.WEEKS.between(firstMonday, date) + 1;
        return String.format("%02d월 %d주", date.getMonthValue(), week);
    }

    // ── 집계 결과 빌더 (EventStatService·FacStatService 공용) ─────────────────

    /**
     * 전체 조회 지역별 건수 결과 — Object[]{znCd, count} → CountResult 목록
     * 결과에 없는 znCd 는 count=0 으로 채워 znList 전체를 보장함
     *
     * 기존: EventStatService.getCountEvents / FacStatService.getCountEvents 에
     *       동일한 22줄 로직이 각각 중복 → 이 메서드 1벌로 통합
     */
    public static List<CountResult> buildCountResult(
            List<Object[]> rows,
            Map<String, String> znCdToNmMap,
            List<IocUcityZnInfo> znList) {
        List<CountResult> result = new ArrayList<>();
        for (Object[] row : rows) {
            String znCd = (String) row[0];
            result.add(new CountResult(znCd, znCdToNmMap.getOrDefault(znCd, znCd), ((Number) row[1]).intValue()));
        }
        Set<String> existing = result.stream().map(CountResult::getAreaCd).collect(Collectors.toSet());
        for (IocUcityZnInfo zn : znList) {
            if (!existing.contains(zn.getZnCd())) {
                result.add(new CountResult(zn.getZnCd(), zn.getZnNm(), 0));
            }
        }
        return result;
    }

    /**
     * 지역 필터 조회 결과 — Object[]{subCd, subNm, count} → CountResult 목록
     *
     * 기존: EventStatService / FacStatService 의 areaCd 분기 else 블록 동일 패턴 → 통합
     */
    public static List<CountResult> buildSubCountResult(List<Object[]> rows) {
        List<CountResult> result = new ArrayList<>();
        for (Object[] row : rows) {
            result.add(new CountResult((String) row[0], (String) row[1], ((Number) row[2]).intValue()));
        }
        return result;
    }

    /**
     * 날짜×코드별 집계: Object[]{dayKey, statCd, count} → DateResult 목록
     * - GroupMode 에 따라 dayKey(yyyyMMdd) → 그룹 키 변환
     * - generateAllDateKeys 로 빈 날짜 버킷을 0 으로 채움
     * - computeIfAbsent 사용 → putIfAbsent+get 이중 맵 조회 제거
     *
     * 기존: EventStatService.getDateEvents / FacStatService.getDateEvents 에
     *       동일한 19줄 로직이 각각 중복 → 이 메서드 1벌로 통합
     */
    public static List<DateResult> buildDateResults(
            List<Object[]> rows,
            GroupMode mode,
            List<String> allCodes,
            String startDtm,
            String endDtm) {
        Map<String, Map<String, Integer>> countMap = new LinkedHashMap<>();
        for (Object[] row : rows) {
            String finalKey = makeGroupKey((String) row[0], mode);
            if (finalKey == null) continue;
            countMap.computeIfAbsent(finalKey, k -> new HashMap<>())
                    .merge((String) row[1], ((Number) row[2]).intValue(), Integer::sum);
        }
        List<DateResult> result = new ArrayList<>();
        for (String dateKey : generateAllDateKeys(startDtm, endDtm, mode)) {
            Map<String, Integer> statMap = countMap.getOrDefault(dateKey, Collections.emptyMap());
            Map<String, Integer> filled = new LinkedHashMap<>();
            for (String code : allCodes) {
                filled.put(code, statMap.getOrDefault(code, 0));
            }
            result.add(new DateResult(dateKey, filled));
        }
        return result;
    }
}
