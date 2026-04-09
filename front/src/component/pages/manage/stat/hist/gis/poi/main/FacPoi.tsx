import styled from 'styled-components';
import { useShallow } from 'zustand/react/shallow';
import { useStatStore } from '@/component/stores/statStore';
import {
  STAT_POI_FAC_COLOR_GRADE,
  STAT_POI_FAC_COLOR_HOVER_GRADE,
  STAT_HOVER_MAP,
} from '@/component/constants/statConst';
import { ZnType } from '@/component/types/common';
import { GisStatType } from '@/component/types/stat';

interface FacPoiProps {
  area: ZnType;
  top: string;
  left: string;
  hoverTop: string;
  hoverLeft: string;
}

function computeGrade(count: number, allCnt: number): number {
  if (allCnt < 10) return 0;
  return Math.min(3, Math.floor(count / (allCnt / 4)));
}

const FacPoi = ({ area, top, left, hoverTop, hoverLeft }: FacPoiProps) => {
  const { hoverArea, facResult, setHoverArea, setActiveArea } = useStatStore(
    useShallow((s) => ({
      hoverArea: s.hoverArea,
      facResult: s.facResult,
      setHoverArea: s.actions.setHoverArea,
      setActiveArea: s.actions.setActiveArea,
    })),
  );

  const gisStats: GisStatType[] = facResult?.gisStats ?? [];
  const allCnt: number = facResult?.allCnt ?? 0;
  const cnt: number = gisStats.find((i) => i.areaCd === area.znCd)?.count ?? 0;
  const grade = computeGrade(cnt, allCnt);

  const isHovered = hoverArea?.znCd === area.znCd;
  const bgImage = isHovered
    ? STAT_POI_FAC_COLOR_HOVER_GRADE[grade]
    : STAT_POI_FAC_COLOR_GRADE[grade];

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
      <StyledFacPoi
        $bgImage={bgImage}
        onMouseEnter={() => setHoverArea(area)}
        onMouseLeave={() => setHoverArea(null)}
        onClick={() => setActiveArea(area)}
      >
        <span className="zn-nm">{area.znNm}</span>
        <span className="zn-cnt">{cnt}</span>
      </StyledFacPoi>
    </StyledPoiWrapper>
  );
};

export default FacPoi;

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

const StyledFacPoi = styled.button<StyledPoiProps>`
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
