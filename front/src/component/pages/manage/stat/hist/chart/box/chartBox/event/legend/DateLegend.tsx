import styled from 'styled-components';

const DateLegend = () => (
  <StyledLegend>
    <StyledItem>화재</StyledItem>
    <StyledItem>비상벨</StyledItem>
  </StyledLegend>
);

export default DateLegend;

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

  &:nth-child(1)::before { background-color: #d95f41; }
  &:nth-child(2)::before { background-color: #cc5488; }
`;
