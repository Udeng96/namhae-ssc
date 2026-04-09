import styled from 'styled-components';

const FacDateLegend = () => (
  <StyledLegend>
    <StyledItem>화재</StyledItem>
    <StyledItem>비상벨</StyledItem>
    <StyledItem>셋탑 박스</StyledItem>
    <StyledItem>CCTV</StyledItem>
  </StyledLegend>
);

export default FacDateLegend;

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
  &:nth-child(3)::before { background-color: #72c6d1; }
  &:nth-child(4)::before { background-color: #58992f; }
`;
