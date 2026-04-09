import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { UserType, SysType, ZnType, KeyValueType, TreeNode, NavType } from '../types/common';
import { NAV_LIST } from '../constants/nav';

interface CommonState {
  // 사용자
  userInfo: UserType | null;
  sysInfos: SysType[];

  // 네비게이션
  selectNav: NavType;

  // 권한
  areaRoles: ZnType[];
  eventRoles: KeyValueType[];

  // 트리 (필터 UI용)
  areaNodes: TreeNode[];
  eventNodes: TreeNode[];

  // 역할 초기화 트리거 ('default' → 초기화 실행 → 'none', 'socket' → 패널 카운트 갱신)
  roleKey: 'default' | 'none' | 'socket';

  // 모달 (스케줄 화면 공용)
  modal: string;
}

interface CommonActions {
  setUserInfo: (userInfo: UserType | null) => void;
  setSysInfos: (sysInfos: SysType[]) => void;
  setSelectNav: (nav: NavType) => void;
  setAreaRoles: (roles: ZnType[]) => void;
  setEventRoles: (roles: KeyValueType[]) => void;
  setAreaNodes: (nodes: TreeNode[]) => void;
  setEventNodes: (nodes: TreeNode[]) => void;
  setRoleKey: (key: CommonState['roleKey']) => void;
  setModal: (modal: string) => void;
}

export const useCommonStore = create<CommonState & { actions: CommonActions }>()(
  immer((set) => ({
    userInfo: null,
    sysInfos: [],
    selectNav: NAV_LIST[0],
    areaRoles: [],
    eventRoles: [],
    areaNodes: [],
    eventNodes: [],
    roleKey: 'none',
    modal: 'NONE',

    actions: {
      setUserInfo: (userInfo) =>
        set((state) => { state.userInfo = userInfo; }),

      setSysInfos: (sysInfos) =>
        set((state) => { state.sysInfos = sysInfos; }),

      setSelectNav: (nav) =>
        set((state) => { state.selectNav = nav; }),

      setAreaRoles: (roles) =>
        set((state) => { state.areaRoles = roles; }),

      setEventRoles: (roles) =>
        set((state) => { state.eventRoles = roles; }),

      // ※ JSON 딥클론 후 Immer draft에 할당
      //   — Immer가 외부 배열의 nested children을 adopt할 때 발생하는
      //     finalize 이슈를 우회 (원본은 plain set({areaNodes})였음)
      setAreaNodes: (nodes) =>
        set((s) => { s.areaNodes = JSON.parse(JSON.stringify(nodes)); }),

      setEventNodes: (nodes) =>
        set((s) => { s.eventNodes = JSON.parse(JSON.stringify(nodes)); }),

      setRoleKey: (key) =>
        set((state) => { state.roleKey = key; }),

      setModal: (modal) =>
        set((state) => { state.modal = modal; }),
    },
  })),
);
