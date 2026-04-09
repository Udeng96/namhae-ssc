import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useShallow } from 'zustand/react/shallow';
import { fetchRoles } from '@/component/api/userApi';
import { useCommonStore } from '@/component/stores/commonStore';
import { useEventStore } from '@/component/stores/eventStore';
import { useFireStore } from '@/component/stores/fireStore';
import { TreeNode } from '@/component/types/common';
import { WHOLE_OPTION } from '@/component/constants/eventCode';
import { USER_TYPE } from '@/component/constants/user';

/**
 * 권한 초기화 훅
 * - 역할(roles) 조회 후 이벤트/지역 필터 초기화
 * - ManageRoot에서 1회 호출
 * - queryKey에 roleKey 포함 → 'socket' 트리거 시 새 캐시 키로 강제 재조회
 */
export const useRoleInit = () => {
  const { roleKey, userInfo, setAreaRoles, setEventRoles, setAreaNodes, setEventNodes, setRoleKey } =
    useCommonStore(
      useShallow((state) => ({
        roleKey: state.roleKey,
        userInfo: state.userInfo,
        setAreaRoles: state.actions.setAreaRoles,
        setEventRoles: state.actions.setEventRoles,
        setAreaNodes: state.actions.setAreaNodes,
        setEventNodes: state.actions.setEventNodes,
        setRoleKey: state.actions.setRoleKey,
      })),
    );

  const initFilters     = useEventStore((state) => state.actions.initFilters);
  const initFireFilters = useFireStore((state) => state.actions.initFilters);

  // queryKey에 roleKey 포함 → 'default'/'socket' 각각 독립 캐시 → 항상 신선한 조회
  const { data: roles } = useQuery({
    queryKey: ['roles', roleKey],
    queryFn: fetchRoles,
    staleTime: Infinity,
    enabled: roleKey !== 'none',
  });

  useEffect(() => {
    if (!roles) return;

    // ── 지역 권한 처리 ─────────────────────────
    let areaRoles = roles.data.areaRoles;

    // 시니어 유저는 본인 지역만 (loginId 기반 필터)
    if (userInfo?.userType === USER_TYPE.SENIOR) {
      const loginId = userInfo.loginId.replace('nh', '').trim();
      if (loginId !== '400') {
        areaRoles = areaRoles.filter((item) => item.znCd === loginId);
      }
    }

    setAreaRoles(areaRoles);

    // ── 이벤트 타입 권한 처리 ──────────────────
    const eventRoles = roles.data.eventRoles;
    setEventRoles(eventRoles);

    // roleKey가 'default'일 때만 필터 초기화 (최초 1회)
    if (roleKey === 'default') {
      // 가스 센서(03) 제거
      const filteredEventRoles = eventRoles.filter((role) => role.key !== '03');
      const typeNodes: TreeNode[] = filteredEventRoles.map((role) => ({
        label: role.value,
        value: `${role.value}/${role.key}`,
      }));
      const typeOpts = [...typeNodes.map((n) => n.value), WHOLE_OPTION];

      setEventNodes([{ label: '전체', value: WHOLE_OPTION, children: typeNodes }]);

      const areaNodes: TreeNode[] = areaRoles
        .filter((item) => item.active)
        .map((item) => ({ label: item.znNm, value: `${item.znNm}/${item.znCd}` }));
      const areaOpts = [...areaNodes.map((n) => n.value), WHOLE_OPTION];

      setAreaNodes([{ label: '전체', value: WHOLE_OPTION, children: areaNodes }]);

      initFilters(typeOpts, areaOpts);
      initFireFilters(typeOpts, areaOpts);   // fireStore 필터도 동일하게 초기화
    }

    setRoleKey('none');
  }, [roles, userInfo]);
};
