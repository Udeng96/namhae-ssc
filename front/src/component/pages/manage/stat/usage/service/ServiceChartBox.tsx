import styled from 'styled-components';
import ServiceChart from './ServiceChart';

const ServiceChartBox = () => (
  <StyledBox>
    <StyledHead>
      <h3>서비스 이용 통계 <span>(단위:건)</span></h3>
    </StyledHead>
    <ServiceChart />
  </StyledBox>
);

export default ServiceChartBox;

const StyledBox = styled.div`
  padding: 20px 32px 24px;
  border-radius: 12px;
  border: 1px solid #2a2e54;
  background: #1a203a;
`;

const StyledHead = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;

  &::before {
    content: '';
    display: block;
    position: absolute;
    left: -33px;
    width: 4px;
    height: 17px;
    border-radius: 0 2px 2px 0;
    background: linear-gradient(180deg, #7f7aff, #681ceb);
    box-shadow: 4px 0 5px 0 rgba(111, 57, 241, 0.33);
  }

  h3 {
    display: flex;
    align-items: center;
    font-size: 16px;
    font-weight: 500;
    color: #f2f4fc;

    span { text-align: right; font-size: 11px; color: #9c9eb5; padding-left: 6px; }
  }
`;
