import styled from 'styled-components';
import { STAT_POI_COLOR_GRADE } from '@/component/constants/statConst';
import { ZnType } from '@/component/types/common';
import { GisStatType } from '@/component/types/stat';

interface SubEventPoiProps {
  area: ZnType;
  top: string;
  left: string;
  nm: string;
  allCnt: number;
  gisStatInfos: GisStatType[];
}

// "이어" 는 "이어제2" 오매핑 방지를 위해 exact match, 나머지는 includes
function findGisStat(gisStatInfos: GisStatType[], nm: string): GisStatType | undefined {
  if (nm === '이어') return gisStatInfos.find((i) => i.areaNm === '이어');
  return gisStatInfos.find((i) => i.areaNm.includes(nm));
}

function computeGrade(count: number, allCnt: number): number {
  if (allCnt < 10) return 0;
  return Math.min(3, Math.floor(count / (allCnt / 4)));
}

const SubEventPoi = ({
  area,
  top,
  left,
  nm,
  allCnt,
  gisStatInfos,
}: SubEventPoiProps) => {
  const count: number = findGisStat(gisStatInfos, nm)?.count ?? 0;
  const grade = computeGrade(count, allCnt);
  const bgImage = STAT_POI_COLOR_GRADE[grade];

  return (
    <StyledSubEventPoi $top={top} $left={left} $bgImage={bgImage}>
      <span className="sc-nm">{nm}</span>
      <span className="sc-cnt">{count}</span>
    </StyledSubEventPoi>
  );
};

export default SubEventPoi;

// ─── Styled Components ────────────────────────────────────────────────────────

interface StyledSubPoiProps {
  $top: string;
  $left: string;
  $bgImage: string;
}

const StyledSubEventPoi = styled.div<StyledSubPoiProps>`
  position: absolute;
  top: ${({ $top }) => $top};
  left: ${({ $left }) => $left};
  width: 68px;
  height: 68px;
  border-radius: 50%;
  background: url('${({ $bgImage }) => $bgImage}') no-repeat center / 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2px;
  z-index: 10;

  .sc-nm {
    color: #ffffff;
    font-size: 11px;
    font-weight: 500;
    line-height: 12px;
    text-align: center;
    pointer-events: none;
  }

  .sc-cnt {
    color: #ffffff;
    font-size: 16px;
    font-weight: 700;
    line-height: 16px;
    text-align: center;
    pointer-events: none;
  }
`;
