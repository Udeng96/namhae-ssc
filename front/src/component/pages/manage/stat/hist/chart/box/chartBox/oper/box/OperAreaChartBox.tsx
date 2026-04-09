import styled from 'styled-components';
import { CommonChartBox } from '@/component/lib/css';
import { OperTimeResult } from '@/component/types/stat';
import OperAreaLegend from '../legend/OperAreaLegend';
import OperAreaChart  from '../chart/OperAreaChart';

const OperAreaChartBox = ({ timeList }: { timeList: OperTimeResult[] }) => (
  <StyledBox>
    <h3>지역별 평균 가동시간</h3>
    <div>
      <OperAreaLegend />
      <OperAreaChart timeList={timeList} />
    </div>
  </StyledBox>
);

export default OperAreaChartBox;

const StyledBox = styled.div`
  ${CommonChartBox}
`;
