import styled from 'styled-components';
import { useShallow } from 'zustand/react/shallow';
import { useGisStore } from '@/component/stores/gisStore';
import { MAP_TILE_TYPE, MapTileType } from '@/component/constants/gisConst';

/**
 * 시설 GIS 타일 전환 버튼 (일반 / 위성)
 */
const FacTileBtn = () => {
  const { facMapType, setFacMapType } = useGisStore(
    useShallow((s) => ({
      facMapType:    s.facMapType,
      setFacMapType: s.actions.setFacMapType,
    })),
  );

  const handleBtn = (type: MapTileType) => {
    setFacMapType(type);
  };

  return (
    <StyledTileBtnBox>
      <StyledTileBtn
        $isActive={facMapType === MAP_TILE_TYPE.NORMAL}
        onClick={() => handleBtn(MAP_TILE_TYPE.NORMAL)}
      >
        일반
      </StyledTileBtn>
      <StyledTileBtn
        $isActive={facMapType === MAP_TILE_TYPE.SATELLITE}
        onClick={() => handleBtn(MAP_TILE_TYPE.SATELLITE)}
      >
        위성
      </StyledTileBtn>
    </StyledTileBtnBox>
  );
};

export default FacTileBtn;

const StyledTileBtnBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  background: #12172e;
  border: 1px solid #090a14;
  gap: 0 2px;
  padding: 4px;
`;

const StyledTileBtn = styled.button<{ $isActive: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background: ${({ $isActive }) =>
    $isActive ? 'linear-gradient(180deg, #7F7AFF 0%, #681CEB 100%)' : '#12172E'};
  border: 1px solid ${({ $isActive }) => ($isActive ? '#9C7BFF' : '#090A14')};
  width: 44px;
  height: 32px;
  color: ${({ $isActive }) => ($isActive ? '#F2F4FC' : '#BABFD4')};
  border-radius: 5px;
  font-size: 13px;
  font-weight: 500;

  &:hover {
    border-color: ${({ $isActive }) => ($isActive ? '#9C7BFF' : '#543FAF')};
    background: ${({ $isActive }) =>
      $isActive ? 'linear-gradient(180deg, #7F7AFF 0%, #681CEB 100%)' : '#12172E'};
    color: ${({ $isActive }) => ($isActive ? '#F2F4FC' : '#BABFD4')};
  }
`;
