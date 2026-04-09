import { useEffect } from 'react';
import L from 'leaflet';
import ReactDOMServer from 'react-dom/server';
import { useMap } from 'react-leaflet';
import styled, { keyframes } from 'styled-components';
import { useFireStore } from '@/component/stores/fireStore';
import { DataMarker } from '@/component/lib/DataMarker';
import { EVENT_IMAGE } from '@/component/lib/eventImage';

/** 선택된 소방 이벤트 위치에 박동 애니메이션 마커 표시 */
const FireMarker = () => {
  const map         = useMap();
  const selectEvent = useFireStore((s) => s.selectEvent);

  useEffect(() => {
    map.eachLayer((l) => {
      if (l.options.pane === 'fireEventMarker') map.removeLayer(l);
    });

    if (selectEvent) {
      const marker = new DataMarker(
        [Number(selectEvent.ycrdnt), Number(selectEvent.xcrdnt)],
        {
          pane: 'fireEventMarker',
          data: selectEvent,
          icon: L.divIcon({
            className: 'fire-event-marker',
            html: ReactDOMServer.renderToString(
              <StyledFireMarker>
                <StyledFireDot />
                <StyledFireDot />
                <StyledFireDot />
              </StyledFireMarker>,
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

export default FireMarker;

// ── Styled ────────────────────────────────────────────────────────

const pulse = keyframes`
  0%   { transform: scale(0); opacity: 1; }
  100% { transform: scale(1); opacity: 0; }
`;

const StyledFireMarker = styled.div`
  position: absolute;
  transform: translateY(-50%);
  width: 45px;
  height: 63px;
  background-size: 100%;
  background: url(${EVENT_IMAGE.GIS.MARKER.EVENT}) no-repeat;
  cursor: default;
  z-index: 25;
`;

const StyledFireDot = styled.div`
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
