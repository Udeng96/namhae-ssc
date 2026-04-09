import styled from 'styled-components';
import { useShallow } from 'zustand/react/shallow';
import { GIS_IMAGE } from '@/component/lib/constImage';
import { useGisStore } from '@/component/stores/gisStore';
import { DRAW_GIS_TYPE, DrawGisType } from '@/component/constants/gisConst';

/**
 * 시설 GIS 그리기 버튼 (거리 / 면적)
 * - 시설 페이지는 반경(CIRCLE) 기능 없음
 * - DRAW_GIS_TYPE.NONE: 비활성
 * - DRAW_GIS_TYPE.DISTANCE: 거리 측정
 * - DRAW_GIS_TYPE.EXTENT: 면적 측정
 */
const FacDrawBtn = () => {
  const { facDrawType, setFacDrawType } = useGisStore(
    useShallow((s) => ({
      facDrawType:    s.facDrawType,
      setFacDrawType: s.actions.setFacDrawType,
    })),
  );

  const handleDraw = (type: DrawGisType) => {
    const next: DrawGisType = facDrawType === type ? DRAW_GIS_TYPE.NONE : type;
    setFacDrawType(next);
  };

  return (
    <StyledDrawBox>
      {/* 거리 측정 */}
      <StyledDrawDistanceBtn
        $isActive={facDrawType === DRAW_GIS_TYPE.DISTANCE}
        onClick={() => handleDraw(DRAW_GIS_TYPE.DISTANCE)}
      />

      {/* 면적 측정 */}
      <StyledDrawAreaBtn
        $isActive={facDrawType === DRAW_GIS_TYPE.EXTENT}
        onClick={() => handleDraw(DRAW_GIS_TYPE.EXTENT)}
      />
    </StyledDrawBox>
  );
};

export default FacDrawBtn;

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
