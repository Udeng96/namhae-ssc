// ─── 통계 결과 ────────────────────────────────────────
export interface EventStatResult {
  allCnt: number;
  eventBellStats: EventStatBell[];
  eventDateStats: EventStatDate[];
  eventScStats: EventStatSc[];
  gisStats: GisStatType[];
}

export interface FacStatResult {
  allCnt: number;
  gisStats: GisStatType[];
  facDateStats: EventStatDate[];
  facTypeStats: FacStatType[];
  facScStats: EventStatSc[];
}

export interface OperStatResult {
  allCnt: number;
  gisStats: GisStatType[];
  dateStats: EventStatDate[];
  facTypeStats: FacStatType[];
  timeStats: OperTimeResult[];
}

export interface UsageStatResult {
  serviceUsage: UsageStatType[];
  visitorUsage: UsageStatType[];
  openConfUsage: UsageStatType[];
  connConfUsage: UsageStatType[];
  contentUsage: UsageStatType[];
  contentAreaUsage: UsageStatType[];
}

// ─── 공통 통계 항목 ───────────────────────────────────
export interface EventStatBell {
  keyId: string;
  keyNm: string;
  count: number;
}

export interface EventStatDate {
  date: string;
  count: { [key: string]: number };
}

export interface EventStatSc {
  scId: string;
  scNm: string;
  count: number;
}

export interface GisStatType {
  areaCd: string;
  areaNm: string;
  count: number;
}

export interface FacStatType {
  facCd: string;
  facNm: string;
  count: number;
}

export interface OperTimeResult {
  areaCd: string;
  areaNm: string;
  count: number;
}

export interface UsageStatType {
  key: string;
  count: number;
}

// ─── 통계 조회 파라미터 ───────────────────────────────
export interface StatParam {
  znCd: string;
  statEvetCd: string;
  startDtm: string;
  endDtm: string;
}
