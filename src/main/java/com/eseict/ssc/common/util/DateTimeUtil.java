package com.eseict.ssc.common.util;

import com.eseict.ssc.config.ApiConstants;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;

/**
 * DateTimeUtil — 날짜/시간 포맷 공용 static 유틸
 *
 * 기존(service/newCommon/CommonUtil):
 *   - @Component 인스턴스 메서드 → 8개 서비스에서 각각 의존성 주입
 *   - Spring Bean 로딩 순서에 묶임
 *   - java.time 만 사용하는 순수 유틸인데도 DI 필요
 * 개선:
 *   - static 메서드로 변환 → @Component 제거, 직접 클래스 호출
 *   - 각 서비스에서 private final CommonUtil commonUtil 필드 제거
 *   - DateTimeUtil.method() 로 직접 사용
 */
public final class DateTimeUtil {

    private DateTimeUtil() { /* 인스턴스 생성 불가 */ }

    // ── 현재 시각 조회 ─────────────────────────────────────────

    /** 현재 datetime → yyyyMMddHHmmss (FORMAT_14) */
    public static String getNowLocalDateTime() {
        return LocalDateTime.now().format(DateTimeFormatter.ofPattern(ApiConstants.DATE.FORMAT_14));
    }

    /** 현재 date → yyyyMMdd (FORMAT_8) */
    public static String getNowLocalDateTimeFormat8() {
        return LocalDate.now().format(DateTimeFormatter.ofPattern(ApiConstants.DATE.FORMAT_8));
    }

    /**
     * 현재 시각을 지정 포맷으로 반환
     * - 시간 포함 포맷(H/m/s): 날짜+시간 → LocalDateTime, 시간만 → LocalTime
     * - 날짜만 포맷: LocalDate
     */
    public static String getNowLocalDateTimeFreeFormat(String format) {
        if (format.contains("H") || format.contains("m") || format.contains("s")) {
            if (format.contains("y") || format.contains("M") || format.contains("d")) {
                return LocalDateTime.now().format(DateTimeFormatter.ofPattern(format));
            } else {
                return LocalTime.now().format(DateTimeFormatter.ofPattern(format));
            }
        }
        return LocalDate.now().format(DateTimeFormatter.ofPattern(format));
    }

    // ── 특정 날짜 변환 ─────────────────────────────────────────

    /** yyyyMMddHHmmss 문자열 → FORMAT_14 포맷 문자열 */
    public static String getDtmLocalDateTime(String dtm) {
        return LocalDateTime.parse(dtm, DateTimeFormatter.ofPattern(ApiConstants.DATE.FORMAT_14))
                .format(DateTimeFormatter.ofPattern(ApiConstants.DATE.FORMAT_14));
    }

    /** yyyyMMddHHmmss 문자열 → FORMAT_17 포맷 문자열 */
    public static String getDtmLocalDateTimeFormat17(String dtm) {
        return LocalDateTime.parse(dtm, DateTimeFormatter.ofPattern(ApiConstants.DATE.FORMAT_14))
                .format(DateTimeFormatter.ofPattern(ApiConstants.DATE.FORMAT_17));
    }

    /** LocalDateTime → FORMAT_17 문자열 */
    public static String getStrDateFormat17(LocalDateTime dateTime) {
        return dateTime.format(DateTimeFormatter.ofPattern(ApiConstants.DATE.FORMAT_17));
    }

    /** LocalDateTime → FORMAT_14 문자열 */
    public static String getStrDateFormat14(LocalDateTime dateTime) {
        return dateTime.format(DateTimeFormatter.ofPattern(ApiConstants.DATE.FORMAT_14));
    }

    /** LocalDate → FORMAT_8 문자열 */
    public static String getStrDateFormat8(LocalDate date) {
        return date.format(DateTimeFormatter.ofPattern(ApiConstants.DATE.FORMAT_8));
    }

    // ── 날짜 연산 ──────────────────────────────────────────────

    /**
     * dtm 에서 amount 만큼 날짜 빼기
     * type: "date"(일), "month"(월), "year"(연)
     * dtm 8자리(yyyyMMdd) 또는 14자리(yyyyMMddHHmmss) 모두 지원
     */
    public static String getMinusDate(int amount, String dtm, String type) {
        if (dtm != null && dtm.length() == 8) {
            LocalDate d = LocalDate.parse(dtm, DateTimeFormatter.ofPattern(ApiConstants.DATE.FORMAT_8));
            LocalDate result = "date".equals(type)  ? d.minusDays(amount)
                             : "month".equals(type) ? d.minusMonths(amount)
                             :                        d.minusYears(amount);
            return result.format(DateTimeFormatter.ofPattern(ApiConstants.DATE.FORMAT_8));
        }
        LocalDateTime dt = LocalDateTime.parse(dtm, DateTimeFormatter.ofPattern(ApiConstants.DATE.FORMAT_14));
        LocalDateTime result = "date".equals(type)  ? dt.minusDays(amount)
                             : "month".equals(type) ? dt.minusMonths(amount)
                             :                        dt.minusYears(amount);
        return result.format(DateTimeFormatter.ofPattern(ApiConstants.DATE.FORMAT_14));
    }

    /**
     * dtm 에서 amount 시간 빼기
     * dtm 이 2~4자리(HH or HHmm)이면 LocalTime, 그 외 LocalDateTime
     */
    public static String getMinusHour(int amount, String dtm, String type) {
        if (dtm != null && (dtm.length() == 2 || dtm.length() == 4)) {
            return LocalTime.parse(dtm, DateTimeFormatter.ofPattern(ApiConstants.DATE.HOUR_FORMAT))
                    .minusHours(amount)
                    .format(DateTimeFormatter.ofPattern(ApiConstants.DATE.HOUR_FORMAT));
        }
        return LocalDateTime.parse(dtm, DateTimeFormatter.ofPattern(ApiConstants.DATE.HOUR_FORMAT))
                .minusHours(amount)
                .format(DateTimeFormatter.ofPattern(ApiConstants.DATE.HOUR_FORMAT));
    }

    /** dtm 에 amount 시간 더하기 */
    public static String getPlusHour(int amount, String dtm) {
        return LocalDateTime.parse(dtm, DateTimeFormatter.ofPattern(ApiConstants.DATE.HOUR_FORMAT))
                .plusHours(amount)
                .format(DateTimeFormatter.ofPattern(ApiConstants.DATE.HOUR_FORMAT));
    }

    /** dtm 에서 amount 초 빼기 */
    public static String getMinusSecond(int amount, String dtm) {
        return LocalDateTime.parse(dtm, DateTimeFormatter.ofPattern(ApiConstants.DATE.SEC_FORMAT))
                .minusSeconds(amount)
                .format(DateTimeFormatter.ofPattern(ApiConstants.DATE.SEC_FORMAT));
    }

    /** dtm 에 amount 초 더하기 */
    public static String getPlusSecond(int amount, String dtm) {
        return LocalDateTime.parse(dtm, DateTimeFormatter.ofPattern(ApiConstants.DATE.SEC_FORMAT))
                .plusSeconds(amount)
                .format(DateTimeFormatter.ofPattern(ApiConstants.DATE.SEC_FORMAT));
    }

    /**
     * dtm 에 amount 만큼 날짜 더하기
     * type: "date"(일), "month"(월), "year"(연)
     */
    public static String getAddDate(int amount, String dtm, String type) {
        LocalDateTime dt = LocalDateTime.parse(dtm, DateTimeFormatter.ofPattern(ApiConstants.DATE.FORMAT_14));
        LocalDateTime result = "date".equals(type)  ? dt.plusDays(amount)
                             : "month".equals(type) ? dt.plusMonths(amount)
                             :                        dt.plusYears(amount);
        return result.format(DateTimeFormatter.ofPattern(ApiConstants.DATE.FORMAT_14));
    }
}
