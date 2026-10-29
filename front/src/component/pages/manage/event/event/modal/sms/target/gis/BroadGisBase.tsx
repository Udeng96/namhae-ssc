import { TileLayer } from 'react-leaflet';
import { TILE_MAP_VWORLD } from '@/component/constants/gisConst';

const BroadGisBase = () => {
  const isDev = import.meta.env.DEV;

  return isDev ? (
    <>
      <TileLayer key="broad-satellite-dev" url={TILE_MAP_VWORLD['SATELLITE_DEV'].url} />
      <TileLayer key="broad-hybrid-dev"    url={TILE_MAP_VWORLD['HYBRID_DEV'].url} />
    </>
  ) : (
    <>
      <TileLayer key="broad-satellite" url={TILE_MAP_VWORLD['SATELLITE'].url} />
      <TileLayer key="broad-hybrid"    url={TILE_MAP_VWORLD['HYBRID'].url} />
    </>
  );
};

export default BroadGisBase;
