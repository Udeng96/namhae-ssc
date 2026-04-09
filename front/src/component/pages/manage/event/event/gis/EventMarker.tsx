import { useEffect } from 'react';
import L from 'leaflet';
import ReactDOMServer from 'react-dom/server';
import { useMap } from 'react-leaflet';
import styled, { keyframes } from 'styled-components';
import { useEventStore } from '@/component/stores/eventStore';
import { DataMarker } from '@/component/lib/DataMarker';
import { EVENT_IMAGE } from '@/component/lib/eventImage';

/** 선택된 이벤트 위치에 박동 애니메이션 마커 표시 */
const EventMarker = () => {
  const map         = useMap();
  const selectEvent = useEventStore((s) => s.selectEvent);

  useEffect(() => {
    map.eachLayer((l) => {
      if (l.options.pane === 'eventMarker') map.removeLayer(l);
    });

    if (selectEvent) {
      const marker = new DataMarker(
        [Number(selectEvent.ycrdnt), Number(selectEvent.xcrdnt)],
        {
          pane: 'eventMarker',
          data: selectEvent,
          icon: L.divIcon({
            className: 'event-marker',
            html: ReactDOMServer.renderToString(
              <StyledEventMarker>
                <StyledEventDot />
                <StyledEventDot />
                <StyledEventDot />
              </StyledEventMarker>,
            ),
            iconAnchor: [20, 20],
          }),
        },
      );
      map.addLayer(marker.getLeafletMarker());
    }
  }, [selectEvent]);

  return null;
};

export default EventMarker;

// ── Styled ────────────────────────────────────────────────────────

const pulse = keyframes`
  0%   { transform: scale(0); opacity: 1; }
  100% { transform: scale(1); opacity: 0; }
`;

const StyledEventMarker = styled.div`
  position: absolute;
  transform: translateY(-50%);
  width: 45px;
  height: 63px;
  background-size: 100%;
  background: url(${EVENT_IMAGE.GIS.MARKER.EVENT}) no-repeat;
  cursor: default;
  z-index: 25;
`;

const StyledEventDot = styled.div`
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
