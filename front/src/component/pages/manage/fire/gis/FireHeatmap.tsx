import { useEffect } from 'react';
import L from 'leaflet';
import 'leaflet.heat';
import { useMap } from 'react-leaflet';
import { useShallow } from 'zustand/react/shallow';
import { useFireGisStore } from '@/component/stores/fireGisStore';

/** 소방 이벤트 히트맵 레이어 (eventHeatmapOn 토글 시 렌더/제거) */
const FireHeatmap = () => {
  const map = useMap();
  const { eventHeatmap, eventHeatmapOn } = useFireGisStore(
    useShallow((s) => ({
      eventHeatmap:   s.eventHeatmap,
      eventHeatmapOn: s.eventHeatmapOn,
    })),
  );

  useEffect(() => {
    map.eachLayer((l) => {
      if (l.options.pane === 'fireEventHeatmap') map.removeLayer(l);
    });

    if (eventHeatmap.length > 0 && eventHeatmapOn) {
      const points = eventHeatmap.map((h) => [h.lat, h.lng, h.count] as [number, number, number]);
      // @ts-ignore — leaflet.heat 플러그인
      L.heatLayer(points, {
        radius:     25,
        gradient:   { 0.1: '#00E626', 0.5: '#FFD70D', 1: '#FF0040' },
        blur:       15,
        max:        1,
        minOpacity: 0.8,
        maxZoom:    17,
        pane:       'fireEventHeatmap',
      }).addTo(map);
    }
  }, [eventHeatmap, eventHeatmapOn]);

  return null;
};

export default FireHeatmap;
