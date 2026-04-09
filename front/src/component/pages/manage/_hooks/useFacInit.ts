import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchAllFac } from '@/component/api/facApi';
import { useHomeStore } from '@/component/stores/homeStore';

/**
 * 시설물 전체 목록 초기화 훅
 * - FacSearchArea(원본)의 fac_default 초기 로드를 대체
 * - scFacs를 homeStore에 저장 → HomeSubBody 경로당 아이콘 / 패널 카운트 계산에 사용
 * - ManageRoot에서 1회 호출
 */
export const useFacInit = () => {
  const setScFacs = useHomeStore((state) => state.actions.setScFacs);

  const { data: facRes } = useQuery({
    queryKey: ['facInit'],
    queryFn: fetchAllFac,
    staleTime: Infinity,
  });

  useEffect(() => {
    if (facRes) {
      setScFacs(facRes.data);
    }
  }, [facRes]);
};
