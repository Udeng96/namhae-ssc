import styled from 'styled-components';
import FireZoomBtn from './FireZoomBtn';
import FireDrawBtn from './FireDrawBtn';

const FireRightBtns = () => (
  <StyledRightBtns>
    <FireZoomBtn />
    <FireDrawBtn />
  </StyledRightBtns>
);

export default FireRightBtns;

const StyledRightBtns = styled.div`
  position: absolute;
  top: 22px;
  right: 23px;
  width: 28px;
  height: 164px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  z-index: 14;
`;
