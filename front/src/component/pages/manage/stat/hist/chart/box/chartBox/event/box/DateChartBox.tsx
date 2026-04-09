import styled from 'styled-components';
import { CommonChartBox } from '@/component/lib/css';
import { EventStatDate } from '@/component/types/stat';
import DateLegend from '../legend/DateLegend';
import DateChart  from '../chart/DateChart';

const DateChartBox = ({ dateList }: { dateList: EventStatDate[] }) => (
  <StyledBox>
    <h3>전체 이벤트 통계</h3>
    <div>
      <DateLegend />
      <DateChart subDate={dateList} />
    </div>
  </StyledBox>
);

export default DateChartBox;

const StyledBox = styled.div`
  ${CommonChartBox}
`;
