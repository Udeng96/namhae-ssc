import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import { useShallow } from 'zustand/react/shallow';
import { useFireStore } from '@/component/stores/fireStore';

const FireLastGisResize = () => {
  const map = useMap();
  const { lastSelectEvent, openOpt } = useFireStore(
    useShallow((state) => ({
      lastSelectEvent: state.lastSelectEvent,
      openOpt:         state.openOpt,
    })),
  );

  map.getContainer().focus = () => {};

  // 모달이 열릴 때 CSS 전환 완료 후 타일 재렌더
  useEffect(() => {
    if (openOpt === 'last') {
      const timer = setTimeout(() => map.invalidateSize(), 250);
      return () => clearTimeout(timer);
    }
  }, [openOpt]);

  // 이벤트 선택 시 지도 크기 갱신
  useEffect(() => {
    map.invalidateSize();
  }, [lastSelectEvent]);

  return null;
};

export default FireLastGisResize;
