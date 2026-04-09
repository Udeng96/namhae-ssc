import { useEffect, useState } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { Popup } from 'react-leaflet';
import FireCctvPopupBox from './FireCctvPopupBox';
import FireCctvCrimePopupBox from './FireCctvCrimePopupBox';
import { useFireStore } from '@/component/stores/fireStore';
import { useFireGisStore } from '@/component/stores/fireGisStore';

/**
 * 소방 GIS CCTV 팝업 플레이어
 * - EventCctvPopup.tsx의 fire 버전
 * - useFireStore.selectEvent / useFireGisStore.(eventScCctvs, eventRadiusCctvs) 사용
 */
const FireCctvPopup = () => {
  const selectEvent = useFireStore((s) => s.selectEvent);

  const { eventScCctvs, eventRadiusCctvs } = useFireGisStore(
    useShallow((s) => ({
      eventScCctvs:     s.eventScCctvs,
      eventRadiusCctvs: s.eventRadiusCctvs,
    })),
  );

  const [playerOn, setPlayerOn]           = useState(false);
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
            <FireCctvPopupBox key={index} index={index} cctvInfo={cctv} />
          ))}

        {eventRadiusCctvs.length > 0 &&
          eventRadiusCctvs.map((cctv, index) => (
            <FireCctvCrimePopupBox key={index} index={index} cctvInfo={cctv} />
          ))}
      </Popup>
    )
  );
};

export default FireCctvPopup;
