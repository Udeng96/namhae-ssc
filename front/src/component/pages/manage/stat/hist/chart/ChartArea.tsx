import styled from 'styled-components';
import ChartHead from '@/component/pages/manage/stat/hist/chart/ChartHead';
import ChartBody from '@/component/pages/manage/stat/hist/chart/ChartBody';

const ChartArea = () => (
  <StyledChartArea>
    <ChartHead />
    <ChartBody />
  </StyledChartArea>
);

export default ChartArea;

const StyledChartArea = styled.div`
  width: 530px;
  height: 962px;
  border-radius: 16px;
  border: 1px solid #222A47;
  background: #12172E;
  box-shadow: 0 6px 8px 0 rgba(0, 0, 0, 0.16);
`;
