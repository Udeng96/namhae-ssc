import styled from 'styled-components';
import FireLastMap from './FireLastMap';

const FireLastGis = () => (
  <StyledGis>
    <FireLastMap />
  </StyledGis>
);

export default FireLastGis;

const StyledGis = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  top: 0;
  background-color: #fff;
`;
