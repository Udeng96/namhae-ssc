import { useMap, useMapEvents } from 'react-leaflet';
import { useEffect } from 'react';
import { useShallow } from 'zustand/react/shallow';
import L from 'leaflet';
import { useFireStore } from '@/component/stores/fireStore';
import { useFireGisStore } from '@/component/stores/fireGisStore';
import { useFacStore } from '@/component/stores/facStore';
import { useHomeStore } from '@/component/stores/homeStore';
import { GIS_RANGE_TYPE } from '@/component/constants/gisConst';
import { CctvType } from '@/component/types/common';

const FireControl = () => {
  const map = useMap();

  const scFacs = useHomeStore((state) => state.scFacs);

  const { selectEvent, isBoxOpen } = useFireStore(
    useShallow((state) => ({
      selectEvent: state.selectEvent,
      isBoxOpen:   state.isBoxOpen,
    })),
  );

  const { crimeCctvs, scCctvs } = useFacStore(
    useShallow((state) => ({
      crimeCctvs: state.crimeCctvs,
      scCctvs:    state.scCctvs,
    })),
  );

  const {
    eventZoom,
    eventRadius,
    setEventCenter,
    setEventZoom,
    setEventRadiusCctvs,
    setEventScCctvs,
  } = useFireGisStore(
    useShallow((state) => ({
      eventZoom:           state.eventZoom,
      eventRadius:         state.eventRadius,
      setEventCenter:      state.actions.setEventCenter,
      setEventZoom:        state.actions.setEventZoom,
      setEventRadiusCctvs: state.actions.setEventRadiusCctvs,
      setEventScCctvs:     state.actions.setEventScCctvs,
    })),
  );

  useEffect(() => {
    setEventZoom(15);
    if (selectEvent) {
      const offset = isBoxOpen ? -0.012 : 0;
      const lat = Number(selectEvent.ycrdnt);
      const lng = Number(selectEvent.xcrdnt) + offset;
      setEventCenter([lat, lng]);
      map.setView([lat, lng], 15, {
        animate: false, duration: 1, easeLinearity: 1, noMoveStart: false,
      });
      calcRadiusCctvs();
      calcScCctvs();
    } else {
      setEventRadiusCctvs([]);
      setEventScCctvs([]);
    }
  }, [selectEvent, isBoxOpen, eventRadius, crimeCctvs, scCctvs]);

  const calcRadiusCctvs = () => {
    if (!selectEvent || crimeCctvs.length === 0) return;
    const eventPoint  = L.latLng(Number(selectEvent.ycrdnt), Number(selectEvent.xcrdnt));
    const radiusM     = eventRadius === GIS_RANGE_TYPE.SMALL ? 500 : 1000;
    const newCctvs: CctvType[] = [];
    for (const cctv of crimeCctvs) {
      const dist = L.latLng(Number(cctv.lat), Number(cctv.lng)).distanceTo(eventPoint);
      if (dist <= radiusM && newCctvs.length < 3) newCctvs.push(cctv);
    }
    setEventRadiusCctvs(newCctvs);
  };

  const calcScCctvs = () => {
    if (!selectEvent || scCctvs.length === 0) return;
    const outbPlac = selectEvent.outbPlac;
    const scNm = outbPlac.includes('_')
      ? scFacs.find((f) => f.mgtNo === outbPlac)?.facNm ?? outbPlac
      : outbPlac;
    const newCctvs = scCctvs.filter((c) => c.cctvNm.includes(scNm));
    setEventScCctvs(newCctvs);
  };

  useMapEvents({
    zoom: (e) => {
      setEventZoom(Math.round(map.getZoom()));
      map.setView(e.target.getCenter(), e.target.getZoom(), {
        animate: true, duration: 1, easeLinearity: 1, noMoveStart: true,
      });
    },
  });

  return null;
};

export default FireControl;
