import L from 'leaflet';
import { MapContainer, Pane } from 'react-leaflet';
import { DEFAULT_LAT_LNG } from '@/component/constants/gisConst';
import BroadGisControl from './BroadGisControl';
import BroadGisResize  from './BroadGisResize';
import BroadGisBase    from './BroadGisBase';
import BroadMarker     from './BroadMarker';

const BroadGisArea = () => (
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
    style={{ width: '100%', height: '100%', zIndex: 0 }}
  >
    <BroadGisControl />
    <BroadGisResize />
    <Pane name="broadGisBase">
      <BroadGisBase />
    </Pane>
    <Pane name="broadMarker">
      <BroadMarker />
    </Pane>
  </MapContainer>
);

export default BroadGisArea;
