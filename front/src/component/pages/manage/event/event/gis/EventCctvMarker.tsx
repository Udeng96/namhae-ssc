import { useEffect } from 'react';
import L from 'leaflet';
import ReactDOMServer from 'react-dom/server';
import { useMap } from 'react-leaflet';
import styled from 'styled-components';
import { useEventStore } from '@/component/stores/eventStore';
import { useGisStore } from '@/component/stores/gisStore';
import { DataMarker } from '@/component/lib/DataMarker';
import { EVENT_IMAGE } from '@/component/lib/eventImage';
import { CctvType } from '@/component/types/common';

const ICONS = [
  EVENT_IMAGE.GIS.MARKER.CCTV.FIRST,
  EVENT_IMAGE.GIS.MARKER.CCTV.SECOND,
  EVENT_IMAGE.GIS.MARKER.CCTV.THIRD,
];

/** 이벤트 반경 내 범죄 CCTV 마커 (최대 3개, 순서 아이콘 구분) */
const EventCctvMarker = () => {
  const map              = useMap();
  const selectEvent      = useEventStore((s) => s.selectEvent);
  const eventRadiusCctvs = useGisStore((s) => s.eventRadiusCctvs);

  useEffect(() => {
    map.eachLayer((l) => {
      if (l.options.pane === 'cctvMarker') map.removeLayer(l);
    });

    if (selectEvent && eventRadiusCctvs.length > 0) {
      eventRadiusCctvs.forEach((cctv: CctvType, index: number) => {
        const marker = new DataMarker(
          [Number(cctv.lat), Number(cctv.lng)],
          {
            pane: 'cctvMarker',
            data: cctv,
            icon: L.divIcon({
              className: `cctv-marker-${index}`,
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

export default EventCctvMarker;

const StyledCctvMarker = styled.div<{ $backImg: string }>`
  position: absolute;
  width: 40px;
  height: 44px;
  background: url(${({ $backImg }) => $backImg}) no-repeat center / 100%;
  z-index: 20;
`;
