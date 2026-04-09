import styled from 'styled-components';
import { STAT_IMAGE } from '@/component/lib/statImage';

const ChartHead = () => (
  <StyledChartHead>
    <i />
    <h3>기간 설정</h3>
  </StyledChartHead>
);

export default ChartHead;

const StyledChartHead = styled.div`
  display: flex;
  align-items: center;
  height: 56px;
  padding: 0 24px 0 22px;
  border-bottom: solid 1px #222A47;

  i {
    display: inline-block;
    width: 20px;
    height: 20px;
    margin-right: 6px;
    background: url('${STAT_IMAGE.CHART.TITLE}') no-repeat center / 100%;
  }

  h3 {
    font-size: 16px;
    font-weight: 500;
    color: #F2F4FC;
  }
`;
