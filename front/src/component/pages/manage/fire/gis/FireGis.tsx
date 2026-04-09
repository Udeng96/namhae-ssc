import styled from 'styled-components';
import FireMap from './FireMap';
import FireCctvEnd from './cctv/FireCctvEnd';
import FireTopBtns from './buttons/top/FireTopBtns';
import FireRightBtns from './buttons/right/FireRightBtns';

const FireGis = () => (
  <StyledGis>
    <FireMap />
    <FireCctvEnd />
    <FireTopBtns />
    <FireRightBtns />
  </StyledGis>
);

export default FireGis;

const StyledGis = styled.div`
  position: relative;
  width: 100%;
  height: 1032px;
  top: 0;
  background-color: #fff;
`;
