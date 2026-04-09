import { useEffect } from 'react';
import L from 'leaflet';
import ReactDOMServer from 'react-dom/server';
import { useMap } from 'react-leaflet';
import styled, { keyframes } from 'styled-components';
import { useFireStore } from '@/component/stores/fireStore';
import { DataMarker } from '@/component/lib/DataMarker';
import { EVENT_IMAGE } from '@/component/lib/eventImage';

const FireLastMarker = () => {
  const map             = useMap();
  const lastSelectEvent = useFireStore((state) => state.lastSelectEvent);

  useEffect(() => {
    map.eachLayer((l) => {
      if (l.options.pane === 'fireLastMarker') map.removeLayer(l);
    });
    if (lastSelectEvent) {
      const icon = L.divIcon({
        className: 'fire-last-marker',
        html: ReactDOMServer.renderToString(
          <StyledMarker>
            <StyledDot />
            <StyledDot />
            <StyledDot />
          </StyledMarker>,
        ),
        iconAnchor: [20, 20],
      });
      const marker = new DataMarker(
        [Number(lastSelectEvent.ycrdnt), Number(lastSelectEvent.xcrdnt)],
        { pane: 'fireLastMarker', data: lastSelectEvent, icon },
      );
      map.addLayer(marker.getLeafletMarker());
    }
  }, [lastSelectEvent]);

  return null;
};

export default FireLastMarker;

const pulse = keyframes`
  0%   { transform: scale(0); opacity: 1; }
  100% { transform: scale(1); opacity: 0; }
`;

const StyledMarker = styled.div`
  position: absolute;
  transform: translateY(-50%);
  width: 45px;
  height: 63px;
  background: url(${EVENT_IMAGE.GIS.MARKER.EVENT}) no-repeat;
  background-size: 100%;
  cursor: default;
  z-index: 25;
`;

const StyledDot = styled.div`
  position: absolute;
  width: 104px;
  height: 104px;
  border-radius: 50%;
  background-color: #ff4359;
  transform: scale(0);
  animation: ${pulse} 2s ease-in-out infinite;
  opacity: 0.35;
  left: -30px;

  &:nth-child(2) { opacity: 0.15; animation-delay: 400ms; }
  &:nth-child(3) { opacity: 0.45; animation-delay: 800ms; }
`;
