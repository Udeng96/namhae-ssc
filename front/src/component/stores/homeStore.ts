import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { ScFacType } from '../types/fac';
import { TodayEventResult } from '../types/event';

interface HomeState {
  /** 선택된 지역 코드 ('all' = 전체) */
  selectArea: string;
  /** 마우스오버된 지역 코드 */
  hoverArea: string;
  /** 선택된 경로당 이름 */
  selectSc: string;
  /** 현재 지역의 경로당 시설 목록 */
  scFacs: ScFacType[];
  /** 오늘의 이벤트 목록 (홈 표출용) */
  todayEventList: TodayEventResult[];
}

interface HomeActions {
  setSelectArea: (area: string) => void;
  setHoverArea: (area: string) => void;
  setSelectSc: (sc: string) => void;
  setScFacs: (facs: ScFacType[]) => void;
  setTodayEventList: (list: TodayEventResult[]) => void;
}

export const useHomeStore = create<HomeState & { actions: HomeActions }>()(
  immer((set) => ({
    selectArea: 'all',
    hoverArea: '',
    selectSc: '',
    scFacs: [],
    todayEventList: [],

    actions: {
      setSelectArea: (area) =>
        set((s) => { s.selectArea = area; }),

      setHoverArea: (area) =>
        set((s) => { s.hoverArea = area; }),

      setSelectSc: (sc) =>
        set((s) => { s.selectSc = sc; }),

      setScFacs: (facs) =>
        set((s) => { s.scFacs = facs; }),

      setTodayEventList: (list) =>
        set((s) => { s.todayEventList = list; }),
    },
  })),
);
