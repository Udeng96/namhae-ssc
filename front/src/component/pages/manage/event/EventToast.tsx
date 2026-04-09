import styled from 'styled-components';
import { useEffect } from 'react';
import {
  CommonToast,
  CommonToastClsBtn,
  CommonToastHide,
  CommonToastIconNorm,
  CommonToastIconWarn,
  CommonToastShow,
} from '@/component/lib/css';
import { useEventStore } from '@/component/stores/eventStore';

/* ─── 토스트 메시지 맵 ──────────────────────────────── */
const TOAST_MAP: Record<string, { msg: string; warn: boolean }> = {
  // 소켓
  socket_on:               { msg: '실시간 이벤트를 수신합니다.',                             warn: false },
  socket_off:              { msg: '실시간 이벤트 수신이 중단됩니다.',                          warn: true  },
  // 소방 공유
  share_success:           { msg: '이벤트 공유에 성공했습니다.',                              warn: false },
  share_failure:           { msg: '이벤트 공유에 실패했습니다.',                              warn: true  },
  // SMS/방송 전파
  SEND_MSG_SUCCESS:        { msg: '이벤트 전파를 성공하였습니다.',                             warn: false },
  SEND_MSG_FAILED:         { msg: '이벤트 전파에 실패하였습니다.',                             warn: true  },
  // 화상회의 개설
  conf_create_success:     { msg: '성공적으로 회의를 개설했습니다.',                           warn: false },
  conf_create_failure:     { msg: '회의 개설에 실패했습니다.',                               warn: true  },
  conf_create_already:     { msg: '개설된 회의가 존재합니다. 종료 후 다시 요청해주세요.',           warn: true  },
  // 화상회의 종료
  conf_close_success:      { msg: '성공적으로 회의를 종료했습니다.',                           warn: false },
  conf_close_failure:      { msg: '회의 종료에 실패했습니다.',                               warn: true  },
  // 화상회의 참가
  CONF_PARTICIPANT_SUCCESS: { msg: '성공적으로 회의를 참가했습니다.',                          warn: false },
  CONF_PARTICIPANT_FAILURE: { msg: '회의 참가에 실패했습니다.',                              warn: true  },
};

/* ─── 컴포넌트 ──────────────────────────────────────── */
const EventToast = () => {
  const toastKey    = useEventStore((s) => s.toastKey);
  const setToastKey = useEventStore((s) => s.actions.setToastKey);

  const toast = toastKey ? TOAST_MAP[toastKey] : null;

  // 2초 후 자동 닫기
  useEffect(() => {
    if (!toastKey) return;
    const id = setTimeout(() => setToastKey(''), 2000);
    return () => clearTimeout(id);
  }, [toastKey]);

  return (
    <StyledToastBox $isOpened={!!toast} $isWarn={toast?.warn ?? false}>
      <i />
      <p>{toast?.msg ?? ''}</p>
      <StyledClsBtn onClick={() => setToastKey('')} />
    </StyledToastBox>
  );
};

export default EventToast;

/* ─── Styled ─────────────────────────────────────────── */
const StyledToastBox = styled.div<{ $isOpened: boolean; $isWarn: boolean }>`
  ${CommonToast};
  z-index: 1100;
  i {
    ${({ $isWarn }) => ($isWarn ? CommonToastIconWarn : CommonToastIconNorm)}
  }
  border: 1px solid ${({ $isWarn }) => ($isWarn ? '#F65569' : '#7A45FF')};
  ${({ $isOpened }) => ($isOpened ? CommonToastShow : CommonToastHide)}
`;

const StyledClsBtn = styled.button`
  ${CommonToastClsBtn}
`;
