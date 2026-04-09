import styled from 'styled-components';
import ScheBoard    from '@/component/pages/manage/sche/main/board/ScheBoard';
import ScheCalendar from '@/component/pages/manage/sche/main/calendar/ScheCalendar';

const ScheMainBody = () => (
  <StyledBody>
    <ScheBoard />
    <ScheCalendar />
  </StyledBody>
);

export default ScheMainBody;

const StyledBody = styled.div`
  display: flex;
  gap: 0 39px;
  padding: 40px 24px 32px 24px;
`;
