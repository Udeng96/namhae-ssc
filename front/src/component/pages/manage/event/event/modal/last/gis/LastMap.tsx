import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { MapContainer, Pane } from 'react-leaflet';
import { DEFAULT_LAT_LNG } from '@/component/constants/gisConst';
import LastGisBase from './LastGisBase';
import LastGisControl from './LastGisControl';
import LastGisResize from './LastGisResize';
import LastMarker from './LastMarker';

const LastMap = () => (
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
    <LastGisControl />
    <LastGisResize />
    <Pane name="lastMarker">
      <LastMarker />
    </Pane>
  </MapContainer>
);

export default LastMap;
