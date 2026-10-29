import { useEffect } from 'react';
import L, { LatLngTuple } from 'leaflet';
import { useMap, useMapEvents } from 'react-leaflet';
import { useShallow } from 'zustand/react/shallow';
import { useEventStore } from '@/component/stores/eventStore';
import { useGisStore } from '@/component/stores/gisStore';
import { useFacStore } from '@/component/stores/facStore';
import { useHomeStore } from '@/component/stores/homeStore';
import { GIS_RANGE_TYPE } from '@/component/constants/gisConst';

/**
 * 이벤트 GIS 전용 컨트롤
 * - selectEvent 변경 시 지도 이동
 * - isBoxOpen 여부에 따라 center 오프셋 적용
 * - 반경 내 범죄 CCTV 계산 → eventRadiusCctvs
 * - 시설 SC CCTV 계산 → eventScCctvs
 */
const EventGisControl = () => {
  const map = useMap();
  map.getContainer().focus = () => {};

  const { selectEvent, isBoxOpen } = useEventStore(
    useShallow((s) => ({
      selectEvent: s.selectEvent,
      isBoxOpen:   s.isBoxOpen,
    })),
  );

  const { crimeCctvs, scCctvs } = useFacStore(
    useShallow((s) => ({
      crimeCctvs: s.crimeCctvs,
      scCctvs:    s.scCctvs,
    })),
  );

  const scFacs = useHomeStore((s) => s.scFacs);

  const {
    eventZoom,
    eventRadius,
    setEventZoom,
    setEventCenter,
    setEventRadiusCctvs,
    setEventScCctvs,
  } = useGisStore(
    useShallow((s) => ({
      eventZoom:           s.eventZoom,
      eventRadius:         s.eventRadius,
      setEventZoom:        s.actions.setEventZoom,
      setEventCenter:      s.actions.setEventCenter,
      setEventRadiusCctvs: s.actions.setEventRadiusCctvs,
      setEventScCctvs:     s.actions.setEventScCctvs,
    })),
  );

  // 지도 리사이즈 (초기 마운트 + 패널 열림/닫힘 시)
  // ※ MapContainer가 display:none 해제 후 마운트되는 경우를 대비해 초기에도 호출
  useEffect(() => {
    const id = setTimeout(() => map.invalidateSize(), 0);
    return () => clearTimeout(id);
  }, []);

  useEffect(() => {
    map.invalidateSize();
  }, [isBoxOpen]);

  // 선택된 이벤트 변경 시 지도 이동 + 줌 리셋 + CCTV 계산
  useEffect(() => {
    if (!selectEvent) {
      const empty: never[] = [];
      setEventRadiusCctvs(empty);
      setEventScCctvs(empty);
      return;
    }

    const lat     = Number(selectEvent.ycrdnt);
    const lng     = Number(selectEvent.xcrdnt);
    const xOffset = isBoxOpen ? -0.012 : 0;
    const center: LatLngTuple = [lat, lng + xOffset];

    setEventCenter(center);
    setEventZoom(15);   // 이벤트 선택 시 줌 초기화
    map.setView(center, 15, { animate: false, duration: 1, easeLinearity: 1, noMoveStart: false });
    calcRadiusCctvs();
    calcScCctvs();
  }, [selectEvent, isBoxOpen, eventRadius, crimeCctvs, scCctvs]);

  // ZoomBtn이 eventZoom을 변경하면 지도에 반영
  // ※ selectEvent useEffect에서 이미 setView(15)를 호출하므로 순환 없음
  useEffect(() => {
    map.setView(map.getCenter(), eventZoom, {
      animate: true, duration: 1, easeLinearity: 1, noMoveStart: true,
    });
  }, [eventZoom]);

  // 줌 이벤트 (사용자 직접 스크롤/핀치)
  useMapEvents({
    zoom: () => {
      setEventZoom(Math.round(map.getZoom()));
    },
  });

  /** 반경 내 범죄 CCTV 필터링 (최대 3개) */
  const calcRadiusCctvs = () => {
    if (!selectEvent || crimeCctvs.length === 0) return;

    const radius     = eventRadius === GIS_RANGE_TYPE.SMALL ? 500 : 1000;
    const eventPoint = L.latLng(Number(selectEvent.ycrdnt), Number(selectEvent.xcrdnt));

    const newCctvs = crimeCctvs
      .filter((c) => L.latLng(Number(c.lat), Number(c.lng)).distanceTo(eventPoint) <= radius)
      .slice(0, 3);

    setEventRadiusCctvs(newCctvs);
  };

  /** 시설 SC CCTV 필터링 (비상벨 index=2 고정) */
  const calcScCctvs = () => {
    if (!selectEvent || scCctvs.length === 0) return;

    const outbPlac = selectEvent.outbPlac;
    const facInfo  = outbPlac.includes('_')
      ? scFacs.find((f) => f.mgtNo === outbPlac)
      : scFacs.find((f) => f.facNm === outbPlac);
    if (!facInfo) return;

    let newCctvs = scCctvs.filter(
      (c) =>
        c.cctvNm.includes(facInfo.facNm) &&
        c.area.substring(0, 7) === facInfo.areaId.substring(0, 7),
    );

    // 비상벨 CCTV를 index=2에 고정
    if (newCctvs.length >= 3) {
      const idx = newCctvs.findIndex((c) => c.cctvNm.includes('비상벨'));
      if (idx !== -1 && idx !== 2) {
        const [bell] = newCctvs.splice(idx, 1);
        newCctvs.splice(2, 0, bell);
      }
    }

    setEventScCctvs(newCctvs);
  };

  return null;
};

export default EventGisControl;
