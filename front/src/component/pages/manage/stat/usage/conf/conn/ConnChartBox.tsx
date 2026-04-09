import styled from 'styled-components';
import ConnChart  from './ConnChart';
import ConnLegend from './ConnLegend';

const ConnChartBox = () => (
  <StyledBox>
    <StyledHead>
      화상회의 접속 건수
      <span>(단위: 건)</span>
    </StyledHead>
    <StyledBody>
      <ConnChart />
      <ConnLegend />
    </StyledBody>
  </StyledBox>
);

export default ConnChartBox;

const StyledBox = styled.div`
  padding: 20px 32px 24px;
  border-radius: 12px;
  border: 1px solid #2a2e54;
  background: #1a203a;

  &:nth-of-type(4) {
    grid-row: 2 / 3;
    grid-column: 3 / 4;
  }
`;

const StyledHead = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
  font-size: 16px;
  font-weight: 500;
  color: #f2f4fc;

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

  span { font-size: 11px; color: #9c9eb5; }
`;

const StyledBody = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;
