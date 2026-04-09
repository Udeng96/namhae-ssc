import styled from 'styled-components';
import { CommonNone } from '@/component/lib/css';

const LastEventNone = () => (
  <StyledNone>
    <i />
    <p>검색 조건에 맞는 이벤트가 없습니다.</p>
  </StyledNone>
);

export default LastEventNone;

const StyledNone = styled.div`
  ${CommonNone};
  width: 100%;
  height: 375px;
`;
