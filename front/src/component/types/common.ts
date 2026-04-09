// ─── 사용자 ─────────────────────────────────────────────
export interface UserType {
  token: string;
  userId: string;
  userName: string;
  mobile: string;
  userType: string;
  grupId: string;
  orgnId: string;
  dptId: string;
  loginId: string;
}

export interface SysType {
  sysName: string;
  url: string;
}

export interface InfoType {
  userInfo: UserType;
  sysInfos: SysType[];
}

// ─── 권한 ─────────────────────────────────────────────
export interface ZnType {
  znCd: string;
  znNm: string;
  areaCd: string;
  active: boolean;
  scCnt: number;
  facCnt: number;
  todaySitCnt: number;
  todayStatusCnt: number;
  subZnList: SubZnType[];
}

export interface SubZnType {
  topAreaCd: string;
  topAreaNm: string;
  areaCd: string;
  areaNm: string;
}

export interface KeyValueType {
  key: string;
  value: string;
}

export interface RoleType {
  areaRoles: ZnType[];
  eventRoles: KeyValueType[];
}

// ─── 트리 노드 ─────────────────────────────────────────
export interface TreeNode {
  label: string;
  value: string;
  children?: TreeNode[];
}

// ─── CCTV ─────────────────────────────────────────────
export interface CctvType {
  cctvId: string;
  cctvNm: string;
  clfyNm: string;
  lat: string;
  lng: string;
  mgtNo: string;
  area: string;
}

// ─── 네비게이션 ───────────────────────────────────────
export interface NavType {
  nm: string;
  cd: string;
  back: string;
  hover: string;
  active: string;
}
