import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { MapContainer, Pane } from 'react-leaflet';
import { DEFAULT_LAT_LNG } from '@/component/constants/gisConst';
// 리팩 공통 GIS
import GisBase from '@/component/pages/manage/_gis/GisBase';
// 이벤트 전용 GIS
import EventGisControl  from './EventGisControl';
// 이벤트 CCTV (리팩 — 신 store)
import EventCctvLine  from './EventCctvLine';
import EventCctvPopup from './EventCctvPopup';
import EventDraw        from './EventDraw';      // 신 gisStore 직접 구독 (selectNav 의존 제거)
import EventMarker      from './EventMarker';
import EventCctvMarker  from './EventCctvMarker';
import EventRadius      from './EventRadius';
import EventHeatmap     from './EventHeatmap';

const EventGisMap = () => (
  <MapContainer
    renderer={L.canvas()}
    zoomControl={false}
    zoom={15}
    center={DEFAULT_LAT_LNG}
    maxZoom={18}
    minZoom={11}
    crs={L.CRS.EPSG3857}
    attributionControl={false}
    preferCanvas={false}
    scrollWheelZoom={true}
    doubleClickZoom={false}
    closePopupOnClick={false}
    style={{ width: '100%', height: '100%', zIndex: '1' }}
  >
    <GisBase type="event" />
    <EventGisControl />

    {/* CCTV 연결선 */}
    <Pane name="cctvLines">
      <EventCctvLine />
    </Pane>

    {/* CCTV 팝업 플레이어 */}
    <Pane name="cctvPopup" style={{ zIndex: 1600 }}>
      <EventCctvPopup />
    </Pane>

    {/* 그리기 모드 (신 gisStore 직접 구독) */}
    <Pane name="drawLayer">
      <EventDraw />
    </Pane>

    {/* 이벤트 마커 */}
    <Pane name="eventMarker">
      <EventMarker />
    </Pane>

    {/* 반경 내 CCTV 마커 */}
    <Pane name="cctvMarker">
      <EventCctvMarker />
    </Pane>

    {/* 반경 원형 */}
    <Pane name="eventRadius">
      <EventRadius />
    </Pane>

    {/* 히트맵 */}
    <Pane name="eventHeatmap">
      <EventHeatmap />
    </Pane>
  </MapContainer>
);

export default EventGisMap;
