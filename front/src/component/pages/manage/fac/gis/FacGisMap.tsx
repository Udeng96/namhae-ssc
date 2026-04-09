import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { MapContainer, Pane } from 'react-leaflet';
import { DEFAULT_LAT_LNG } from '@/component/constants/gisConst';
// refac 공통 GIS
import GisBase      from '@/component/pages/manage/_gis/GisBase';
// 시설 전용 refac 컴포넌트
import FacGisControl from './FacGisControl';
import FacCctvLine   from './FacCctvLine';
import FacCctvPopup  from './FacCctvPopup';
import FacDraw       from './FacDraw';
import FacMarker     from './FacMarker';

const FacGisMap = () => (
  <MapContainer
    renderer={L.canvas()}
    zoomControl={false}
    zoom={17}
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
    <GisBase type="fac" />
    <FacGisControl />

    {/* CCTV 연결선 */}
    <Pane name="cctvLines">
      <FacCctvLine />
    </Pane>

    {/* CCTV 팝업 플레이어 */}
    <Pane name="facCctvPopup" style={{ zIndex: 1600 }}>
      <FacCctvPopup />
    </Pane>

    {/* 그리기 모드 */}
    <Pane name="drawLayer">
      <FacDraw />
    </Pane>

    {/* 시설 마커 */}
    <Pane name="facMarker" style={{ zIndex: 1400 }}>
      <FacMarker />
    </Pane>
  </MapContainer>
);

export default FacGisMap;
