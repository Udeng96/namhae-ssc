import styled from 'styled-components';
import { CommonNone } from '@/component/lib/css';

const EventNone = () => (
  <StyledNone>
    <i />
    <p>검색 조건에 맞는 이벤트가 없습니다.</p>
  </StyledNone>
);

export default EventNone;

const StyledNone = styled.div`
  ${CommonNone};
  width: 468px;
  height: 627px;
`;
