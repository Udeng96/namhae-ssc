import { TileLayer } from 'react-leaflet';
import { useShallow } from 'zustand/react/shallow';
import { useGisStore } from '@/component/stores/gisStore';
import { MAP_TILE_TYPE } from '@/component/constants/gisConst';
import { TILE_MAP_VWORLD } from '@/component/constants/gisConst';
import { IS_DEV } from '@/component/constants/commonConst';

interface Props {
  type: 'event' | 'fac';
}

const GisBase = ({ type }: Props) => {
  const mapType = useGisStore(
    useShallow((s) => (type === 'fac' ? s.facMapType : s.eventMapType)),
  );

  const tileKey = IS_DEV ? `${mapType}_DEV` : mapType;

  return (
    <>
      <TileLayer key={`tile_${tileKey}`} url={TILE_MAP_VWORLD[tileKey]?.url} />
      {mapType === MAP_TILE_TYPE.SATELLITE && (
        <TileLayer
          key={`tile_HYBRID${IS_DEV ? '_DEV' : ''}`}
          url={TILE_MAP_VWORLD[IS_DEV ? 'HYBRID_DEV' : 'HYBRID']?.url}
        />
      )}
    </>
  );
};

export default GisBase;
