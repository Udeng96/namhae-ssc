import styled from 'styled-components';
import { useFacStore } from '@/component/stores/facStore';
import CctvEnd     from '@/component/pages/manage/_gis/cctv/CctvEnd';
import FacResetBtn from './buttons/FacResetBtn';
import FacTileBtn  from './buttons/FacTileBtn';
import FacZoomBtn  from './buttons/FacZoomBtn';
import FacDrawBtn  from './buttons/FacDrawBtn';
import FacGisMap   from './FacGisMap';

const FacGisBox = () => {
  const stateOpen = useFacStore((state) => state.stateOpen);

  return (
    <StyledGis>
      <FacGisMap />
      <CctvEnd />
      <StyledTopBtns $isBoxOpen={stateOpen}>
        <FacResetBtn />
        <FacTileBtn />
      </StyledTopBtns>
      <StyledRightBtns $isBoxOpen={stateOpen}>
        <FacZoomBtn />
        <FacDrawBtn />
      </StyledRightBtns>
    </StyledGis>
  );
};

export default FacGisBox;

const StyledGis = styled.div`
  position: relative;
  width: 100%;
  height: 1032px;
  top: 0;
  background-color: #fff;
`;

const StyledTopBtns = styled.div<{ $isBoxOpen: boolean }>`
  display: flex;
  align-items: center;
  gap: 0 4px;
  position: absolute;
  top: 22px;
  right: ${({ $isBoxOpen }) => ($isBoxOpen ? '551px' : '63px')};
  z-index: 14;
  transition: right 550ms ease;
`;

const StyledRightBtns = styled.div<{ $isBoxOpen: boolean }>`
  position: absolute;
  top: 22px;
  right: ${({ $isBoxOpen }) => ($isBoxOpen ? '508px' : '23px')};
  width: 28px;
  height: 164px;
  z-index: 14;
  transition: right 550ms ease;
`;
