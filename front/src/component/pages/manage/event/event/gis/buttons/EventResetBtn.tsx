import styled from 'styled-components';
import { useShallow } from 'zustand/react/shallow';
import { GIS_IMAGE } from '@/component/lib/constImage';
import { useEventStore } from '@/component/stores/eventStore';
import { useGisStore } from '@/component/stores/gisStore';
import { MAP_TILE_TYPE, DRAW_GIS_TYPE, GIS_RANGE_TYPE } from '@/component/constants/gisConst';

/**
 * 이벤트 GIS 초기화 버튼
 * - 줌 15 / 위성 타일 / 그리기 해제 / 반경 500m / CCTV 초기화
 * - 이벤트 패널 열림 + 첫 번째 이벤트 선택
 */
const EventResetBtn = () => {
  const {
    eventList, setSelectEvent, setIsBoxOpen,
    setHeatmap, setHeatmapOn, setHeatmapDropdownOpen,
  } = useEventStore(
    useShallow((s) => ({
      eventList:              s.eventList,
      setSelectEvent:         s.actions.setSelectEvent,
      setIsBoxOpen:           s.actions.setIsBoxOpen,
      setHeatmap:             s.actions.setHeatmap,
      setHeatmapOn:           s.actions.setHeatmapOn,
      setHeatmapDropdownOpen: s.actions.setHeatmapDropdownOpen,
    })),
  );

  const {
    setEventZoom,
    setEventMapType,
    setEventDrawType,
    setEventRadius,
    setEventRadiusCctvs,
    setEventScCctvs,
  } = useGisStore(
    useShallow((s) => ({
      setEventZoom:        s.actions.setEventZoom,
      setEventMapType:     s.actions.setEventMapType,
      setEventDrawType:    s.actions.setEventDrawType,
      setEventRadius:      s.actions.setEventRadius,
      setEventRadiusCctvs: s.actions.setEventRadiusCctvs,
      setEventScCctvs:     s.actions.setEventScCctvs,
    })),
  );

  const handleReset = () => {
    // 신 gisStore 초기화
    // ※ zoom은 selectEvent useEffect(EventGisControl)에서 처리하므로 여기서 설정하지 않음.
    //   setEventZoom(15)를 먼저 호출하면 map.getCenter()가 현재 패닝 위치라서
    //   지도가 잘못된 중심으로 이동하는 문제가 생김.
    setEventMapType(MAP_TILE_TYPE.SATELLITE);
    setEventDrawType(DRAW_GIS_TYPE.NONE);
    setEventRadius(GIS_RANGE_TYPE.SMALL);
    setEventRadiusCctvs([]);
    setEventScCctvs([]);

    // 히트맵 초기화 (드롭다운 직접 닫기 — heatmapOn 변화 여부와 무관)
    setHeatmapDropdownOpen(false);
    setHeatmapOn(false);
    setHeatmap([]);
    setIsBoxOpen(true);

    // null → value 패턴:
    //   selectEvent가 이미 eventList[0]이어도 EventGisControl의
    //   useEffect([selectEvent])를 강제 실행하여 지도 중심·줌·CCTV를 올바르게 초기화.
    //   setTimeout(0)으로 null useEffect가 먼저 완료된 뒤 value를 세팅함.
    setSelectEvent(null);
    setTimeout(() => {
      if (eventList.length > 0) setSelectEvent(eventList[0]);
      else setEventZoom(15);  // 이벤트 없을 때만 직접 줌 리셋 (중심 재설정 불가)
    }, 0);
  };

  return (
    <StyledResetBtn onClick={handleReset}>
      <i />
      초기화
    </StyledResetBtn>
  );
};

export default EventResetBtn;

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
