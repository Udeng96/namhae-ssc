import { useEffect, useState } from 'react';
import { TileLayer } from 'react-leaflet';
import { useFireGisStore } from '@/component/stores/fireGisStore';
import { MAP_TILE_TYPE, TILE_MAP_VWORLD } from '@/component/constants/gisConst';
import { IS_DEV } from '@/component/constants/commonConst';

const FireBase = () => {
  const eventMapType = useFireGisStore((state) => state.eventMapType);
  const [activeTile, setActiveTile] = useState<string>(MAP_TILE_TYPE.SATELLITE);

  useEffect(() => {
    setActiveTile(IS_DEV ? `${eventMapType}_DEV` : eventMapType);
  }, [eventMapType]);

  return (
    <>
      <TileLayer
        key={`FIRE_TILE_${activeTile}`}
        url={TILE_MAP_VWORLD[activeTile]?.url ?? TILE_MAP_VWORLD[MAP_TILE_TYPE.SATELLITE].url}
      />
      {activeTile === 'SATELLITE' && (
        <TileLayer
          key="FIRE_TILE_HYBRID"
          url={TILE_MAP_VWORLD['HYBRID'].url}
        />
      )}
    </>
  );
};

export default FireBase;
