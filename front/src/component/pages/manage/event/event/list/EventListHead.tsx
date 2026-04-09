import styled from 'styled-components';
import { EventListItem } from '@/component/lib/css';

const COLUMNS = ['', '이벤트', '지역', '경로당 명', '발생 일시', ''];

const EventListHead = () => (
  <StyledHead>
    <StyledRow>
      {COLUMNS.map((label, i) => (
        <StyledItem key={i}>{label}</StyledItem>
      ))}
    </StyledRow>
  </StyledHead>
);

export default EventListHead;

const StyledHead = styled.div`
  margin-top: 8px;
  margin-bottom: 4px;
  color: #a8afbd;
  padding: 5px 8px 5px 0px;
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
