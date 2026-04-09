import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import { useEventStore } from '@/component/stores/eventStore';

const LastGisControl = () => {
  const map = useMap();
  const lastSelectEvent = useEventStore((state) => state.lastSelectEvent);

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

export default LastGisControl;
