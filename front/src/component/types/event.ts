// ─── 오늘 이벤트 ─────────────────────────────────────
export interface TodayEventResult {
  znCd: string;
  todayEventItems: TodayEventItem[];
}

export interface TodayEventItem {
  statEvetOutbSeqn: string;
  statEvetNm: string;
  statEvetCd: string;
  statEvetGdCd: string;
  outbDtm: string;
  clrDtm: string;
  outbPlac: string;
  znCd: string;
}

// ─── 이벤트 목록 ──────────────────────────────────────
export interface EventResult {
  page: number;
  cntPerPage: number;
  totalCnt: number;
  totalPage: number;
  eventList: EventResultItem[];
}

export interface EventResultItem {
  procSt: string;
  statEvetOutbSeqn: string;
  statEvetId: string;
  unitSvcNm: string;
  unitSvcCd: string;
  znNm: string;
  znCd: string;
  outbPlac: string;
  addrShort: string;
  posNm: string;
  outbDtm: string;
  clrDtm: string;
  statEvetNm: string;
  statEvetCd: string;
  xcrdnt: string;
  ycrdnt: string;
  statEvetCntn: string;
  confUserId: string;
  confStatus: string;
}

export interface EventParam {
  znCd: string;
  statEvetCd: string;
  startDtm: string;
  endDtm: string;
  plcId?: string;
  pageNumber?: number;
}

// ─── 웹소켓 ───────────────────────────────────────────
// EventSocketType과 EventFireSocketType이 거의 동일 → 통합
export interface EventSocketItem {
  procSt: string;
  statEvetOutbSeqn: string;
  statEvetId?: string;
  unitSvcCd: string;
  unitSvcNm: string;
  znNm: string;
  znCd: string;
  outbPlac: string;
  addrShort?: string;
  posNm?: string;
  outbDtm: string;
  clrDtm: string;
  statEvetCd: string;
  statEvetNm: string;
  statEvetCntn: string;
  xcrdnt?: string;
  ycrdnt?: string;
  confUserId?: string;
  confStatus?: string;
}

// ─── GIS ──────────────────────────────────────────────
export interface EventHeatmap {
  lat: number;
  lng: number;
  count: number;
}

// ─── 회의 ─────────────────────────────────────────────
export interface ConfType {
  seqn: string;
  statEvetOutbSeqn: string;
  mobileScheme: string;
  pcScheme: string;
  startTime: string;
  endTime: string;
  userId: string;
  plcId: string;
  plcNm: string;
  confStatus: string;
}

export interface BellConfType {
  seqn: string;
  posNm: string;
  posId: string;
  userId: string;
  outbDtm: string;
  clrDtm: string;
  confStatus: number;
  pcScheme: string;
  mobileScheme: string;
  statEvetOutbSeqn: string;
}

// ─── SMS / 방송 ────────────────────────────────────────
export interface MessagePreset {
  cd: string;
  nm: string;
  msg: string;
}

export interface PhoneTargetFirst {
  uprDepartmentCd: string;
  departmentCd: string;
  departmentCdNm: string;
  departmentFullNm: string;
  departmentSe: string;
  departmentSeq: string;
  departmentRank: string;
  secondDeptTargetList: PhoneTargetSecond[];
}

export interface PhoneTargetSecond {
  uprDepartmentCd: string;
  departmentCd: string;
  departmentCdNm: string;
  departmentFullNm: string;
  departmentSe: string;
  departmentSeq: string;
  departmentRank: string;
  children: PhoneTarget[];
}

export interface PhoneTarget {
  usrNm: string;
  departmentCd: string;
  departmentCdNm: string;
  hpNo: string;
}

export interface BroadDevice {
  disabled: string;
  id: string;
  lat: string;
  lon: string;
  name: string;
  pid: string;
  subBroadDeviceList: SubBroadDevice[];
}

export interface SubBroadDevice {
  childBroadDeviceList: ChildBroadDevice[];
  disabled: string;
  id: string;
  lat: string;
  lon: string;
  name: string;
  pid: string;
}

export interface ChildBroadDevice {
  disabled: string;
  id: string;
  lat: string;
  lon: string;
  name: string;
  pid: string;
}

// ─── SMS 발송 바디 ─────────────────────────────────────
export interface SmsBodyType {
  eventSeq: string;
  title: string;
  content: string;
  sendDtm: string;
  sndTarget: string[];
  type: 'SMS' | 'BRC';
}
