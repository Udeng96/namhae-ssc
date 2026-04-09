import styled from 'styled-components';
import CctvEnd from '@/component/pages/manage/_gis/cctv/CctvEnd';
import EventGisMap      from './EventGisMap';
// 이벤트 전용 리팩 버튼
import EventResetBtn    from './buttons/EventResetBtn';
import EventHeatmapBtn  from './buttons/EventHeatmapBtn';
import EventTileBtn     from './buttons/EventTileBtn';
import EventZoomBtn     from './buttons/EventZoomBtn';
import EventDrawBtn     from './buttons/EventDrawBtn';

/**
 * 이벤트 GIS 래퍼
 * - 이벤트 페이지는 우측 패널이 없으므로 버튼 위치 고정
 *   (구 버전도 event 탭에서는 TopBtns/RightBtns 오프셋 미적용 — FAC stateOpen 전용이었음)
 * - 상단 우측: 초기화 · 히트맵 · 타일 전환
 * - 우측: 줌인/줌아웃 · 그리기(거리·면적·반경)
 */
const EventGisBox = () => (
  <StyledGis>
    <EventGisMap />
    <CctvEnd />

    {/* 상단 우측: 초기화 · 히트맵 · 타일 전환 */}
    <StyledTopBtns>
      <EventResetBtn />
      <EventHeatmapBtn />
      <EventTileBtn />
    </StyledTopBtns>

    {/* 우측: 줌인/아웃 · 그리기 */}
    <StyledRightBtns>
      <EventZoomBtn />
      <EventDrawBtn />
    </StyledRightBtns>
  </StyledGis>
);

export default EventGisBox;

// ── Styled ────────────────────────────────────────────────────────

const StyledGis = styled.div`
  position: relative;
  width: 100%;
  height: 1032px;
  top: 0;
  background-color: #fff;
`;

/* 구 topBtns.tsx의 EVENT 탭 기준: right: 63px 고정 (FAC stateOpen 오프셋 미적용) */
const StyledTopBtns = styled.div`
  display: flex;
  align-items: center;
  gap: 0 4px;
  position: absolute;
  top: 22px;
  right: 63px;
  z-index: 500;
`;

/* 구 rightBtns.tsx의 EVENT 탭 기준: right: 23px 고정 */
const StyledRightBtns = styled.div`
  position: absolute;
  top: 22px;
  right: 23px;
  z-index: 500;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;
