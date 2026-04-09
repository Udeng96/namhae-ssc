import styled from 'styled-components';
import { useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useShallow } from 'zustand/react/shallow';
import { useFacStore } from '@/component/stores/facStore';
import { useCommonStore } from '@/component/stores/commonStore';
import { useHomeStore } from '@/component/stores/homeStore';
import { useStatStore } from '@/component/stores/statStore';
import { fetchFacList } from '@/component/api/facApi';
import { WHOLE_AREA_CODE } from '@/component/constants/facConst';
import { useFacWs } from '../_hooks/useFacWs';
import FacGisBox from './gis/FacGisBox';
import FacList from './list/FacList';
import FacState from './state/FacState';
import FacToast from './FacToast';

interface Props { isShow: boolean; }

const FacRoot = ({ isShow }: Props) => {
  useFacWs();

  const {
    wsData,
    crimeCctvs,
    scCctvs,
    setWsData,
  } = useFacStore(
    useShallow((state) => ({
      wsData:     state.wsData,
      crimeCctvs: state.crimeCctvs,
      scCctvs:    state.scCctvs,
      setWsData:  state.actions.setWsData,
    })),
  );

  const setIsVisible = useFacStore((state) => state.actions.setIsVisible);
  const setRoleKey   = useCommonStore((state) => state.actions.setRoleKey);
  const setScFacs    = useHomeStore((state) => state.actions.setScFacs);
  const { startDtm, endDtm } = useStatStore(
    useShallow((s) => ({ startDtm: s.startDtm, endDtm: s.endDtm })),
  );
  const queryClient  = useQueryClient();

  // FAC 탭 표시 전환 시 Leaflet invalidateSize 트리거
  useEffect(() => {
    setIsVisible(isShow);
  }, [isShow]);

  // ─── 소켓 업데이트용 전체 조회 ───────────────────────
  const { data: wsRes, refetch: wsRefetch } = useQuery({
    queryKey: ['facListSocket'],
    queryFn: () => fetchFacList({ areaCd: WHOLE_AREA_CODE, centerName: '', sortType: 'default' }),
    enabled: false,
  });

  // wsData 수신 → 전체 조회 트리거
  useEffect(() => {
    if (wsData) {
      wsRefetch();
      setRoleKey('socket');

      // 통계 날짜 범위에 오늘이 포함되면 시설물 통계 캐시 무효화
      const today = new Date().toISOString().slice(0, 10).replace(/-/g, '');
      if (startDtm <= today && endDtm >= today) {
        queryClient.invalidateQueries({ queryKey: ['stat', 'fac'] });
      }
    }
  }, [wsData]);

  // 소켓 조회 결과 → scFacs 업데이트 + 현재 검색 조건으로 facList 재조회 트리거
  useEffect(() => {
    if (!wsRes?.data) return;
    setScFacs(wsRes.data);                                          // 전체 목록 → Home 패널용
    queryClient.invalidateQueries({ queryKey: ['facList'] });       // 현재 검색 조건으로 재조회
    setWsData(null);
  }, [wsRes]);

  const isLoading = crimeCctvs.length === 0 || scCctvs.length === 0;

  return (
    <StyledFac $isShow={isShow}>
      {isLoading && <StyledSpinner />}
      <FacGisBox />
      <FacList />
      <FacState />
      <FacToast />
    </StyledFac>
  );
};

export default FacRoot;

const StyledFac = styled.section<{ $isShow: boolean }>`
  display: ${({ $isShow }) => ($isShow ? 'block' : 'none')};
  position: relative;
  width: 100%;
  height: 100%;
`;

// 간단한 로딩 스피너 (원본 Spinner 컴포넌트와 동일한 역할)
const StyledSpinner = styled.div`
  position: absolute;
  inset: 0;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(15, 18, 35, 0.8);
`;
