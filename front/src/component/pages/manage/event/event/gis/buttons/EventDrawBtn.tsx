import styled from 'styled-components';
import { useShallow } from 'zustand/react/shallow';
import { GIS_IMAGE } from '@/component/lib/constImage';
import { useGisStore } from '@/component/stores/gisStore';
import { DRAW_GIS_TYPE, GIS_RANGE_TYPE, DrawGisType, GisRangeType } from '@/component/constants/gisConst';

/**
 * 이벤트 GIS 그리기 버튼 (거리 / 면적 / 반경)
 * - DRAW_GIS_TYPE.NONE: 비활성
 * - DRAW_GIS_TYPE.DISTANCE: 거리 측정
 * - DRAW_GIS_TYPE.EXTENT: 면적 측정
 * - DRAW_GIS_TYPE.CIRCLE: 반경 표시 (500m / 1km)
 */
const EventDrawBtn = () => {
  const { eventDrawType, eventRadius, setEventDrawType, setEventRadius } = useGisStore(
    useShallow((s) => ({
      eventDrawType:    s.eventDrawType,
      eventRadius:      s.eventRadius,
      setEventDrawType: s.actions.setEventDrawType,
      setEventRadius:   s.actions.setEventRadius,
    })),
  );

  const handleDraw = (type: DrawGisType) => {
    const next: DrawGisType = eventDrawType === type ? DRAW_GIS_TYPE.NONE : type;
    setEventDrawType(next);
  };

  const handleRadius = (radius: GisRangeType) => {
    setEventRadius(radius);
  };

  return (
    <StyledDrawBox>
      {/* 거리 측정 */}
      <StyledDrawDistanceBtn
        $isActive={eventDrawType === DRAW_GIS_TYPE.DISTANCE}
        onClick={() => handleDraw(DRAW_GIS_TYPE.DISTANCE)}
      />

      {/* 면적 측정 */}
      <StyledDrawAreaBtn
        $isActive={eventDrawType === DRAW_GIS_TYPE.EXTENT}
        onClick={() => handleDraw(DRAW_GIS_TYPE.EXTENT)}
      />

      {/* 반경 표시 + 크기 선택 */}
      <StyledCircleRow>
        <StyledDrawCircleBtn
          $isActive={eventDrawType === DRAW_GIS_TYPE.CIRCLE}
          onClick={() => handleDraw(DRAW_GIS_TYPE.CIRCLE)}
        />
        {eventDrawType === DRAW_GIS_TYPE.CIRCLE && (
          <StyledRadiusBtnBox>
            <StyledRadiusBtn
              $isActive={eventRadius === GIS_RANGE_TYPE.SMALL}
              onClick={() => handleRadius(GIS_RANGE_TYPE.SMALL)}
            >
              500m
            </StyledRadiusBtn>
            <StyledRadiusBtn
              $isActive={eventRadius === GIS_RANGE_TYPE.LARGE}
              onClick={() => handleRadius(GIS_RANGE_TYPE.LARGE)}
            >
              1km
            </StyledRadiusBtn>
          </StyledRadiusBtnBox>
        )}
      </StyledCircleRow>
    </StyledDrawBox>
  );
};

export default EventDrawBtn;

// ── Styled ─────────────────────────────────────────────────────

const StyledDrawBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  position: relative;
`;

const StyledDrawDistanceBtn = styled.button<{ $isActive: boolean }>`
  width: 28px;
  height: 28px;
  background-size: 100%;
  background-repeat: no-repeat;
  background-image: url('${({ $isActive }) =>
    $isActive ? GIS_IMAGE.RIGHT.DRAW.DISTANCE.ACTIVE : GIS_IMAGE.RIGHT.DRAW.DISTANCE.BASE}');

  &:hover {
    background-image: url('${({ $isActive }) =>
    $isActive ? GIS_IMAGE.RIGHT.DRAW.DISTANCE.ACTIVE_HOVER : GIS_IMAGE.RIGHT.DRAW.DISTANCE.HOVER}');
  }
`;

const StyledDrawAreaBtn = styled.button<{ $isActive: boolean }>`
  width: 28px;
  height: 28px;
  background-size: 100%;
  background-repeat: no-repeat;
  background-image: url('${({ $isActive }) =>
    $isActive ? GIS_IMAGE.RIGHT.DRAW.AREA.ACTIVE : GIS_IMAGE.RIGHT.DRAW.AREA.BASE}');

  &:hover {
    background-image: url('${({ $isActive }) =>
    $isActive ? GIS_IMAGE.RIGHT.DRAW.AREA.ACTIVE_HOVER : GIS_IMAGE.RIGHT.DRAW.AREA.HOVER}');
  }
`;

const StyledDrawCircleBtn = styled.button<{ $isActive: boolean }>`
  width: 28px;
  height: 28px;
  background-size: 100%;
  background-repeat: no-repeat;
  background-image: url('${({ $isActive }) =>
    $isActive ? GIS_IMAGE.RIGHT.DRAW.CIRCLE.ACTIVE : GIS_IMAGE.RIGHT.DRAW.CIRCLE.BASE}');

  &:hover {
    background-image: url('${({ $isActive }) =>
    $isActive ? GIS_IMAGE.RIGHT.DRAW.CIRCLE.ACTIVE_HOVER : GIS_IMAGE.RIGHT.DRAW.CIRCLE.HOVER}');
  }
`;

const StyledCircleRow = styled.div`
  position: relative;
  width: 28px;
  height: 28px;
`;

const StyledRadiusBtnBox = styled.div`
  position: absolute;
  right: calc(100% + 8px);
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  flex-direction: row;
  gap: 8px;
`;

const StyledRadiusBtn = styled.button<{ $isActive: boolean }>`
  background-color: ${({ $isActive }) => ($isActive ? '#7A45FF' : '#12172E')};
  border: 1px solid
    ${({ $isActive }) =>
    $isActive ? 'rgba(243, 239, 255, 0.80)' : 'rgba(167, 174, 207, 0.50)'};
  border-radius: 50%;
  font-weight: 500;
  font-size: 12px;
  color: #f2f4fc;
  width: 48px;
  height: 48px;
`;
