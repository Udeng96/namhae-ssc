import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import { useEventStore } from '@/component/stores/eventStore';

const BroadGisResize = () => {
  const map     = useMap();
  const openOpt = useEventStore((state) => state.openOpt);

  useEffect(() => {
    map.invalidateSize();
  }, [map, openOpt]);

  return null;
};

export default BroadGisResize;
