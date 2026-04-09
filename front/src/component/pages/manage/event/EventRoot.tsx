import styled from 'styled-components';
import { useShallow } from 'zustand/react/shallow';
import { useFacStore } from '@/component/stores/facStore';
import EventListArea from './event/EventListArea';
import LastEvent     from './event/modal/last/LastEvent';
import EventGisBox   from './event/gis/EventGisBox';

import EventToast from './EventToast';
// 화상회의 팝업 — refac 완료
import ConfPopup  from './event/modal/conf/ConfPopup';
// SMS 관련 — refac 완료
import SmsModal         from './event/modal/sms/SmsModal';
import ConfirmModal     from './event/modal/sms/confirm/ConfirmModal';
import PresetPopup      from './event/modal/sms/popup/PresetPopup';
import TargetModal      from './event/modal/sms/target/TargetModal';
import BroadTargetModal from './event/modal/sms/target/BroadTargetModal';
import BellEventAlarm   from './alarm/BellEventAlarm';

const EventRoot = ({ isShow }: { isShow: boolean }) => {
  const { crimeCctvs, scCctvs } = useFacStore(
    useShallow((s) => ({ crimeCctvs: s.crimeCctvs, scCctvs: s.scCctvs })),
  );

  const isLoading = crimeCctvs.length === 0 || scCctvs.length === 0;

  return (
    <StyledEvent $isShow={isShow}>
      <BellEventAlarm />
      <EventListArea />
      <ConfPopup />
      <EventToast />
      {isShow && (
        <>
          <EventGisBox />
          <LastEvent />
          <ConfirmModal />
          <SmsModal />
          <TargetModal />
          <BroadTargetModal />
          <PresetPopup />
          {isLoading && <StyledSpinner />}
        </>
      )}
    </StyledEvent>
  );
};

export default EventRoot;

const StyledEvent = styled.section<{ $isShow: boolean }>`
  display: ${({ $isShow }) => ($isShow ? 'block' : 'none')};
  position: relative;
  width: 100%;
  height: 100%;
`;

const StyledSpinner = styled.div`
  position: absolute;
  inset: 0;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(15, 18, 35, 0.8);

  &::after {
    content: '';
    width: 48px;
    height: 48px;
    border: 4px solid rgba(127, 122, 255, 0.3);
    border-top-color: #7f7aff;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;
