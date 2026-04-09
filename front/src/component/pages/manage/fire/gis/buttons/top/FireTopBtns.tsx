import styled from 'styled-components';
import FireResetBtn from './FireResetBtn';
import FireHeatmapBtn from './FireHeatmapBtn';
import FireTileBtn from './FireTileBtn';

const FireTopBtns = () => (
  <StyledTopBtns>
    <FireResetBtn />
    <FireHeatmapBtn />
    <FireTileBtn />
  </StyledTopBtns>
);

export default FireTopBtns;

const StyledTopBtns = styled.div`
  display: flex;
  align-items: center;
  gap: 0 4px;
  position: absolute;
  top: 22px;
  right: 59px;
  z-index: 14;
`;
