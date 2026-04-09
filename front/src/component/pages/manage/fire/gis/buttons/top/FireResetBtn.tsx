import styled from 'styled-components';
import { useShallow } from 'zustand/react/shallow';
import { GIS_IMAGE } from '@/component/lib/constImage';
import { useFireStore } from '@/component/stores/fireStore';
import { useFireGisStore } from '@/component/stores/fireGisStore';
import { MAP_TILE_TYPE, DRAW_GIS_TYPE, GIS_RANGE_TYPE } from '@/component/constants/gisConst';

/**
 * 소방 GIS 초기화 버튼
 * - 위성 타일 / 그리기 해제 / 반경 500m / 히트맵 초기화
 * - 이벤트 박스 열림 + 첫 번째 이벤트 선택
 */
const FireResetBtn = () => {
  const { eventList, setSelectEvent, setIsBoxOpen } = useFireStore(
    useShallow((s) => ({
      eventList:      s.eventList,
      setSelectEvent: s.actions.setSelectEvent,
      setIsBoxOpen:   s.actions.setIsBoxOpen,
    })),
  );

  const {
    setEventMapType,
    setEventDrawType,
    setEventRadius,
    setEventRadiusCctvs,
    setEventScCctvs,
    setEventHeatmap,
    setEventHeatmapOn,
  } = useFireGisStore(
    useShallow((s) => ({
      setEventMapType:     s.actions.setEventMapType,
      setEventDrawType:    s.actions.setEventDrawType,
      setEventRadius:      s.actions.setEventRadius,
      setEventRadiusCctvs: s.actions.setEventRadiusCctvs,
      setEventScCctvs:     s.actions.setEventScCctvs,
      setEventHeatmap:     s.actions.setEventHeatmap,
      setEventHeatmapOn:   s.actions.setEventHeatmapOn,
    })),
  );

  const handleReset = () => {
    setEventMapType(MAP_TILE_TYPE.SATELLITE);
    setEventDrawType(DRAW_GIS_TYPE.NONE);
    setEventRadius(GIS_RANGE_TYPE.SMALL);
    setEventRadiusCctvs([]);
    setEventScCctvs([]);
    setEventHeatmap([]);
    setEventHeatmapOn(false);
    setIsBoxOpen(true);

    // null → value 패턴: EventGisControl의 useEffect([selectEvent])를 강제 재실행
    setSelectEvent(null);
    setTimeout(() => {
      if (eventList.length > 0) setSelectEvent(eventList[0]);
    }, 0);
  };

  return (
    <StyledResetBtn onClick={handleReset}>
      <i />
      초기화
    </StyledResetBtn>
  );
};

export default FireResetBtn;

const StyledResetBtn = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  width: 98px;
  height: 40px;
  border-radius: 8px;
  background: #12172e;
  border: 1px solid #090a14;
  cursor: pointer;
  font-weight: 500;
  font-size: 14px;
  color: #f2f4fc;

  i {
    display: inline-block;
    width: 18px;
    height: 18px;
    margin-right: 4px;
    background-size: 100%;
    background-image: url('${GIS_IMAGE.TOP.RESET.BASE}');
  }

  &:hover {
    color: #7a45ff;
    border-color: #543faf;

    i {
      background-image: url('${GIS_IMAGE.TOP.RESET.HOVER}');
    }
  }
`;
