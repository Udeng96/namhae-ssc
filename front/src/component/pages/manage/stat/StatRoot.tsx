import styled from 'styled-components';
import { useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useShallow } from 'zustand/react/shallow';

import { CommonContainer } from '@/component/lib/css';
import { STAT_TYPE } from '@/component/constants/statConst';
import { useStatStore } from '@/component/stores/statStore';
import { useEventStore } from '@/component/stores/eventStore';
import { fetchEventStat, fetchFacStat, fetchOperStat, fetchUsageStat } from '@/component/api/statApi';

import SortMenu from '@/component/pages/manage/stat/common/SortMenu';
import CntArea  from '@/component/pages/manage/stat/common/cnt/CntArea';
import GisArea  from '@/component/pages/manage/stat/hist/gis/GisArea';
import ChartArea from '@/component/pages/manage/stat/hist/chart/ChartArea';
import UsageArea from '@/component/pages/manage/stat/usage/UsageArea';

/**
 * StatRoot (refac)
 *
 * 개선 포인트:
 *  - requestState 9-state 머신 제거 → React Query queryKey 기반
 *  - 병렬 배열(subEventKey[], subEventStats[]) → Record<znCd, Result> O(1)
 *  - 50+ 스토어 setter → 12개 액션
 */
const StatRoot = ({ isShow }: { isShow: boolean }) => {
  const queryClient = useQueryClient();
  const wsEvent = useEventStore((s) => s.wsEvent);

  const {
    activeTab,
    startDtm,
    endDtm,
    activeArea,
    setEventResult,
    setFacResult,
    setOperResult,
    setUsageResult,
    setSubEvent,
    setSubFac,
    setSubOper,
  } = useStatStore(
    useShallow((s) => ({
      activeTab:       s.activeTab,
      startDtm:        s.startDtm,
      endDtm:          s.endDtm,
      activeArea:      s.activeArea,
      setEventResult:  s.actions.setEventResult,
      setFacResult:    s.actions.setFacResult,
      setOperResult:   s.actions.setOperResult,
      setUsageResult:  s.actions.setUsageResult,
      setSubEvent:     s.actions.setSubEvent,
      setSubFac:       s.actions.setSubFac,
      setSubOper:      s.actions.setSubOper,
    })),
  );

  // WS 이벤트 수신 시 통계 event 캐시 무효화 (오늘이 조회 범위에 포함될 때)
  useEffect(() => {
    if (!wsEvent) return;
    const today = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    if (startDtm <= today && endDtm >= today) {
      queryClient.invalidateQueries({ queryKey: ['stat', 'event'] });
    }
  }, [wsEvent]);

  // queryKey 에 activeArea?.znCd 포함 → 클릭 시 자동 재조회
  const areaKey = activeArea?.znCd ?? '';

  const { data: eventData, isFetching: eventFetching } = useQuery({
    queryKey: ['stat', 'event', startDtm, endDtm, areaKey],
    queryFn:  () => fetchEventStat({ startDtm, endDtm, area: areaKey }),
    enabled:  activeTab === STAT_TYPE.EVENT.id && !!startDtm && !!endDtm,
    staleTime: 1000 * 60 * 3,
  });

  const { data: facData, isFetching: facFetching } = useQuery({
    queryKey: ['stat', 'fac', startDtm, endDtm, areaKey],
    queryFn:  () => fetchFacStat({ startDtm, endDtm, area: areaKey }),
    enabled:  activeTab === STAT_TYPE.FAC.id && !!startDtm && !!endDtm,
    staleTime: 1000 * 60 * 3,
  });

  // oper 는 areaCd 기준
  const operAreaKey = activeArea?.areaCd ?? '';
  const { data: operData, isFetching: operFetching } = useQuery({
    queryKey: ['stat', 'oper', startDtm, endDtm, operAreaKey],
    queryFn:  () => fetchOperStat({ startDtm, endDtm, area: operAreaKey }),
    enabled:  activeTab === STAT_TYPE.OPERATE.id && !!startDtm && !!endDtm,
    staleTime: 1000 * 60 * 3,
  });

  const { data: usageData, isFetching: usageFetching } = useQuery({
    queryKey: ['stat', 'usage', startDtm, endDtm],
    queryFn:  () => fetchUsageStat({ startDtm, endDtm }),
    enabled:  activeTab === STAT_TYPE.USAGE.id && !!startDtm && !!endDtm,
    staleTime: Infinity,
  });

  // ── 결과 → 스토어 반영 ───────────────────────────────
  useEffect(() => {
    if (!eventData?.data) return;
    if (areaKey === '') setEventResult(eventData.data);
    else setSubEvent(areaKey, eventData.data);
  }, [eventData]);

  useEffect(() => {
    if (!facData?.data) return;
    if (areaKey === '') setFacResult(facData.data);
    else setSubFac(areaKey, facData.data);
  }, [facData]);

  useEffect(() => {
    if (!operData?.data) return;
    if (operAreaKey === '') setOperResult(operData.data);
    else setSubOper(operAreaKey, operData.data);
  }, [operData]);

  useEffect(() => {
    if (usageData?.data) setUsageResult(usageData.data);
  }, [usageData]);

  const isLoading = eventFetching || facFetching || operFetching || usageFetching;

  return (
    <StyledStat $isShow={isShow}>
      {isLoading && <StyledSpinner />}
      <SortMenu />
      <CntArea />
      {activeTab !== STAT_TYPE.USAGE.id && (
        <>
          <GisArea />
          <ChartArea />
        </>
      )}
      {activeTab === STAT_TYPE.USAGE.id && <UsageArea />}
    </StyledStat>
  );
};

export default StatRoot;

const StyledStat = styled.section<{ $isShow: boolean }>`
  ${CommonContainer};
  display: ${({ $isShow }) => ($isShow ? 'flex' : 'none')};
  justify-content: space-between;
  padding: 32px 32px 38px 32px;
`;

const StyledSpinner = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  background: rgba(15, 18, 35, 0.6);

  &::after {
    content: '';
    width: 48px;
    height: 48px;
    border: 4px solid rgba(127, 122, 255, 0.3);
    border-top-color: #7f7aff;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;
