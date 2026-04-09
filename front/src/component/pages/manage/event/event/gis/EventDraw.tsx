import { MutableRefObject, useEffect, useRef, useState } from 'react';
import { Polygon, Polyline, useMap, useMapEvents } from 'react-leaflet';
import L, { LatLng } from 'leaflet';
import * as turf from '@turf/turf';
import 'leaflet-draw';
import 'leaflet-draw/dist/leaflet.draw.css';
import { useGisStore } from '@/component/stores/gisStore';
import { DRAW_GIS_TYPE, DrawGisType } from '@/component/constants/gisConst';

/**
 * 이벤트 전용 그리기 컴포넌트
 * - 구 Draw.tsx와 동일한 기능이지만 신 gisStore.eventDrawType을 직접 구독
 * - selectNav 의존 제거 (이미 이벤트 MapContainer 안에 있으므로 불필요)
 */
const EventDraw = () => {
  const map = useMap();
  const eventDrawType = useGisStore((s) => s.eventDrawType);

  const [activeType, setActiveType] = useState<DrawGisType>(DRAW_GIS_TYPE.NONE);

  const tooltipRef = useRef<L.Tooltip | null>(null);
  const polygonRef: MutableRefObject<any> = useRef(null);
  const polylineRef: MutableRefObject<any> = useRef(null);

  // polyline
  const [linePositions, setLinePositions] = useState<LatLng[]>([]);
  const [polylineEl, setPolylineEl] = useState<React.ReactElement | null>(null);
  const [distanceTooltip, setDistanceTooltip] = useState<string | null>(null);

  // polygon
  const [gonPositions, setGonPositions] = useState<LatLng[]>([]);
  const [polygonEl, setPolygonEl] = useState<React.ReactElement | null>(null);
  const [areaTooltip, setAreaTooltip] = useState<string | null>(null);

  // 마우스 따라다니는 tooltip
  const [tooltipContent, setTooltipContent] = useState<string | null>(null);

  const [drawOn, setDrawOn] = useState(false);

  // eventDrawType 변경 → activeType 갱신 (selectNav 불필요)
  useEffect(() => {
    setActiveType(eventDrawType);
  }, [eventDrawType]);

  // polyline 거리 계산
  const calculateDistance = () => {
    let total = 0;
    linePositions.forEach((pos, i) => {
      if (i > 0) {
        total += L.latLng(linePositions[i - 1]).distanceTo(L.latLng(pos));
      }
    });
    return (total / 1000).toFixed(2);
  };

  // polygon 면적 계산
  const calculateArea = () => {
    if (!polygonEl || !polygonRef.current) return null;
    const latLngs: LatLng[] = polygonRef.current.getLatLngs()[0];
    const coords = latLngs.map((ll: LatLng) => [ll.lng, ll.lat]);
    if (coords.length < 3) return null;
    if (coords[0][0] !== coords[coords.length - 1][0] || coords[0][1] !== coords[coords.length - 1][1]) {
      coords.push(coords[0]);
    }
    const area = turf.area(turf.polygon([coords]));
    return (area / 1_000_000).toFixed(2);
  };

  // 거리 tooltip 표시
  useEffect(() => {
    if (!polylineRef.current) return;
    map.eachLayer((l: any) => {
      if (l.options?.className === 'distance-custom-tooltip') map.removeLayer(l);
    });
    if (distanceTooltip) {
      const latLngs = polylineRef.current.getLatLngs() as LatLng[];
      const midPt = latLngs[Math.floor(latLngs.length / 2)];
      L.tooltip({ permanent: false, interactive: true, offset: [0, 10], direction: 'bottom', className: 'distance-custom-tooltip' })
        .setContent('총 길이 : ' + distanceTooltip)
        .setLatLng(midPt)
        .addTo(map);
    }
  }, [distanceTooltip]);

  // 면적 tooltip 표시
  useEffect(() => {
    if (!polygonRef.current) return;
    map.eachLayer((l: any) => {
      if (l.options?.className === 'area-custom-tooltip') map.removeLayer(l);
    });
    if (areaTooltip) {
      const center = polygonRef.current.getBounds().getCenter();
      L.tooltip({ permanent: false, interactive: true, offset: [0, -30], direction: 'bottom', className: 'area-custom-tooltip' })
        .setContent('총 면적 : ' + areaTooltip)
        .setLatLng(center)
        .addTo(map);
    }
  }, [areaTooltip]);

  // 마우스 따라다니는 tooltip
  useEffect(() => {
    let tip: L.Tooltip;
    if (tooltipContent) {
      tip = L.tooltip({ permanent: false, interactive: true, offset: [0, -30], direction: 'top', className: 'custom-tooltip' })
        .setContent(tooltipContent);
      tooltipRef.current = tip;
      const onMove = (e: L.LeafletMouseEvent) => tip.setLatLng(e.latlng).addTo(map);
      map.on('mousemove', onMove);
      return () => {
        map.off('mousemove', onMove);
        tip.remove();
      };
    }
  }, [tooltipContent]);

  // polyline 엘리먼트 생성
  useEffect(() => {
    if (linePositions.length > 0) {
      setPolylineEl(<Polyline positions={linePositions} color="#543FAF" weight={4} opacity={1} ref={polylineRef} />);
    } else {
      setPolylineEl(null);
    }
  }, [linePositions]);

  // polygon 엘리먼트 생성
  useEffect(() => {
    if (gonPositions.length > 0) {
      setPolygonEl(
        <Polygon
          className="gon"
          positions={gonPositions}
          color="#543FAF"
          fillColor="rgba(29,21,59,0.89)"
          fillOpacity={0.3}
          ref={polygonRef}
        />,
      );
    } else {
      setPolygonEl(null);
    }
  }, [gonPositions]);

  // activeType 변경 → 초기화
  useEffect(() => {
    setLinePositions([]);
    setGonPositions([]);
    map.eachLayer((l: any) => {
      if (l.options?.className === 'area-custom-tooltip') map.removeLayer(l);
      if (l.options?.className === 'distance-custom-tooltip') map.removeLayer(l);
    });

    if (activeType === DRAW_GIS_TYPE.NONE) {
      setTooltipContent(null);
      setDistanceTooltip(null);
      setAreaTooltip(null);
      setDrawOn(false);
    } else if (activeType === DRAW_GIS_TYPE.DISTANCE) {
      setDrawOn(true);
      setTooltipContent('클릭하면 거리 그리기가 시작됩니다');
    } else if (activeType === DRAW_GIS_TYPE.EXTENT) {
      setDrawOn(true);
      setTooltipContent('클릭하면 면적 그리기가 시작됩니다');
    }
  }, [activeType]);

  const handleMapClick = (e: L.LeafletMouseEvent) => {
    if (activeType === DRAW_GIS_TYPE.DISTANCE && drawOn) {
      setTooltipContent("'esc'키를 누르면 종료됩니다.");
      setLinePositions((prev) => [...prev, e.latlng]);
    } else if (activeType === DRAW_GIS_TYPE.EXTENT && drawOn) {
      setTooltipContent("'esc'키를 누르면 종료됩니다.");
      setGonPositions((prev) => [...prev, e.latlng]);
    }
  };

  const handleMapMouseMove = (e: L.LeafletMouseEvent) => {
    if (!drawOn) return;
    if (activeType === DRAW_GIS_TYPE.DISTANCE) {
      setLinePositions((prev) => [...prev.slice(0, -1), e.latlng]);
    } else if (activeType === DRAW_GIS_TYPE.EXTENT) {
      setGonPositions((prev) => [...prev.slice(0, -1), e.latlng]);
    }
  };

  const handleKeyDown = (e: L.LeafletKeyboardEvent) => {
    const code = (e as any).originalEvent?.code;
    if (drawOn) {
      if (activeType === DRAW_GIS_TYPE.DISTANCE && code === 'Escape') {
        if (linePositions.length > 2) {
          setDrawOn(false);
          setTooltipContent('esc 키를 한 번 더 누르면 초기화 됩니다.');
          setLinePositions((prev) => prev.slice(0, -1));
          setDistanceTooltip(calculateDistance() + 'km');
        } else {
          setTooltipContent('지점을 두 곳 이상 입력해주세요.');
        }
      } else if (activeType === DRAW_GIS_TYPE.EXTENT && code === 'Escape') {
        if (gonPositions.length < 4) {
          setTooltipContent('지점을 세 곳 이상 입력해주세요.');
        } else {
          setDrawOn(false);
          setTooltipContent('esc 키를 한 번 더 누르면 초기화 됩니다.');
          setGonPositions((prev) => prev.slice(0, -1));
          setAreaTooltip((calculateArea() ?? '0') + 'km²');
        }
      }
    } else {
      if (code === 'Escape') {
        setGonPositions([]);
        setLinePositions([]);
        setDistanceTooltip(null);
        setAreaTooltip(null);
        setDrawOn(true);
        if (activeType !== DRAW_GIS_TYPE.NONE) {
          setTooltipContent('클릭하면 그리기가 시작됩니다');
        }
      }
    }
  };

  useMapEvents({
    click: handleMapClick,
    mousemove: handleMapMouseMove,
    keydown: handleKeyDown,
  });

  return (
    <>
      {activeType === DRAW_GIS_TYPE.DISTANCE ? polylineEl : activeType === DRAW_GIS_TYPE.EXTENT ? polygonEl : null}
    </>
  );
};

export default EventDraw;
