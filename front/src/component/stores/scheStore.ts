import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import moment from 'moment';
import { ScheFileType, ScheItem, ScheRootNode } from '../types/sche';
import {
  SCHE_TOAST_TYPE,
  SCHE_TYPE,
  SCHE_MODE,
  SCHE_EMER_BACK,
  SCHE_EMER_SHOW_TIME,
} from '../constants/scheConst';

// ─── 상태 ─────────────────────────────────────────────
interface ScheState {
  // 경로당 트리
  scheNodes: ScheRootNode[];

  // 토스트 / 탭 / 로딩
  scheToast: string;
  activeType: string;
  requestState: string;

  // 스케줄 목록 (원본 + 타입별 분류)
  schedules: ScheItem[];
  contents: ScheItem[];
  norms: ScheItem[];
  emers: ScheItem[];

  // 폼 입력값
  titleOpt: string;
  selectSort: string;
  selectBack: string;
  selectExpire: string;
  selectScOpt: string[];
  selectDay: string;
  startDtm: string;
  endDtm: string;
  startTime: string;
  endTime: string;
  scheMode: string;

  // 파일 선택
  selectContent: string;
  selectContentFileList: ScheFileType[];
  selectWideBack: ScheFileType | null;
  selectNarrowBack: ScheFileType | null;

  // 선택된 스케줄 항목 (수정/삭제)
  activeSche: ScheItem | null;
}

// ─── 액션 ─────────────────────────────────────────────
interface ScheActions {
  setScheNodes: (scheNodes: ScheRootNode[]) => void;
  setScheToast: (scheToast: string) => void;
  setActiveType: (activeType: string) => void;

  setRequestState: (requestState: string) => void;
  setSchedules: (schedules: ScheItem[]) => void;
  setContents: (contents: ScheItem[]) => void;
  setNorms: (norms: ScheItem[]) => void;
  setEmers: (emers: ScheItem[]) => void;

  setTitleOpt: (titleOpt: string) => void;
  setSelectSort: (selectSort: string) => void;
  setSelectBack: (selectBack: string) => void;
  setSelectExpire: (selectExpire: string) => void;
  setScheMode: (scheMode: string) => void;
  setSelectScOpt: (selectScOpt: string[]) => void;
  setSelectDay: (selectDay: string) => void;
  setStartDtm: (startDtm: string) => void;
  setEndDtm: (endDtm: string) => void;
  setStartTime: (startTime: string) => void;
  setEndTime: (endTime: string) => void;
  setSelectContent: (selectContent: string) => void;
  setSelectContentFileList: (selectContentFileList: ScheFileType[]) => void;
  setSelectWideBack: (selectWideBack: ScheFileType | null) => void;
  setSelectNarrowBack: (selectNarrowBack: ScheFileType | null) => void;

  setActiveSche: (activeSche: ScheItem | null) => void;
}

// ─── 스토어 ───────────────────────────────────────────
export const useScheStore = create<ScheState & { actions: ScheActions }>()(
  immer((set) => ({
    scheNodes: [],
    scheToast: SCHE_TOAST_TYPE.NONE,
    activeType: SCHE_TYPE.CONTENT,
    requestState: 'none',

    schedules: [],
    contents: [],
    norms: [],
    emers: [],

    titleOpt: '',
    selectSort: SCHE_TYPE.NORM,
    selectBack: SCHE_EMER_BACK[0].cd,
    selectExpire: SCHE_EMER_SHOW_TIME[0].cd,
    selectScOpt: [],
    selectDay: '매일',
    startDtm: moment().format('YYYY-MM-DD'),
    endDtm: moment().format('YYYY-MM-DD'),
    startTime: moment().format('HH:00'),
    endTime: moment().add(1, 'hours').format('HH:00'),
    scheMode: SCHE_MODE.DEFAULT,

    selectContent: '',
    selectContentFileList: [],
    selectWideBack: null,
    selectNarrowBack: null,

    activeSche: null,

    actions: {
      setScheNodes: (scheNodes) =>
        set((s) => { s.scheNodes = scheNodes; }),

      setScheToast: (scheToast) =>
        set((s) => { s.scheToast = scheToast; }),

      setActiveType: (activeType) =>
        set((s) => {
          s.activeType = activeType;
          // 탭 전환 시 이전 탭의 폼 상태 초기화 (파일/스케줄 잔류 방지)
          s.activeSche            = null;
          s.scheMode              = SCHE_MODE.DEFAULT;
          s.selectContentFileList = [];
          s.selectContent         = '';
          s.selectWideBack        = null;
          s.selectNarrowBack      = null;
        }),

      setRequestState: (requestState) =>
        set((s) => { s.requestState = requestState; }),

      setSchedules: (schedules) =>
        set((s) => { s.schedules = schedules; }),

      setContents: (contents) =>
        set((s) => { s.contents = contents; }),

      setNorms: (norms) =>
        set((s) => { s.norms = norms; }),

      setEmers: (emers) =>
        set((s) => { s.emers = emers; }),

      setTitleOpt: (titleOpt) =>
        set((s) => { s.titleOpt = titleOpt; }),

      setSelectSort: (selectSort) =>
        set((s) => { s.selectSort = selectSort; }),

      setSelectBack: (selectBack) =>
        set((s) => { s.selectBack = selectBack; }),

      setSelectExpire: (selectExpire) =>
        set((s) => { s.selectExpire = selectExpire; }),

      setScheMode: (scheMode) =>
        set((s) => { s.scheMode = scheMode; }),

      setSelectScOpt: (selectScOpt) =>
        set((s) => { s.selectScOpt = selectScOpt; }),

      setSelectDay: (selectDay) =>
        set((s) => { s.selectDay = selectDay; }),

      setStartDtm: (startDtm) =>
        set((s) => { s.startDtm = startDtm; }),

      setEndDtm: (endDtm) =>
        set((s) => { s.endDtm = endDtm; }),

      setStartTime: (startTime) =>
        set((s) => { s.startTime = startTime; }),

      setEndTime: (endTime) =>
        set((s) => { s.endTime = endTime; }),

      setSelectContent: (selectContent) =>
        set((s) => { s.selectContent = selectContent; }),

      setSelectContentFileList: (selectContentFileList) =>
        set((s) => { s.selectContentFileList = selectContentFileList; }),

      setSelectWideBack: (selectWideBack) =>
        set((s) => { s.selectWideBack = selectWideBack; }),

      setSelectNarrowBack: (selectNarrowBack) =>
        set((s) => { s.selectNarrowBack = selectNarrowBack; }),

      setActiveSche: (activeSche) =>
        set((s) => { s.activeSche = activeSche; }),
    },
  })),
);
