import { useMap } from 'react-leaflet';
import { useEffect } from 'react';
import { useFireStore } from '@/component/stores/fireStore';

const FireResize = () => {
  const map = useMap();
  map.getContainer().focus = () => {};

  // 스칼라·배열 레퍼런스를 개별 선택자로 구독 (객체 리터럴 반환 시 useShallow 필수)
  const isBoxOpen = useFireStore((state) => state.isBoxOpen);
  const eventList = useFireStore((state) => state.eventList);

  useEffect(() => {
    map.invalidateSize();
  }, [isBoxOpen, map, eventList]);

  return null;
};

export default FireResize;
