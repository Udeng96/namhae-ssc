import styled from 'styled-components';
import ContentsChart     from './ContentsChart';
import ContentsAreaChart from './ContentsAreaChart';

const ContentsChartBox = () => (
  <StyledBox>
    <StyledHead>
      <h3>콘텐츠 정보 제공</h3>
    </StyledHead>
    <StyledBody>
      <ContentsChart />
      <ContentsAreaChart />
    </StyledBody>
  </StyledBox>
);

export default ContentsChartBox;

const StyledBox = styled.div`
  padding: 20px 32px 24px;
  border-radius: 12px;
  border: 1px solid #2a2e54;
  background: #1a203a;

  &:nth-of-type(5) {
    grid-row: 3 / 4;
    grid-column: 1 / 4;
  }
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
    font-size: 16px;
    font-weight: 500;
    color: #f2f4fc;
  }
`;

const StyledBody = styled.div`
  display: flex;
`;
