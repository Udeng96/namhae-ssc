import { useEffect } from 'react';
import L from 'leaflet';
import ReactDOMServer from 'react-dom/server';
import { useMap } from 'react-leaflet';
import styled from 'styled-components';
import { useFireStore } from '@/component/stores/fireStore';
import { useFireGisStore } from '@/component/stores/fireGisStore';
import { DataMarker } from '@/component/lib/DataMarker';
import { EVENT_IMAGE } from '@/component/lib/eventImage';
import { CctvType } from '@/component/types/common';

const ICONS = [
  EVENT_IMAGE.GIS.MARKER.CCTV.FIRST,
  EVENT_IMAGE.GIS.MARKER.CCTV.SECOND,
  EVENT_IMAGE.GIS.MARKER.CCTV.THIRD,
];

/** 소방 반경 내 범죄 CCTV 마커 (최대 3개, 순서 아이콘 구분) */
const FireCctvMarker = () => {
  const map              = useMap();
  const selectEvent      = useFireStore((s) => s.selectEvent);
  const eventRadiusCctvs = useFireGisStore((s) => s.eventRadiusCctvs);

  useEffect(() => {
    map.eachLayer((l) => {
      if (l.options.pane === 'fireCctvMarker') map.removeLayer(l);
    });

    if (selectEvent && eventRadiusCctvs.length > 0) {
      eventRadiusCctvs.forEach((cctv: CctvType, index: number) => {
        const marker = new DataMarker(
          [Number(cctv.lat), Number(cctv.lng)],
          {
            pane: 'fireCctvMarker',
            data: cctv,
            icon: L.divIcon({
              className: `fire-cctv-marker-${index}`,
              html: ReactDOMServer.renderToString(
                <StyledCctvMarker $backImg={ICONS[index]} />,
              ),
              iconAnchor: [20, 20],
            }),
            interactive: true,
          },
        );
        map.addLayer(marker.getLeafletMarker());
      });
    }
  }, [selectEvent, eventRadiusCctvs]);

  return null;
};

export default FireCctvMarker;

const StyledCctvMarker = styled.div<{ $backImg: string }>`
  position: absolute;
  width: 40px;
  height: 44px;
  background: url(${({ $backImg }) => $backImg}) no-repeat center / 100%;
  z-index: 20;
`;
