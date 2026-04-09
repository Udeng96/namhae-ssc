import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import { useFireStore } from '@/component/stores/fireStore';

const FireLastGisControl = () => {
  const map             = useMap();
  const lastSelectEvent = useFireStore((state) => state.lastSelectEvent);

  useEffect(() => {
    if (lastSelectEvent) {
      map.setView(
        [Number(lastSelectEvent.ycrdnt), Number(lastSelectEvent.xcrdnt)],
        15,
        { animate: false, duration: 1, easeLinearity: 1, noMoveStart: false },
      );
    }
  }, [lastSelectEvent]);

  return null;
};

export default FireLastGisControl;
