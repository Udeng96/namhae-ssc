import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import moment from 'moment';
import { EventResultItem, EventParam, EventSocketItem } from '../types/event';
import { WHOLE_OPTION } from '../constants/eventCode';

// ─── 필터 상태 ────────────────────────────────────────
interface FilterState {
  typeOpts: string[];
  areaOpts: string[];
}

// ─── 지난 이벤트 파라미터 ─────────────────────────────
interface LastParam {
  startDtm:   string;
  endDtm:     string;
  pageNumber: number;
  pageIndex:  number;
}

const defaultLastParam: LastParam = {
  startDtm:   moment().format('YYYYMMDD'),
  endDtm:     moment().format('YYYYMMDD'),
  pageNumber: 1,
  pageIndex:  0,
};

const defaultParam: EventParam = {
  znCd:        WHOLE_OPTION,
  statEvetCd:  WHOLE_OPTION,
  startDtm:    '',
  endDtm:      '',
  plcId:       '',
  pageNumber:  0,
};

interface FireState {
  // 필터
  currentFilter: FilterState;
  lastFilter:    FilterState;

  // 현재 이벤트 목록
  eventList:       EventResultItem[];
  totalCnt:        number;
  param:           EventParam;

  // 현재 이벤트 선택/상호작용
  selectEvent:      EventResultItem | null;
  openDetailList:   string[];
  newEventList:     string[];

  // 지난 이벤트
  lastEventList:    EventResultItem[];
  lastTotalCnt:     number;
  lastTotalPage:    number;
  lastParam:        LastParam;
  lastSelectEvent:  EventResultItem | null;
  isLastReload:     boolean;

  // WebSocket
  wsEvent:      EventSocketItem | null;
  isFireAlarm:  boolean;

  // 회의
  participantConf:  EventResultItem | null;
  openConfEvent:    EventResultItem | null;
  openPcSchema:     string;

  // UI
  toastKey:    string;
  isBoxOpen:   boolean;
  openOpt:     string;   // '' | 'last'
  filterOpt:   string;   // '' | 'area_e' | 'event' | 'lastArea' | 'lastEvent'
}

interface FireActions {
  // 필터
  setCurrentFilter:  (filter: Partial<FilterState>) => void;
  setLastFilter:     (filter: Partial<FilterState>) => void;
  initFilters:       (typeOpts: string[], areaOpts: string[]) => void;

  // 현재 이벤트
  setEventList:      (list: EventResultItem[]) => void;
  setTotalCnt:       (cnt: number) => void;
  setParam:          (param: Partial<EventParam>) => void;
  setSelectEvent:    (event: EventResultItem | null) => void;
  setOpenDetailList: (list: string[]) => void;
  setNewEventList:   (list: string[]) => void;

  // 지난 이벤트
  setLastEventList:   (list: EventResultItem[]) => void;
  setLastTotalCnt:    (cnt: number) => void;
  setLastTotalPage:   (page: number) => void;
  setLastParam:       (param: Partial<LastParam>) => void;
  setLastSelectEvent: (event: EventResultItem | null) => void;
  setIsLastReload:    (v: boolean) => void;

  // WebSocket
  setWsEvent:      (event: EventSocketItem | null) => void;
  setIsFireAlarm:  (v: boolean) => void;

  // 회의
  setParticipantConf: (event: EventResultItem | null) => void;
  setOpenConfEvent:   (event: EventResultItem | null) => void;
  setOpenPcSchema:    (url: string) => void;

  // UI
  setToastKey:  (key: string) => void;
  setIsBoxOpen: (v: boolean) => void;
  setOpenOpt:   (opt: string) => void;
  setFilterOpt: (opt: string) => void;
}

export const useFireStore = create<FireState & { actions: FireActions }>()(
  immer((set) => ({
    currentFilter: { typeOpts: [], areaOpts: [] },
    lastFilter:    { typeOpts: [], areaOpts: [] },

    eventList:      [],
    totalCnt:       0,
    param:          defaultParam,
    selectEvent:    null,
    openDetailList: [],
    newEventList:   [],

    lastEventList:   [],
    lastTotalCnt:    0,
    lastTotalPage:   1,
    lastParam:       defaultLastParam,
    lastSelectEvent: null,
    isLastReload:    false,

    wsEvent:     null,
    isFireAlarm: false,

    participantConf: null,
    openConfEvent:   null,
    openPcSchema:    '',

    toastKey:  '',
    isBoxOpen: true,
    openOpt:   '',
    filterOpt: '',

    actions: {
      setCurrentFilter: (filter) =>
        set((s) => { Object.assign(s.currentFilter, filter); }),

      setLastFilter: (filter) =>
        set((s) => { Object.assign(s.lastFilter, filter); }),

      initFilters: (typeOpts, areaOpts) =>
        set((s) => {
          s.currentFilter = { typeOpts, areaOpts };
          s.lastFilter    = { typeOpts, areaOpts };
        }),

      setEventList:      (list)  => set((s) => { s.eventList      = list;  }),
      setTotalCnt:       (cnt)   => set((s) => { s.totalCnt       = cnt;   }),
      setParam:          (param) => set((s) => { Object.assign(s.param, param); }),
      setSelectEvent:    (event) => set((s) => { s.selectEvent    = event; }),
      setOpenDetailList: (list)  => set((s) => { s.openDetailList = list;  }),
      setNewEventList:   (list)  => set((s) => { s.newEventList   = list;  }),

      setLastEventList:   (list)  => set((s) => { s.lastEventList   = list;  }),
      setLastTotalCnt:    (cnt)   => set((s) => { s.lastTotalCnt    = cnt;   }),
      setLastTotalPage:   (page)  => set((s) => { s.lastTotalPage   = page;  }),
      setLastParam:       (param) => set((s) => { Object.assign(s.lastParam, param); }),
      setLastSelectEvent: (event) => set((s) => { s.lastSelectEvent = event; }),
      setIsLastReload:    (v)     => set((s) => { s.isLastReload    = v;     }),

      setWsEvent:     (event) => set((s) => { s.wsEvent     = event; }),
      setIsFireAlarm: (v)     => set((s) => { s.isFireAlarm = v;     }),

      setParticipantConf: (event) => set((s) => { s.participantConf = event; }),
      setOpenConfEvent:   (event) => set((s) => { s.openConfEvent   = event; }),
      setOpenPcSchema:    (url)   => set((s) => { s.openPcSchema    = url;   }),

      setToastKey:  (key) => set((s) => { s.toastKey  = key; }),
      setIsBoxOpen: (v)   => set((s) => { s.isBoxOpen = v;   }),
      setOpenOpt:   (opt) => set((s) => { s.openOpt   = opt; }),
      setFilterOpt: (opt) => set((s) => { s.filterOpt = opt; }),
    },
  })),
);
