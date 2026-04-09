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

const OPER_BUCKET_COUNT = 5;

const OperLegend = () => {
  const { activeArea, operResult, subOper } = useStatStore(
    useShallow((s) => ({
      activeArea: s.activeArea,
      operResult: s.operResult,
      subOper: s.subOper,
    })),
  );

  // oper uses areaCd as the subOper key
  const allCnt: number =
    activeArea === null
      ? (operResult?.allCnt ?? 0)
      : (subOper[activeArea.areaCd]?.allCnt ?? 0);

  return (
    <StyledLegend>
      <p>범례 (건)</p>
      <StyledLegendBox>
        {allCnt > 10 ? (
          STAT_LEGEND_COLORS.oper.map((item, i) => (
            <li key={i}>
              <StyledLegendColor $border={item.border} $back={item.back} />
              <StyledLegendVal>
                {`${Math.round((allCnt / OPER_BUCKET_COUNT) * i)} ~ ${Math.round((allCnt / OPER_BUCKET_COUNT) * (i + 1))}`}
              </StyledLegendVal>
            </li>
          ))
        ) : (
          <li>
            <StyledLegendColor
              $border={STAT_LEGEND_COLORS.oper[0].border}
              $back={STAT_LEGEND_COLORS.oper[0].back}
            />
            <StyledLegendVal>0 ~ 10</StyledLegendVal>
          </li>
        )}
      </StyledLegendBox>
    </StyledLegend>
  );
};

export default OperLegend;

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
