import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import {
  EventResultItem,
  EventParam,
  EventSocketItem,
  EventHeatmap,
  MessagePreset,
  PhoneTargetFirst,
  BroadDevice,
} from '../types/event';
import { WHOLE_OPTION } from '../constants/eventCode';
import moment from 'moment';

// ─── 메시지 채널 상태 (SMS / 방송 통합) ──────────────
interface MessageChannelState {
  preset: MessagePreset;
  title: string;
  content: string;
  selectedTargets: string[];
}

const defaultMessageChannel: MessageChannelState = {
  preset: { cd: '', nm: '', msg: '' },
  title: '',
  content: '',
  selectedTargets: [],
};

// ─── 필터 상태 ────────────────────────────────────────
interface FilterState {
  typeOpts: string[];   // 선택된 이벤트 타입
  areaOpts: string[];   // 선택된 지역
}

// ─── 지난 이벤트 파라미터 ─────────────────────────────
interface LastParam {
  startDtm: string;
  endDtm: string;
  pageNumber: number;
  pageIndex: number;
}

const defaultLastParam: LastParam = {
  startDtm: moment().format('YYYYMMDD'),
  endDtm: moment().format('YYYYMMDD'),
  pageNumber: 1,
  pageIndex: 0,
};

interface EventState {
  // 필터 (현재 / 지난이벤트 탭 공용)
  currentFilter: FilterState;
  lastFilter: FilterState;

  // 현재 이벤트 목록
  eventList: EventResultItem[];
  totalCnt: number;
  param: EventParam;

  // 현재 이벤트 선택/상호작용
  selectEvent: EventResultItem | null;
  openDetailList: string[];   // 펼쳐진 이벤트 row seqn 목록
  newEventList: string[];     // 소켓으로 새로 추가된 이벤트 (하이라이트용)

  // 지난 이벤트 (모달)
  lastEventList: EventResultItem[];
  lastTotalCnt: number;
  lastTotalPage: number;
  lastParam: LastParam;
  lastSelectEvent: EventResultItem | null;
  isLastReload: boolean;

  // WebSocket
  wsEvent: EventSocketItem | null;
  isSocketAlarm: boolean;
  isFireAlarm: boolean;

  // GIS
  heatmap: EventHeatmap[];
  heatmapOn: boolean;
  heatmapDropdownOpen: boolean;   // 히트맵 드롭다운 열림 여부

  // 메시지 채널 (SMS / 방송)
  sms: MessageChannelState;
  broadcast: MessageChannelState;
  smsTargetRes: PhoneTargetFirst[];
  broadTargetRes: BroadDevice[];
  smsEvent: EventResultItem | null;      // SMS 전파 대상 이벤트

  // 화상회의
  participantConf: EventResultItem | null;

  // UI
  toastKey: string;
  isBoxOpen: boolean;
  openOpt: string;      // 열린 모달/패널: '' | 'last' | 'sms' | 'confirm' | 'target' | 'broadTarget' | 'preset' | 'confParticipant'
  filterOpt: string;    // 열린 필터 드롭다운: '' | 'area_e' | 'event' | 'lastArea' | 'lastEvent'
}

interface EventActions {
  // 필터
  setCurrentFilter: (filter: Partial<FilterState>) => void;
  setLastFilter: (filter: Partial<FilterState>) => void;
  initFilters: (typeOpts: string[], areaOpts: string[]) => void;

  // 현재 이벤트
  setEventList: (list: EventResultItem[]) => void;
  setTotalCnt: (cnt: number) => void;
  setParam: (param: Partial<EventParam>) => void;
  setSelectEvent: (event: EventResultItem | null) => void;
  setOpenDetailList: (list: string[]) => void;
  setNewEventList: (list: string[]) => void;

  // 지난 이벤트
  setLastEventList: (list: EventResultItem[]) => void;
  setLastTotalCnt: (cnt: number) => void;
  setLastTotalPage: (page: number) => void;
  setLastParam: (param: Partial<LastParam>) => void;
  setLastSelectEvent: (event: EventResultItem | null) => void;
  setIsLastReload: (v: boolean) => void;

  // WebSocket
  setWsEvent: (event: EventSocketItem | null) => void;
  setIsSocketAlarm: (v: boolean) => void;
  setIsFireAlarm: (v: boolean) => void;

  // GIS
  setHeatmap: (data: EventHeatmap[]) => void;
  setHeatmapOn: (v: boolean) => void;
  setHeatmapDropdownOpen: (v: boolean) => void;

  // 메시지
  setSms: (sms: Partial<MessageChannelState>) => void;
  setBroadcast: (broadcast: Partial<MessageChannelState>) => void;
  setSmsTargetRes: (res: PhoneTargetFirst[]) => void;
  setBroadTargetRes: (res: BroadDevice[]) => void;
  setSmsEvent: (event: EventResultItem | null) => void;

  // 화상회의
  setParticipantConf: (event: EventResultItem | null) => void;

  // UI
  setToastKey: (key: string) => void;
  setIsBoxOpen: (v: boolean) => void;
  setOpenOpt: (opt: string) => void;
  setFilterOpt: (opt: string) => void;
}

const defaultParam: EventParam = {
  znCd: WHOLE_OPTION,
  statEvetCd: WHOLE_OPTION,
  startDtm: '',
  endDtm: '',
  pageNumber: 1,
};

export const useEventStore = create<EventState & { actions: EventActions }>()(
  immer((set) => ({
    currentFilter: { typeOpts: [], areaOpts: [] },
    lastFilter: { typeOpts: [], areaOpts: [] },
    eventList: [],
    totalCnt: 0,
    param: defaultParam,
    selectEvent: null,
    openDetailList: [],
    newEventList: [],
    lastEventList: [],
    lastTotalCnt: 0,
    lastTotalPage: 1,
    lastParam: defaultLastParam,
    lastSelectEvent: null,
    isLastReload: false,
    wsEvent: null,
    isSocketAlarm: false,
    isFireAlarm: false,
    heatmap: [],
    heatmapOn: false,
    heatmapDropdownOpen: false,
    sms: defaultMessageChannel,
    broadcast: defaultMessageChannel,
    smsTargetRes: [],
    broadTargetRes: [],
    smsEvent: null,
    participantConf: null,
    toastKey: '',
    isBoxOpen: true,
    openOpt: '',
    filterOpt: '',

    actions: {
      setCurrentFilter: (filter) =>
        set((s) => { Object.assign(s.currentFilter, filter); }),

      setLastFilter: (filter) =>
        set((s) => { Object.assign(s.lastFilter, filter); }),

      initFilters: (typeOpts, areaOpts) =>
        set((s) => {
          s.currentFilter = { typeOpts, areaOpts };
          s.lastFilter = { typeOpts, areaOpts };
        }),

      setEventList: (list) =>
        set((s) => { s.eventList = list; }),

      setTotalCnt: (cnt) =>
        set((s) => { s.totalCnt = cnt; }),

      setParam: (param) =>
        set((s) => { Object.assign(s.param, param); }),

      setSelectEvent: (event) =>
        set((s) => { s.selectEvent = event; }),

      setOpenDetailList: (list) =>
        set((s) => { s.openDetailList = list; }),

      setNewEventList: (list) =>
        set((s) => { s.newEventList = list; }),

      setLastEventList: (list) =>
        set((s) => { s.lastEventList = list; }),

      setLastTotalCnt: (cnt) =>
        set((s) => { s.lastTotalCnt = cnt; }),

      setLastTotalPage: (page) =>
        set((s) => { s.lastTotalPage = page; }),

      setLastParam: (param) =>
        set((s) => { Object.assign(s.lastParam, param); }),

      setLastSelectEvent: (event) =>
        set((s) => { s.lastSelectEvent = event; }),

      setIsLastReload: (v) =>
        set((s) => { s.isLastReload = v; }),

      setWsEvent: (event) =>
        set((s) => { s.wsEvent = event; }),

      setIsSocketAlarm: (v) =>
        set((s) => { s.isSocketAlarm = v; }),

      setIsFireAlarm: (v) =>
        set((s) => { s.isFireAlarm = v; }),

      setHeatmap: (data) =>
        set((s) => { s.heatmap = data; }),

      setHeatmapOn: (v) =>
        set((s) => { s.heatmapOn = v; }),

      setHeatmapDropdownOpen: (v) =>
        set((s) => { s.heatmapDropdownOpen = v; }),

      setSms: (sms) =>
        set((s) => { Object.assign(s.sms, sms); }),

      setBroadcast: (broadcast) =>
        set((s) => { Object.assign(s.broadcast, broadcast); }),

      setSmsTargetRes: (res) =>
        set((s) => { s.smsTargetRes = res; }),

      setBroadTargetRes: (res) =>
        set((s) => { s.broadTargetRes = res; }),

      setSmsEvent: (event) =>
        set((s) => { s.smsEvent = event; }),

      setParticipantConf: (event) =>
        set((s) => { s.participantConf = event; }),

      setToastKey: (key) =>
        set((s) => { s.toastKey = key; }),

      setIsBoxOpen: (v) =>
        set((s) => { s.isBoxOpen = v; }),

      setOpenOpt: (opt) =>
        set((s) => { s.openOpt = opt; }),

      setFilterOpt: (opt) =>
        set((s) => { s.filterOpt = opt; }),
    },
  })),
);
