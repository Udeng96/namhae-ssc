import styled from 'styled-components';

import UsageDateBox     from '@/component/pages/manage/stat/usage/UsageDateBox';
import ServiceChartBox  from './service/ServiceChartBox';
import VisitorChartBox  from './visitor/VisitorChartBox';
import OpenChartBox     from './conf/open/OpenChartBox';
import ConnChartBox     from './conf/conn/ConnChartBox';
import ContentsChartBox from './contents/ContentsChartBox';

const UsageArea = () => (
  <StyledUsageArea>
    <UsageDateBox />
    <StyledUsageChartBox>
      <ServiceChartBox />
      <VisitorChartBox />
      <OpenChartBox />
      <ConnChartBox />
      <ContentsChartBox />
    </StyledUsageChartBox>
  </StyledUsageArea>
);

export default UsageArea;

const StyledUsageArea = styled.div`
  width: 1412px;
  height: 894px;
  border-radius: 16px;
  border: 1px solid #222A47;
  background: #12172E;
  position: relative;
  bottom: -78px;
`;

const StyledUsageChartBox = styled.div`
  display: grid;
  grid-template-rows: 250px 234px 276px;
  grid-template-columns: 490px 220px 1fr;
  gap: 16px;
  padding: 16px;
`;
