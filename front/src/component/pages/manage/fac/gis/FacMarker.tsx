import { useEffect } from 'react';
import L from 'leaflet';
import ReactDOMServer from 'react-dom/server';
import { useMap } from 'react-leaflet';
import styled from 'styled-components';
import { useShallow } from 'zustand/react/shallow';
import { useFacStore } from '@/component/stores/facStore';
import { DataMarker } from '@/component/lib/DataMarker';
import { FAC_IMAGE } from '@/component/lib/facImage';
import { ScFacType } from '@/component/types/fac';

const FacMarker = () => {
  const map = useMap();

  const { selectFac, facList, setSelectFac } = useFacStore(
    useShallow((state) => ({
      selectFac: state.selectFac,
      facList:   state.facList,
      setSelectFac: state.actions.setSelectFac,
    })),
  );

  useEffect(() => {
    map.eachLayer((l) => {
      if (l.options.pane === 'facMarker') map.removeLayer(l);
    });

    facList.forEach((fac) => {
      const marker = makeMarker(fac);
      map.addLayer(marker.getLeafletMarker());
    });
  }, [facList, selectFac]);

  const renderIcon = (fac: ScFacType) =>
    L.divIcon({
      className: 'fac-marker',
      html: ReactDOMServer.renderToString(
        <StyledMarker
          $isNorm={fac.sc === '00'}
          $isActive={!!(selectFac && fac.facId === selectFac.facId)}
        />,
      ),
      iconAnchor: [22.5, 31.5],
      iconSize: [45, 63],
    });

  const makeMarker = (fac: ScFacType) => {
    const marker = new DataMarker(
      [Number(fac.ycrdnt), Number(fac.xcrdnt)],
      { pane: 'facMarker', data: fac, icon: renderIcon(fac), interactive: true },
    );
    marker.on('click', (e) => {
      const info: ScFacType = e.target.options.data;
      if (selectFac?.facId === info.facId) {
        setSelectFac(null);
      } else {
        setSelectFac(info);
      }
    });
    return marker;
  };

  return null;
};

export default FacMarker;

const StyledMarker = styled.div<{ $isNorm: boolean; $isActive: boolean }>`
  position: absolute;
  transform: translateY(-50%);
  width: 45px;
  height: 63px;
  background-size: 100%;
  background: url(${({ $isNorm, $isActive }) =>
    $isNorm
      ? $isActive
        ? FAC_IMAGE.GIS.MARKER.NORM.ACTIVE
        : FAC_IMAGE.GIS.MARKER.NORM.NORM
      : $isActive
      ? FAC_IMAGE.GIS.MARKER.ERROR.ACTIVE
      : FAC_IMAGE.GIS.MARKER.ERROR.NORM}) no-repeat;
  cursor: pointer;
  &:hover {
    background: url(${({ $isNorm, $isActive }) =>
      $isNorm
        ? $isActive
          ? FAC_IMAGE.GIS.MARKER.NORM.ACTIVE
          : FAC_IMAGE.GIS.MARKER.NORM.HOVER
        : $isActive
        ? FAC_IMAGE.GIS.MARKER.ERROR.ACTIVE
        : FAC_IMAGE.GIS.MARKER.NORM.HOVER}) no-repeat;
  }
`;
