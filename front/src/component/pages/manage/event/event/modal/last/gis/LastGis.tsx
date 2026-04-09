import styled from 'styled-components';
import LastMap from './LastMap';

const LastGis = () => (
  <StyledGis>
    <LastMap />
  </StyledGis>
);

export default LastGis;

const StyledGis = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  top: 0;
  background-color: #fff;
`;
