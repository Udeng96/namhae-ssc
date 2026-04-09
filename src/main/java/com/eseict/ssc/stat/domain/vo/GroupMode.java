package com.eseict.ssc.stat.domain.vo;

/**
 * 날짜 집계 단위 — 4개 통계 서비스에서 공용으로 사용
 *
 * 기존: 각 서비스(EventStatService, FacStatService, OperStatService, UsageStatService)에
 *       nested enum으로 4벌 중복 선언
 * 개선: 독립 enum으로 추출 → 중복 제거, 단일 참조
 */
public enum GroupMode {
    DAY,    // yyyy/MM/dd
    WEEK,   // MM월 N주
    MONTH,  // yyyy년 MM월
    YEAR    // yyyy년
}
