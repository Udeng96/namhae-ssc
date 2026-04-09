// ─── 시설 목록 ────────────────────────────────────────
export interface ScFacType {
  facId: string;
  addrShort: string;
  posNm: string;
  facClfyId: string;
  facDesc: string;
  facNm: string;
  mgtNo: string;
  topAreaId: string;
  topAreaName: string;
  areaId: string;
  areaName: string;
  xcrdnt: string;
  ycrdnt: string;
  posCrdntId: string;
  todaySitEvet: number;
  todayStatusEvet: number;
  bell: string;
  fire: string;
  settop1: string;
  settop2: string;
  cctvB: string;
  cctvK: string;
  cctvL: string;
  cctvT: string;
  sc: string;
  addedAt: number;
}

export interface FacParam {
  areaCd: string;
  centerName: string;
  sortType: string;
}

// ─── 시설 상세 ────────────────────────────────────────
export interface FacResult {
  areaNm: string;
  areaCd: string;
  posNm: string;
  facAddr: string;
  facClfyId: string;
  facNm: string;
  facId: string;
  facClfyNm: string;
  xcrdnt: string;
  ycrdnt: string;
  mgtNo: string;
  useYn: boolean;
  statEvetGdCd: string;
  sensorListCd: string;
  sensorList: FacSensorList;
  todayEventGdCd: boolean;
  todayEventList: FacEventType[];
  todayStatusEventList: FacEventType[];
}

export interface FacSensorList {
  fireSensors: FacSensorType[];
  cctvList: FacSensorType[];
  emergencyBells: FacSensorType[];
  setTopBoxes: FacSensorType[];
}

export interface FacSensorType {
  facClfyId: string;
  facNm: string;
  mgtNo: string;
  statEvetGdCd: string;
}

export interface FacEventType {
  evetSeq: string;
  scNm: string;
  evetCd: string;
  evetNm: string;
  outbDtm: string;
  statEvetGdCd: string;
}

// ─── 웹소켓 ───────────────────────────────────────────
export interface FacWsType {
  evetSeq: string;
  scNm: string;
  evetCd: string;
  evetNm: string;
  outbDtm: string;
}
