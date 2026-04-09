import styled from 'styled-components';
import { CommonNone } from '@/component/lib/css';

const FacEventNone = () => (
  <StyledBox>
    <i />
    <p>이벤트 내역이 없습니다.</p>
  </StyledBox>
);

export default FacEventNone;

const StyledBox = styled.div`
  ${CommonNone};
  width: 100%;
  height: 501px;
`;
