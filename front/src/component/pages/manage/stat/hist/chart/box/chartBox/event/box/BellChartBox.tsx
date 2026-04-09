import styled from 'styled-components';
import { CommonChartBox } from '@/component/lib/css';
import { EventStatBell } from '@/component/types/stat';
import BellLegend from '../legend/BellLegend';
import BellChart  from '../chart/BellChart';

const BellChartBox = ({ bellList }: { bellList: EventStatBell[] }) => (
  <StyledBox>
    <h3>지역별 비상벨 이벤트 통계</h3>
    <div>
      <BellLegend />
      <BellChart subBell={bellList} />
    </div>
  </StyledBox>
);

export default BellChartBox;

const StyledBox = styled.div`
  ${CommonChartBox}
`;
