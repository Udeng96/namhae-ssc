import { TileLayer } from 'react-leaflet';
import { TILE_MAP_VWORLD } from '@/component/constants/gisConst';

const LastGisBase = () => (
  <>
    <TileLayer key="TILE_LAST_SATELLITE" url={TILE_MAP_VWORLD['SATELLITE'].url} />
    <TileLayer key="TILE_LAST_HYBRID" url={TILE_MAP_VWORLD['HYBRID'].url} />
  </>
);

export default LastGisBase;
