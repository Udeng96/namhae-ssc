import styled from 'styled-components';
import { useShallow } from 'zustand/react/shallow';
import { GIS_IMAGE } from '@/component/lib/constImage';
import { useGisStore } from '@/component/stores/gisStore';

/**
 * 시설 GIS 줌 인/아웃 버튼
 * - 신 gisStore의 facZoom 변경 → FacGisControl의 useEffect가 map.setView 호출
 */
const FacZoomBtn = () => {
  const { facZoom, setFacZoom } = useGisStore(
    useShallow((s) => ({
      facZoom:    s.facZoom,
      setFacZoom: s.actions.setFacZoom,
    })),
  );

  return (
    <StyledZoomBox>
      <StyledZoomInBtn
        disabled={facZoom >= 18}
        onClick={() => setFacZoom(facZoom + 1)}
      />
      <StyledZoomOutBtn
        disabled={facZoom <= 11}
        onClick={() => setFacZoom(facZoom - 1)}
      />
    </StyledZoomBox>
  );
};

export default FacZoomBtn;

const StyledZoomBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const StyledZoomInBtn = styled.button`
  width: 28px;
  height: 28px;
  background-size: 100%;
  background-repeat: no-repeat;
  background-image: url('${GIS_IMAGE.RIGHT.ZOOM.IN.BASE}');

  &:hover {
    background-image: url('${GIS_IMAGE.RIGHT.ZOOM.IN.HOVER}');
  }

  &:disabled {
    background-image: url('${GIS_IMAGE.RIGHT.ZOOM.IN.DISABLE}');
    pointer-events: none;
  }
`;

const StyledZoomOutBtn = styled.button`
  width: 28px;
  height: 28px;
  background-size: 100%;
  background-repeat: no-repeat;
  background-image: url('${GIS_IMAGE.RIGHT.ZOOM.OUT.BASE}');

  &:hover {
    background-image: url('${GIS_IMAGE.RIGHT.ZOOM.OUT.HOVER}');
  }

  &:disabled {
    background-image: url('${GIS_IMAGE.RIGHT.ZOOM.OUT.DISABLE}');
    pointer-events: none;
  }
`;
