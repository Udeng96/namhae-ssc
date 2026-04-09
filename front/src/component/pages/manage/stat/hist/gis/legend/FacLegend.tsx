import styled from 'styled-components';
import { useShallow } from 'zustand/react/shallow';
import { useStatStore } from '@/component/stores/statStore';
import { STAT_LEGEND_COLORS } from '@/component/constants/statConst';
import {
  CommonLegend,
  CommonLegendBox,
  CommonLegendColor,
  CommonLegendVal,
} from '@/component/lib/css';

const FacLegend = () => {
  const { activeArea, facResult, subFac } = useStatStore(
    useShallow((s) => ({
      activeArea: s.activeArea,
      facResult: s.facResult,
      subFac: s.subFac,
    })),
  );

  const allCnt: number =
    activeArea === null
      ? (facResult?.allCnt ?? 0)
      : (subFac[activeArea.znCd]?.allCnt ?? 0);

  return (
    <StyledLegend>
      <p>범례 (건)</p>
      <StyledLegendBox>
        {allCnt > 10 ? (
          STAT_LEGEND_COLORS.fac.map((item, i) => (
            <li key={i}>
              <StyledLegendColor $border={item.border} $back={item.back} />
              <StyledLegendVal>
                {`${Math.round((allCnt / 4) * i)} ~ ${Math.round((allCnt / 4) * (i + 1))}`}
              </StyledLegendVal>
            </li>
          ))
        ) : (
          <li>
            <StyledLegendColor
              $border={STAT_LEGEND_COLORS.fac[0].border}
              $back={STAT_LEGEND_COLORS.fac[0].back}
            />
            <StyledLegendVal>0 ~ 10</StyledLegendVal>
          </li>
        )}
      </StyledLegendBox>
    </StyledLegend>
  );
};

export default FacLegend;

// ─── Styled Components ────────────────────────────────────────────────────────

const StyledLegend = styled.div`
  ${CommonLegend}
`;

const StyledLegendBox = styled.ul`
  ${CommonLegendBox}
`;

interface StyledLegendColorProps {
  $border: string;
  $back: string;
}

const StyledLegendColor = styled.span<StyledLegendColorProps>`
  ${CommonLegendColor}
  border-color: ${({ $border }) => $border};
  background-color: ${({ $back }) => $back};
`;

const StyledLegendVal = styled.span`
  ${CommonLegendVal}
`;
