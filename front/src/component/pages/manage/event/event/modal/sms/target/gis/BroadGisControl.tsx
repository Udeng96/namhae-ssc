import { useEffect, useState } from 'react';
import { useMap } from 'react-leaflet';
import { useShallow } from 'zustand/react/shallow';
import { useEventStore } from '@/component/stores/eventStore';
import { ChildBroadDevice } from '@/component/types/event';

const BroadGisControl = () => {
  const map = useMap();

  const { broadTargetRes, broadcast } = useEventStore(
    useShallow((state) => ({
      broadTargetRes: state.broadTargetRes,
      broadcast:      state.broadcast,
    })),
  );

  const [lastSelected, setLastSelected] = useState<string[]>([]);

  useEffect(() => {
    if (!broadTargetRes.length) return;

    // 모든 childBroadDevice를 flat map으로 추출
    const deviceList: ChildBroadDevice[] = broadTargetRes.flatMap((area) =>
      area.subBroadDeviceList.flatMap((sc) => sc.childBroadDeviceList),
    );

    const selected = broadcast.selectedTargets;

    // 선택 변경된 아이템 찾기
    const changed =
      selected.length > lastSelected.length
        ? selected.filter((s) => !lastSelected.includes(s))   // 새로 선택된 항목
        : lastSelected.filter((s) => !selected.includes(s));  // 해제된 항목

    if (changed.length > 0) {
      const deviceId = changed[0].split('/')[0];
      const device   = deviceList.find((d) => d.id === deviceId);
      if (device) {
        map.panTo([Number(device.lat), Number(device.lon)], { animate: false });
      }
    }

    setLastSelected(selected);
  }, [broadcast.selectedTargets, broadTargetRes]);

  return null;
};

export default BroadGisControl;
