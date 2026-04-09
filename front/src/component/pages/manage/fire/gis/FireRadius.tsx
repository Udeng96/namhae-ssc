import { useEffect } from 'react';
import L from 'leaflet';
import { useMap } from 'react-leaflet';
import { useShallow } from 'zustand/react/shallow';
import { useFireStore } from '@/component/stores/fireStore';
import { useFireGisStore } from '@/component/stores/fireGisStore';
import { GIS_RANGE_TYPE, MAP_TILE_TYPE } from '@/component/constants/gisConst';

/** 선택된 소방 이벤트 위치에 반경 원형 표시 (500m / 1km) */
const FireRadius = () => {
  const map         = useMap();
  const selectEvent = useFireStore((s) => s.selectEvent);
  const { eventRadius, eventMapType } = useFireGisStore(
    useShallow((s) => ({
      eventRadius:  s.eventRadius,
      eventMapType: s.eventMapType,
    })),
  );

  useEffect(() => {
    map.eachLayer((l) => {
      if (l.options.pane === 'fireEventRadius') map.removeLayer(l);
    });

    if (selectEvent) {
      const isSatellite = eventMapType === MAP_TILE_TYPE.SATELLITE;
      const color       = isSatellite ? '#7F2AFF' : '#CAF';

      const circle = L.circle(
        [Number(selectEvent.ycrdnt), Number(selectEvent.xcrdnt)],
        {
          color,
          fillColor: color,
          radius:    eventRadius === GIS_RANGE_TYPE.SMALL ? 500 : 1000,
          pane:      'fireEventRadius',
          opacity:   0.3,
          className: 'fire_event_radius',
        },
      );
      map.addLayer(circle);
    }
  }, [selectEvent, eventRadius]);

  return null;
};

export default FireRadius;
