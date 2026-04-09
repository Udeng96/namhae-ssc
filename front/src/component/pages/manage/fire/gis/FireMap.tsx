import L from 'leaflet';
import { MapContainer, Pane } from 'react-leaflet';
import { DEFAULT_LAT_LNG } from '@/component/constants/gisConst';
import 'leaflet/dist/leaflet.css';
import FireResize from './config/FireResize';
import FireControl from './config/FireControl';
import FireBase from './config/FireBase';
import FireCctvLine from './cctv/FireCctvLine';
import FireCctvPopup from './cctv/FireCctvPopup';
import FireDraw from './FireDraw';
import FireMarker from './FireMarker';
import FireCctvMarker from './cctv/FireCctvMarker';
import FireRadius from './FireRadius';
import FireHeatmap from './FireHeatmap';

const FireMap = () => (
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
    <FireResize />
    <FireControl />
    <FireBase />

    <Pane name="fireCctvLines">
      <FireCctvLine />
    </Pane>
    <Pane name="fireCctvPopup" style={{ zIndex: 1600 }}>
      <FireCctvPopup />
    </Pane>
    <Pane name="fireDrawLayer">
      <FireDraw />
    </Pane>
    <Pane name="fireEventMarker">
      <FireMarker />
    </Pane>
    <Pane name="fireCctvMarker">
      <FireCctvMarker />
    </Pane>
    <Pane name="fireEventRadius">
      <FireRadius />
    </Pane>
    <Pane name="fireEventHeatmap">
      <FireHeatmap />
    </Pane>
  </MapContainer>
);

export default FireMap;
