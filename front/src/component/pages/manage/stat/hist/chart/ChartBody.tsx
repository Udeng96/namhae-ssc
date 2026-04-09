import styled from 'styled-components';
import { useShallow } from 'zustand/react/shallow';
import { STAT_TYPE } from '@/component/constants/statConst';
import { useStatStore } from '@/component/stores/statStore';
import DateBox from '@/component/pages/manage/stat/hist/chart/box/DateBox';

import DateChartBox     from './box/chartBox/event/box/DateChartBox';
import BellChartBox     from './box/chartBox/event/box/BellChartBox';
import ScChartBox       from './box/chartBox/event/box/ScChartBox';
import FacDateChartBox  from './box/chartBox/fac/box/FacDateChartBox';
import TypeChartBox     from './box/chartBox/fac/box/TypeChartBox';
import FacScChartBox    from './box/chartBox/fac/box/FacScChartBox';
import OperDateChartBox from './box/chartBox/oper/box/OperDateChartBox';
import OperTypeChartBox from './box/chartBox/oper/box/OperTypeChartBox';
import OperAreaChartBox from './box/chartBox/oper/box/OperAreaChartBox';

const ChartBody = () => {
  const { activeTab, activeArea, eventResult, facResult, operResult, subEvent, subFac, subOper } =
    useStatStore(
      useShallow((s) => ({
        activeTab:   s.activeTab,
        activeArea:  s.activeArea,
        eventResult: s.eventResult,
        facResult:   s.facResult,
        operResult:  s.operResult,
        subEvent:    s.subEvent,
        subFac:      s.subFac,
        subOper:     s.subOper,
      })),
    );

  // 지역 선택 시 sub 데이터 우선, 없으면 전체 결과 사용
  const subEventResult = activeArea ? (subEvent[activeArea.znCd]  ?? null) : null;
  const subFacResult   = activeArea ? (subFac[activeArea.znCd]    ?? null) : null;
  const subOperResult  = activeArea ? (subOper[activeArea.areaCd] ?? null) : null;

  const eventData = subEventResult ?? eventResult;
  const facData   = subFacResult   ?? facResult;
  const operData  = subOperResult  ?? operResult;

  return (
    <StyledBody>
      <DateBox />

      {/* ── 이벤트 탭 ── */}
      {activeTab === STAT_TYPE.EVENT.id && (
        <>
          <DateChartBox dateList={eventData?.eventDateStats ?? []} />
          <BellChartBox bellList={eventData?.eventBellStats ?? []} />
          <ScChartBox   scList={eventData?.eventScStats    ?? []} isAreaSelected={!!activeArea} />
        </>
      )}

      {/* ── 시설물 탭 ── */}
      {activeTab === STAT_TYPE.FAC.id && (
        <>
          <FacDateChartBox dateList={facData?.facDateStats ?? []} />
          <TypeChartBox    facList={facData?.facTypeStats  ?? []} />
          <FacScChartBox   scList={facData?.facScStats     ?? []} isAreaSelected={!!activeArea} />
        </>
      )}

      {/* ── 가동률 탭 ── */}
      {activeTab === STAT_TYPE.OPERATE.id && (
        <>
          <OperDateChartBox dateList={operData?.dateStats       ?? []} />
          <OperTypeChartBox facTypeList={operData?.facTypeStats ?? []} />
          <OperAreaChartBox timeList={operData?.timeStats       ?? []} />
        </>
      )}
    </StyledBody>
  );
};

export default ChartBody;

const StyledBody = styled.div`
  display: flex;
  flex-direction: column;
  padding: 16px;
  gap: 16px;

  & > *:nth-child(2) {
    margin-top: 8px;
  }
`;
