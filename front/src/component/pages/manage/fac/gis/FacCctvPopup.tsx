import { useEffect, useState } from 'react';
import { Popup } from 'react-leaflet';
import FacCctvPopupBox from '@/component/pages/manage/fac/gis/player/FacCctvPopupBox';
// 신 refac store
import { useFacStore } from '@/component/stores/facStore';
import { useGisStore } from '@/component/stores/gisStore';

/**
 * 시설 GIS CCTV 팝업 플레이어
 * - 구 facCctvPopup.tsx의 리팩 버전
 * - 신 facStore.selectFac / 신 gisStore.facScCctvs 사용 (구 store 의존 제거)
 */
const FacCctvPopup = () => {
  const selectFac  = useFacStore((s) => s.selectFac);
  const facScCctvs = useGisStore((s) => s.facScCctvs);

  const [playerOn, setPlayerOn]           = useState(false);
  const [popupPosition, setPopupPosition] = useState([0, 0]);

  useEffect(() => {
    if (selectFac) {
      setPlayerOn(true);
      setPopupPosition([Number(selectFac.ycrdnt), Number(selectFac.xcrdnt)]);
    } else {
      setPlayerOn(false);
      setPopupPosition([0, 0]);
    }
  }, [selectFac]);

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
        {facScCctvs.map((cctv, index) => (
          <FacCctvPopupBox key={index} index={index} cctvInfo={cctv} />
        ))}
      </Popup>
    )
  );
};

export default FacCctvPopup;
