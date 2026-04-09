import { useEffect, useState } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { Popup } from 'react-leaflet';
import CctvPopupBox      from '@/component/pages/manage/event/event/gis/player/CctvPopupBox';
import CctvCrimePopupBox from '@/component/pages/manage/event/event/gis/player/CctvCrimePopupBox';
// 신 refac store
import { useEventStore } from '@/component/stores/eventStore';
import { useGisStore }   from '@/component/stores/gisStore';

/**
 * 이벤트 GIS CCTV 팝업 플레이어
 * - 구 cctvPopup.tsx의 리팩 버전
 * - 신 eventStore.selectEvent / 신 gisStore.(eventScCctvs, eventRadiusCctvs) 사용
 */
const EventCctvPopup = () => {
  const selectEvent = useEventStore((s) => s.selectEvent);

  const { eventScCctvs, eventRadiusCctvs } = useGisStore(
    useShallow((s) => ({
      eventScCctvs:     s.eventScCctvs,
      eventRadiusCctvs: s.eventRadiusCctvs,
    })),
  );

  const [playerOn, setPlayerOn]         = useState(false);
  const [popupPosition, setPopupPosition] = useState([0, 0]);

  useEffect(() => {
    if (selectEvent) {
      setPlayerOn(true);
      setPopupPosition([Number(selectEvent.ycrdnt), Number(selectEvent.xcrdnt)]);
    } else {
      setPlayerOn(false);
      setPopupPosition([0, 0]);
    }
  }, [selectEvent]);

  return (
    playerOn && (
      <Popup
        position={[Number(popupPosition[0]), Number(popupPosition[1])]}
        closeButton={false}
        autoClose={false}
        autoPan={false}
        closeOnClick={false}
        interactive={true}
        closeOnEscapeKey={false}
      >
        {eventScCctvs.length > 0 &&
          eventScCctvs.map((cctv, index) => (
            <CctvPopupBox key={index} index={index} cctvInfo={cctv} />
          ))}

        {eventRadiusCctvs.length > 0 &&
          eventRadiusCctvs.map((cctv, index) => (
            <CctvCrimePopupBox key={index} index={index} cctvInfo={cctv} />
          ))}
      </Popup>
    )
  );
};

export default EventCctvPopup;
