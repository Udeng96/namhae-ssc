import styled from 'styled-components';
import { CommonChartBox } from '@/component/lib/css';
import { EventStatDate } from '@/component/types/stat';
import OperDateLegend from '../legend/OperDateLegend';
import OperDateChart  from '../chart/OperDateChart';

const OperDateChartBox = ({ dateList }: { dateList: EventStatDate[] }) => (
  <StyledBox>
    <h3>기간별 가동률</h3>
    <div>
      <OperDateLegend />
      <OperDateChart dateList={dateList} />
    </div>
  </StyledBox>
);

export default OperDateChartBox;

const StyledBox = styled.div`
  ${CommonChartBox}
`;
