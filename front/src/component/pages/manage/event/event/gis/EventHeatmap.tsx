import { useEffect } from 'react';
import L from 'leaflet';
import 'leaflet.heat';
import { useMap } from 'react-leaflet';
import { useShallow } from 'zustand/react/shallow';
import { useEventStore } from '@/component/stores/eventStore';

/** 이벤트 히트맵 레이어 (heatmapOn 토글 시 렌더/제거) */
const EventHeatmap = () => {
  const map = useMap();
  const { heatmap, heatmapOn } = useEventStore(
    useShallow((s) => ({
      heatmap:   s.heatmap,
      heatmapOn: s.heatmapOn,
    })),
  );

  useEffect(() => {
    // pane 이름은 레이어 추가 시 사용한 'eventHeatmap'과 일치시켜야 함
    map.eachLayer((l) => {
      if (l.options.pane === 'eventHeatmap') map.removeLayer(l);
    });

    if (heatmap.length > 0 && heatmapOn) {
      // leaflet.heat 는 [lat, lng, intensity][] 튜플을 기대함
      const points = heatmap.map((h) => [h.lat, h.lng, h.count] as [number, number, number]);
      // @ts-ignore — leaflet.heat 플러그인
      L.heatLayer(points, {
        radius:     25,
        gradient:   { 0.1: '#00E626', 0.5: '#FFD70D', 1: '#FF0040' },
        blur:       15,
        max:        1,
        minOpacity: 0.8,
        maxZoom:    17,
        pane:       'eventHeatmap',
      }).addTo(map);
    }
  }, [heatmap, heatmapOn]);

  return null;
};

export default EventHeatmap;
