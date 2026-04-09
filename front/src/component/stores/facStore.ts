import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import moment from 'moment';
import { ScFacType, FacParam, FacWsType } from '../types/fac';
import { TodayEventItem } from '../types/event';
import { CctvType } from '../types/common';
import { WHOLE_OPTION } from '../constants/eventCode';

interface FacState {
  // 시설 목록
  facList: ScFacType[];
  param: FacParam;

  // 검색 UI 상태
  areaOpts: string[];        // CheckboxTree 선택값
  centerName: string;        // 이름 검색어 (param과 분리)
  searchVersion: number;     // 검색 트리거 카운터 (1: 초기 자동조회)

  // 선택된 시설
  selectFac: ScFacType | null;

  // CCTV
  crimeCctvs: CctvType[];
  scCctvs: CctvType[];
  fullCctv: CctvType | null;

  // WebSocket
  wsData: FacWsType | null;

  // UI
  toastKey: string;
  listOpen: boolean;
  stateOpen: boolean;   // 오른쪽 상세 패널 열림 여부 (FacGisControl center 오프셋 / invalidateSize 트리거용)
  isVisible: boolean;   // FAC 탭 표시 여부 (display:none → block 전환 시 invalidateSize 트리거용)

  // 시설 이벤트 (상세 패널)
  eventStartDtm: string;
  eventEndDtm: string;
  facEventList: TodayEventItem[];
}

interface FacActions {
  setFacList: (list: ScFacType[]) => void;
  setParam: (param: Partial<FacParam>) => void;
  setAreaOpts: (opts: string[]) => void;
  setCenterName: (name: string) => void;
  incrementSearchVersion: () => void;
  setSelectFac: (fac: ScFacType | null) => void;
  setCrimeCctvs: (list: CctvType[]) => void;
  setScCctvs: (list: CctvType[]) => void;
  setFullCctv: (cctv: CctvType | null) => void;
  setWsData: (data: FacWsType | null) => void;
  setToastKey: (key: string) => void;
  setListOpen: (open: boolean) => void;
  setStateOpen: (v: boolean) => void;
  setIsVisible: (v: boolean) => void;
  setEventStartDtm: (dtm: string) => void;
  setEventEndDtm: (dtm: string) => void;
  setFacEventList: (list: TodayEventItem[]) => void;
}

const defaultParam: FacParam = {
  areaCd: '400',
  centerName: '',
  sortType: 'default',
};

const today = moment().format('YYYYMMDD');

export const useFacStore = create<FacState & { actions: FacActions }>()(
  immer((set) => ({
    facList: [],
    param: defaultParam,
    areaOpts: [WHOLE_OPTION],
    centerName: '',
    searchVersion: 1,   // 초기값 1 → 마운트 시 자동 조회
    selectFac: null,
    crimeCctvs: [],
    scCctvs: [],
    fullCctv: null,
    wsData: null,
    toastKey: '',
    listOpen: true,
    stateOpen: false,
    isVisible: false,
    eventStartDtm: today,
    eventEndDtm: today,
    facEventList: [],

    actions: {
      setFacList: (list) =>
        set((s) => { s.facList = list; }),

      setParam: (param) =>
        set((s) => { Object.assign(s.param, param); }),

      setAreaOpts: (opts) =>
        set((s) => { s.areaOpts = opts; }),

      setCenterName: (name) =>
        set((s) => { s.centerName = name; }),

      incrementSearchVersion: () =>
        set((s) => { s.searchVersion += 1; }),

      setSelectFac: (fac) =>
        set((s) => { s.selectFac = fac; }),

      setCrimeCctvs: (list) =>
        set((s) => { s.crimeCctvs = list; }),

      setScCctvs: (list) =>
        set((s) => { s.scCctvs = list; }),

      setFullCctv: (cctv) =>
        set((s) => { s.fullCctv = cctv; }),

      setWsData: (data) =>
        set((s) => { s.wsData = data; }),

      setToastKey: (key) =>
        set((s) => { s.toastKey = key; }),

      setListOpen: (open) =>
        set((s) => { s.listOpen = open; }),

      setStateOpen: (v) =>
        set((s) => { s.stateOpen = v; }),

      setIsVisible: (v) =>
        set((s) => { s.isVisible = v; }),

      setEventStartDtm: (dtm) =>
        set((s) => { s.eventStartDtm = dtm; }),

      setEventEndDtm: (dtm) =>
        set((s) => { s.eventEndDtm = dtm; }),

      setFacEventList: (list) =>
        set((s) => { s.facEventList = list; }),
    },
  })),
);
