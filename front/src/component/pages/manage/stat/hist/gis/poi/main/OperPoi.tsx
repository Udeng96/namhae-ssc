import styled from 'styled-components';
import { useShallow } from 'zustand/react/shallow';
import { useStatStore } from '@/component/stores/statStore';
import {
  STAT_POI_OPER_COLOR_GRADE,
  STAT_POI_OPER_COLOR_HOVER_GRADE,
  STAT_HOVER_MAP,
} from '@/component/constants/statConst';
import { ZnType } from '@/component/types/common';
import { GisStatType } from '@/component/types/stat';

interface OperPoiProps {
  area: ZnType;
  top: string;
  left: string;
  hoverTop: string;
  hoverLeft: string;
}

function computeGrade(count: number, allCnt: number): number {
  if (allCnt < 10) return 0;
  return Math.min(4, Math.floor(count / (allCnt / 5)));
}

const OperPoi = ({ area, top, left, hoverTop, hoverLeft }: OperPoiProps) => {
  const { hoverArea, operResult, setHoverArea, setActiveArea } = useStatStore(
    useShallow((s) => ({
      hoverArea: s.hoverArea,
      operResult: s.operResult,
      setHoverArea: s.actions.setHoverArea,
      setActiveArea: s.actions.setActiveArea,
    })),
  );

  const gisStats: GisStatType[] = operResult?.gisStats ?? [];
  const allCnt: number = operResult?.allCnt ?? 0;
  // oper uses area.areaCd (not znCd) for matching
  const cnt: number = gisStats.find((i) => i.areaCd === area.areaCd)?.count ?? 0;
  const grade = computeGrade(cnt, allCnt);

  const isHovered = hoverArea?.znCd === area.znCd;
  const bgImage = isHovered
    ? STAT_POI_OPER_COLOR_HOVER_GRADE[grade]
    : STAT_POI_OPER_COLOR_GRADE[grade];

  const hoverMapSrc: string | undefined = STAT_HOVER_MAP[area.znCd];

  return (
    <StyledPoiWrapper $top={top} $left={left}>
      {isHovered && hoverMapSrc && (
        <StyledHoverMap
          $src={hoverMapSrc}
          $top={hoverTop}
          $left={hoverLeft}
        />
      )}
      <StyledOperPoi
        $bgImage={bgImage}
        onMouseEnter={() => setHoverArea(area)}
        onMouseLeave={() => setHoverArea(null)}
        onClick={() => setActiveArea(area)}
      >
        <span className="zn-nm">{area.znNm}</span>
        <span className="zn-cnt">{cnt}</span>
      </StyledOperPoi>
    </StyledPoiWrapper>
  );
};

export default OperPoi;

// ─── Styled Components ────────────────────────────────────────────────────────

interface StyledWrapperProps {
  $top: string;
  $left: string;
}

const StyledPoiWrapper = styled.div<StyledWrapperProps>`
  position: absolute;
  top: ${({ $top }) => $top};
  left: ${({ $left }) => $left};
  width: 0;
  height: 0;
`;

interface StyledPoiProps {
  $bgImage: string;
}

const StyledOperPoi = styled.button<StyledPoiProps>`
  position: absolute;
  top:43px;
  left: 31px;
  width: 68px;
  height: 68px;
  border-radius: 50%;
  background: url('${({ $bgImage }) => $bgImage}') no-repeat center / 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border: none;
  padding: 0;
  z-index: 1;

  .zn-nm {
    color: #ffffff;
    font-size: 11px;
    font-weight: 600;
    line-height: 1.2;
    text-align: center;
    pointer-events: none;
  }

  .zn-cnt {
    color: #ffffff;
    font-size: 13px;
    font-weight: 700;
    line-height: 1.2;
    text-align: center;
    pointer-events: none;
  }
`;

interface StyledHoverMapProps {
  $src: string;
  $top: string;
  $left: string;
}

const StyledHoverMap = styled.div<StyledHoverMapProps>`
  position: absolute;
  top: ${({ $top }) => $top};
  left: ${({ $left }) => $left};
  width: 316px;
  height: 291px;
  background-image: url('${({ $src }) => $src}');
  background-repeat: no-repeat;
  pointer-events: none;
  z-index: 0;
`;
