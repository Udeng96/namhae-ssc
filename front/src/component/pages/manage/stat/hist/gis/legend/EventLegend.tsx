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

const EventLegend = () => {
  const { activeArea, eventResult, subEvent } = useStatStore(
    useShallow((s) => ({
      activeArea: s.activeArea,
      eventResult: s.eventResult,
      subEvent: s.subEvent,
    })),
  );

  const allCnt: number =
    activeArea === null
      ? (eventResult?.allCnt ?? 0)
      : (subEvent[activeArea.znCd]?.allCnt ?? 0);

  return (
    <StyledLegend>
      <p>범례 (건)</p>
      <StyledLegendBox>
        {allCnt > 10 ? (
          STAT_LEGEND_COLORS.event.map((item, i) => (
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
              $border={STAT_LEGEND_COLORS.event[0].border}
              $back={STAT_LEGEND_COLORS.event[0].back}
            />
            <StyledLegendVal>0 ~ 10</StyledLegendVal>
          </li>
        )}
      </StyledLegendBox>
    </StyledLegend>
  );
};

export default EventLegend;

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
