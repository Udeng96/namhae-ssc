import styled from 'styled-components';
import { CommonNone } from '@/component/lib/css';

const FacNone = () => (
  <StyledBox>
    <i />
    <p>검색 조건에 맞는 시설물이 없습니다.</p>
  </StyledBox>
);

export default FacNone;

const StyledBox = styled.div`
  ${CommonNone};
  width: 468px;
  height: 627px;
`;
