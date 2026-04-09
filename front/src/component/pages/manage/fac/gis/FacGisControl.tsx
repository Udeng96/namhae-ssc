import { useEffect } from 'react';
import L, { LatLngTuple } from 'leaflet';
import { useMap, useMapEvents } from 'react-leaflet';
import { useShallow } from 'zustand/react/shallow';
import { useFacStore } from '@/component/stores/facStore';
import { useGisStore } from '@/component/stores/gisStore';
import { useHomeStore } from '@/component/stores/homeStore';

/**
 * 시설 GIS 전용 컨트롤
 * - selectFac 변경 시 지도 이동
 * - listOpen / stateOpen 여부에 따라 center 오프셋 적용 + invalidateSize
 * - SC CCTV 필터링 → facScCctvs 저장
 * - FacZoomBtn → facZoom → map.setView (useEffect)
 */
const FacGisControl = () => {
  const map = useMap();
  // 키보드 포커스 방지
  map.getContainer().focus = () => {};

  const { selectFac, listOpen, stateOpen, scCctvs, isVisible } = useFacStore(
    useShallow((s) => ({
      selectFac: s.selectFac,
      listOpen:  s.listOpen,
      stateOpen: s.stateOpen,
      scCctvs:   s.scCctvs,
      isVisible: s.isVisible,
    })),
  );

  const scFacs = useHomeStore((s) => s.scFacs);

  const { facZoom, setFacZoom, setFacCenter, setFacScCctvs } = useGisStore(
    useShallow((s) => ({
      facZoom:        s.facZoom,
      setFacZoom:     s.actions.setFacZoom,
      setFacCenter:   s.actions.setFacCenter,
      setFacScCctvs:  s.actions.setFacScCctvs,
    })),
  );

  // 초기 마운트 시 invalidateSize
  useEffect(() => {
    const id = setTimeout(() => map.invalidateSize(), 0);
    return () => clearTimeout(id);
  }, []);

  // FAC 탭 표시 전환 시 invalidateSize
  // display:none → block 이후 브라우저가 레이아웃을 계산할 때까지 100ms 대기
  useEffect(() => {
    if (!isVisible) return;
    const id = setTimeout(() => map.invalidateSize(), 100);
    return () => clearTimeout(id);
  }, [isVisible]);

  // 지도 리사이즈 (왼쪽 목록 패널 / 오른쪽 상세 패널 열림·닫힘 시)
  useEffect(() => {
    map.invalidateSize();
  }, [listOpen, stateOpen, selectFac]);

  // 선택된 시설 변경 / 패널 열림-닫힘 시 지도 이동 + 줌 리셋 + CCTV 계산
  useEffect(() => {
    if (!selectFac) return;

    const lat = Number(selectFac.ycrdnt);
    const lng = Number(selectFac.xcrdnt);

    // 구 gisControl.tsx 기준 4가지 조합으로 수평 오프셋 결정
    //   listOpen &&  stateOpen → -0.00025  (양쪽 패널 모두 열림: 미세 보정)
    //   listOpen && !stateOpen → -0.003    (왼쪽만 열림: 오른쪽 공간 확보)
    //  !listOpen &&  stateOpen → +0.0025   (오른쪽만 열림: 왼쪽으로 마커 이동)
    //  !listOpen && !stateOpen →  0        (양쪽 모두 닫힘: 보정 없음)
    let xOffset = 0;
    if (listOpen && stateOpen)   xOffset = -0.00025;
    else if (listOpen)           xOffset = -0.003;
    else if (stateOpen)          xOffset =  0.0025;

    const center: LatLngTuple = [lat, lng + xOffset];

    setFacCenter(center);
    setFacZoom(17);   // 시설 선택 시 줌 초기화
    map.setView(center, 17, { animate: false, duration: 1, easeLinearity: 1, noMoveStart: false });
    calcFacCctvs();
  }, [selectFac, listOpen, stateOpen, scCctvs]);

  // FacZoomBtn이 facZoom을 변경하면 지도에 반영
  // ※ selectFac useEffect에서 이미 setView(17)를 호출하므로 순환 없음
  useEffect(() => {
    map.setView(map.getCenter(), facZoom, {
      animate: true, duration: 1, easeLinearity: 1, noMoveStart: true,
    });
  }, [facZoom]);

  // 줌 이벤트 (사용자 직접 스크롤/핀치)
  useMapEvents({
    zoom: () => {
      setFacZoom(Math.round(map.getZoom()));
    },
  });

  /** 선택 시설에 해당하는 SC CCTV 필터링 */
  const calcFacCctvs = () => {
    if (!selectFac || scCctvs.length === 0) return;

    const mgtNo   = selectFac.mgtNo;
    const facInfo = mgtNo.includes('_')
      ? scFacs.find((f) => f.mgtNo === mgtNo)
      : scFacs.find((f) => f.facNm === mgtNo);
    if (!facInfo) return;

    const newCctvs = scCctvs.filter(
      (c) =>
        c.cctvNm.split('_')[0] === facInfo.facNm &&
        c.area.substring(0, 7) === facInfo.areaId.substring(0, 7),
    );

    setFacScCctvs(newCctvs);
  };

  return null;
};

export default FacGisControl;
