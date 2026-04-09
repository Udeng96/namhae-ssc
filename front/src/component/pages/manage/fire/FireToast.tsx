import styled from 'styled-components';
import { useEffect } from 'react';
import { useShallow } from 'zustand/react/shallow';
import {
  CommonToast,
  CommonToastClsBtn,
  CommonToastHide,
  CommonToastIconNorm,
  CommonToastIconWarn,
  CommonToastShow,
} from '@/component/lib/css';
import { useFireStore } from '@/component/stores/fireStore';

const TOAST_NONE = '';

const WARN_KEYS = new Set([
  'search_no_area', 'search_no_type',
  'share_fail', 'conf_create_fail', 'conf_close_fail', 'conf_participant_fail',
  'fire_alarm_on_fail', 'fire_alarm_off_fail', 'bell_fail',
]);

const TOAST_MSG: Record<string, string> = {
  search_no_area:         '발생 지역을 선택하세요',
  search_no_type:         '이벤트 타입을 선택하세요',
  share_success:          '이벤트 공유에 성공했습니다.',
  share_fail:             '이벤트 공유에 실패했습니다.',
  conf_create_success:    '성공적으로 회의를 개설했습니다.',
  conf_create_fail:       '회의 개설에 실패했습니다.',
  conf_close_success:     '성공적으로 회의를 종료했습니다.',
  conf_close_fail:        '회의 종료에 실패했습니다.',
  conf_participant_success: '성공적으로 회의를 참가했습니다.',
  conf_participant_fail:  '회의 참가에 실패했습니다.',
  socket_on:              '실시간 이벤트를 수신합니다.',
  socket_off:             '실시간 이벤트 수신이 중단됩니다.',
  fire_alarm_on_success:  '경광봉이 켜졌습니다.',
  fire_alarm_on_fail:     '경광봉 켜기에 실패했습니다.',
  fire_alarm_off_success: '경광봉이 꺼졌습니다.',
  fire_alarm_off_fail:    '경광봉 끄기에 실패했습니다.',
  bell_fail:              '비상벨 CCTV 소리 전환에 실패하였습니다.',
};

const FireToast = () => {
  const { toastKey, setToastKey } = useFireStore(
    useShallow((state) => ({
      toastKey:    state.toastKey,
      setToastKey: state.actions.setToastKey,
    })),
  );

  useEffect(() => {
    if (toastKey !== TOAST_NONE) {
      const t = setTimeout(() => setToastKey(TOAST_NONE), 2000);
      return () => clearTimeout(t);
    }
  }, [toastKey]);

  if (toastKey === TOAST_NONE) return null;

  const msg   = TOAST_MSG[toastKey] ?? toastKey;
  const isWarn = WARN_KEYS.has(toastKey);

  return (
    <StyledToastBox $isOpened={true} $isWarn={isWarn}>
      <i />
      <p>{msg}</p>
      <StyledToastClsBtn onClick={() => setToastKey(TOAST_NONE)} />
    </StyledToastBox>
  );
};

export default FireToast;

const StyledToastBox = styled.div<{ $isOpened: boolean; $isWarn: boolean }>`
  ${CommonToast}
  i {
    ${({ $isWarn }) => ($isWarn ? CommonToastIconWarn : CommonToastIconNorm)}
  }
  border: 1px solid ${({ $isWarn }) => ($isWarn ? '#F65569' : '#7A45FF')};
  ${({ $isOpened }) => ($isOpened ? CommonToastShow : CommonToastHide)}
`;

const StyledToastClsBtn = styled.button`
  ${CommonToastClsBtn}
`;
