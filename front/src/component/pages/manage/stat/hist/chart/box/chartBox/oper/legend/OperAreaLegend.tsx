import styled from 'styled-components';

const OperAreaLegend = () => (
  <StyledLegend>
    <StyledItem>※ 가동시간</StyledItem>
  </StyledLegend>
);

export default OperAreaLegend;

const StyledLegend = styled.ul`
  display: flex;
  align-items: center;
  gap: 0 12px;
  position: absolute;
  top: 23px;
  right: 40px;
`;

const StyledItem = styled.li`
  display: flex;
  align-items: center;
  font-size: 12px;
  color: #bcbfcc;

  &::before {
    content: '';
    display: inline-block;
    width: 6px;
    height: 10px;
    border-radius: 2px;
    margin-right: 5px;
  }
`;
