import styled from 'styled-components';
import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import { useShallow } from 'zustand/react/shallow';
import L from 'leaflet';
import ReactDOMServer from 'react-dom/server';
import { useEventStore } from '@/component/stores/eventStore';
import { DataMarker } from '@/component/lib/DataMarker';
import { ChildBroadDevice } from '@/component/types/event';

import BroadIconNormal from '@/assets/images/dark/common/icon/GIS_Icons/icon_map_broadcast_normal2.png';
import BroadIconActive from '@/assets/images/dark/common/icon/GIS_Icons/icon_map_broadcast_active.png';

const BroadMarker = () => {
  const map = useMap();

  const { broadTargetRes, broadcast, setBroadcast } = useEventStore(
    useShallow((state) => ({
      broadTargetRes: state.broadTargetRes,
      broadcast:      state.broadcast,
      setBroadcast:   state.actions.setBroadcast,
    })),
  );

  useEffect(() => {
    // 기존 broadMarker pane 레이어 제거
    map.eachLayer((l) => {
      if (l.options.pane === 'broadMarker') map.removeLayer(l);
    });

    if (!broadTargetRes.length) return;

    const deviceList: ChildBroadDevice[] = broadTargetRes.flatMap((area) =>
      area.subBroadDeviceList.flatMap((sc) => sc.childBroadDeviceList),
    );

    deviceList.forEach((device) => {
      const val    = `${device.id}/${device.name}`;
      const active = broadcast.selectedTargets.includes(val);
      const icon   = L.divIcon({
        className: 'broad-marker',
        html: ReactDOMServer.renderToString(<StyledMarker $isActive={active} />),
        iconAnchor: [20, 20],
      });
      const marker = new DataMarker([Number(device.lat), Number(device.lon)], {
        pane: 'broadMarker',
        data: device,
        icon,
        interactive: true,
      });
      marker.on('click', (e) => {
        const info: ChildBroadDevice = e.target.options.data;
        const clickedVal = `${info.id}/${info.name}`;
        const current    = useEventStore.getState().broadcast.selectedTargets;
        const next       = current.includes(clickedVal)
          ? current.filter((v) => v !== clickedVal)
          : [...current, clickedVal];
        setBroadcast({ selectedTargets: next });
      });
      map.addLayer(marker.getLeafletMarker());
    });
  }, [broadTargetRes, broadcast.selectedTargets]);

  return null;
};

export default BroadMarker;

/* ─── Styled ─────────────────────────────────────────── */
const StyledMarker = styled.div<{ $isActive: boolean }>`
  position: absolute;
  transform: translateY(-50%);
  width: 45px;
  height: 63px;
  background: url(${({ $isActive }) => ($isActive ? BroadIconActive : BroadIconNormal)}) no-repeat;
  background-size: 100%;
  cursor: pointer;
  z-index: 25;
`;
