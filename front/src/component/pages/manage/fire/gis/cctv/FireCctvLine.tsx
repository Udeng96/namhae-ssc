import { useEffect } from 'react';
import L from 'leaflet';
import ReactDOMServer from 'react-dom/server';
import { useMap } from 'react-leaflet';
import styled from 'styled-components';
import { DataMarker } from '@/component/lib/DataMarker';
import { EVENT_IMAGE } from '@/component/lib/eventImage';
import { useFireStore } from '@/component/stores/fireStore';
import { useFireGisStore } from '@/component/stores/fireGisStore';
import { CctvType } from '@/component/types/common';

/**
 * 소방 GIS CCTV 연결선
 * - EventCctvLine.tsx의 fire 버전
 */
const FireCctvLine = () => {
  const map = useMap();

  const eventScCctvs = useFireGisStore((s) => s.eventScCctvs);
  const selectEvent  = useFireStore((s) => s.selectEvent);

  const Left = ['-60px', '-60px', '24px', '24px'];
  const Top  = ['-60px', '-4px', '-60px', '-4px'];
  const line = [
    EVENT_IMAGE.GIS.LINE.FIRST,
    EVENT_IMAGE.GIS.LINE.SECOND,
    EVENT_IMAGE.GIS.LINE.THIRD,
    EVENT_IMAGE.GIS.LINE.FOURTH,
  ];

  useEffect(() => {
    map.eachLayer((l) => {
      if (l.options.pane === 'fireCctvLines') map.removeLayer(l);
    });

    if (selectEvent && eventScCctvs.length > 0) {
      eventScCctvs.forEach((item, index) => {
        map.addLayer(makeMarker(item, index).getLeafletMarker());
      });
    }
  }, [eventScCctvs, selectEvent]);

  const renderIcon = (index: number) =>
    L.divIcon({
      className: `fire-cctv-line-${index}`,
      html: ReactDOMServer.renderToString(
        <StyledLine $top={Top[index]} $left={Left[index]} $backImg={line[index]} />,
      ),
      iconAnchor: [20, 20],
    });

  const makeMarker = (cctvInfo: CctvType, index: number) =>
    new DataMarker(
      [Number(selectEvent!.ycrdnt), Number(selectEvent!.xcrdnt)],
      { pane: 'fireCctvLines', data: cctvInfo, icon: renderIcon(index) },
    );

  return null;
};

export default FireCctvLine;

const StyledLine = styled.div<{ $backImg: string; $left: string; $top: string }>`
  position: absolute;
  width: 84px;
  height: 44px;
  background: url(${({ $backImg }) => $backImg}) no-repeat center / 100%;
  left: ${({ $left }) => $left};
  top: ${({ $top }) => $top};
  z-index: 20;
`;
