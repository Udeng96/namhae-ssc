import styled from 'styled-components';
import { EventListItem } from '@/component/lib/css';

const FireListHead = () => (
  <StyledHead>
    <StyledRow>
      <StyledItem />
      <StyledItem>이벤트</StyledItem>
      <StyledItem>지역</StyledItem>
      <StyledItem>경로당 명</StyledItem>
      <StyledItem>발생 일시</StyledItem>
      <StyledItem />
    </StyledRow>
  </StyledHead>
);

export default FireListHead;

const StyledHead = styled.div`
  margin-top: 8px;
  margin-bottom: 4px;
  color: #a8afbd;
  padding: 5px 8px 5px 0;
`;

const StyledRow = styled.ul`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 6px;
`;

const StyledItem = styled.li`
  ${EventListItem}
`;
