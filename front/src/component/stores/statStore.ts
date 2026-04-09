import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import moment from 'moment';
import {
  EventStatResult,
  FacStatResult,
  OperStatResult,
  UsageStatResult,
} from '@/component/types/stat';
import { ZnType } from '@/component/types/common';

export type StatTab = 'event' | 'fac' | 'oper' | 'usage';

interface StatState {
  activeTab: StatTab;
  startDtm: string;                            // YYYYMMDD
  endDtm: string;                              // YYYYMMDD

  activeArea: ZnType | null;
  hoverArea: ZnType | null;

  eventResult: EventStatResult | null;
  facResult: FacStatResult | null;
  operResult: OperStatResult | null;
  usageResult: UsageStatResult | null;

  // 지역 클릭 시 sub 데이터: Record<znCd, Result>
  subEvent: Record<string, EventStatResult>;
  subFac: Record<string, FacStatResult>;
  subOper: Record<string, OperStatResult>;     // key: areaCd
}

interface StatActions {
  setActiveTab: (tab: StatTab) => void;
  setStartDtm: (v: string) => void;
  setEndDtm: (v: string) => void;
  setDates: (start: string, end: string) => void;
  setActiveArea: (area: ZnType | null) => void;
  setHoverArea: (area: ZnType | null) => void;
  setEventResult: (data: EventStatResult | null) => void;
  setFacResult: (data: FacStatResult | null) => void;
  setOperResult: (data: OperStatResult | null) => void;
  setUsageResult: (data: UsageStatResult | null) => void;
  setSubEvent: (key: string, data: EventStatResult) => void;
  setSubFac: (key: string, data: FacStatResult) => void;
  setSubOper: (key: string, data: OperStatResult) => void;
  clearSub: () => void;
}

const DEFAULT_START = moment().subtract(7, 'days').format('YYYYMMDD');
const DEFAULT_END   = moment().format('YYYYMMDD');

export const useStatStore = create<StatState & { actions: StatActions }>()(
  immer((set) => ({
    activeTab: 'event',
    startDtm: DEFAULT_START,
    endDtm: DEFAULT_END,

    activeArea: null,
    hoverArea: null,

    eventResult: null,
    facResult: null,
    operResult: null,
    usageResult: null,

    subEvent: {},
    subFac: {},
    subOper: {},

    actions: {
      setActiveTab: (tab) =>
        set((s) => { s.activeTab = tab; }),

      setStartDtm: (v) =>
        set((s) => { s.startDtm = v; }),

      setEndDtm: (v) =>
        set((s) => { s.endDtm = v; }),

      setDates: (start, end) =>
        set((s) => { s.startDtm = start; s.endDtm = end; }),

      setActiveArea: (area) =>
        set((s) => { s.activeArea = area; }),

      setHoverArea: (area) =>
        set((s) => { s.hoverArea = area; }),

      setEventResult: (data) =>
        set((s) => { s.eventResult = data; }),

      setFacResult: (data) =>
        set((s) => { s.facResult = data; }),

      setOperResult: (data) =>
        set((s) => { s.operResult = data; }),

      setUsageResult: (data) =>
        set((s) => { s.usageResult = data; }),

      setSubEvent: (key, data) =>
        set((s) => { s.subEvent[key] = data; }),

      setSubFac: (key, data) =>
        set((s) => { s.subFac[key] = data; }),

      setSubOper: (key, data) =>
        set((s) => { s.subOper[key] = data; }),

      clearSub: () =>
        set((s) => { s.subEvent = {}; s.subFac = {}; s.subOper = {}; }),
    },
  })),
);
