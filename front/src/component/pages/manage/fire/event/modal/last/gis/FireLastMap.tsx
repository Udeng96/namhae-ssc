import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { MapContainer, Pane } from 'react-leaflet';
import { DEFAULT_LAT_LNG } from '@/component/constants/gisConst';
import LastGisBase from '@/component/pages/manage/event/event/modal/last/gis/LastGisBase';
import FireLastGisControl from './FireLastGisControl';
import FireLastGisResize from './FireLastGisResize';
import FireLastMarker from './FireLastMarker';

const FireLastMap = () => (
  <MapContainer
    renderer={L.canvas()}
    zoomControl={false}
    zoom={15}
    center={DEFAULT_LAT_LNG}
    maxZoom={18}
    minZoom={6}
    crs={L.CRS.EPSG3857}
    attributionControl={false}
    preferCanvas={false}
    scrollWheelZoom={true}
    doubleClickZoom={false}
    closePopupOnClick={false}
    style={{ width: '100%', height: '100%', zIndex: '1' }}
  >
    <LastGisBase />
    <FireLastGisControl />
    <FireLastGisResize />
    <Pane name="fireLastMarker">
      <FireLastMarker />
    </Pane>
  </MapContainer>
);

export default FireLastMap;
