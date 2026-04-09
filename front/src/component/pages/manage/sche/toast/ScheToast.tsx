import styled from 'styled-components';
import { useEffect } from 'react';
import { useShallow } from 'zustand/react/shallow';
import {
  CommonToast, CommonToastClsBtn, CommonToastHide,
  CommonToastIconNorm, CommonToastIconWarn, CommonToastShow,
} from '@/component/lib/css';
import { useCommonStore } from '@/component/stores/commonStore';
import { useScheStore }   from '@/component/stores/scheStore';
import { SCHE_TOAST_TYPE } from '@/component/constants/scheConst';
import { USER_TYPE } from '@/component/constants/user';

const ScheToast = () => {
  const userInfo = useCommonStore((s) => s.userInfo);

  const { scheToast, setScheToast } = useScheStore(
    useShallow((s) => ({
      scheToast:    s.scheToast,
      setScheToast: s.actions.setScheToast,
    })),
  );

  useEffect(() => {
    if (scheToast !== SCHE_TOAST_TYPE.NONE) {
      const timer = setTimeout(() => setScheToast(SCHE_TOAST_TYPE.NONE), 2000);
      return () => clearTimeout(timer);
    }
  }, [scheToast]);

  const close = () => setScheToast(SCHE_TOAST_TYPE.NONE);

  const TOASTS: { type: string; msg: string; warn: boolean }[] = [
    { type: SCHE_TOAST_TYPE.OVER_DURATION,  msg: '최대 표출 시간을 초과했습니다.',           warn: true  },
    { type: SCHE_TOAST_TYPE.DUPLICATE_FILE, msg: '중복된 파일입니다.',                        warn: true  },
    { type: SCHE_TOAST_TYPE.SAVE_SUCCESS,   msg: '스케쥴 등록에 성공했습니다.',               warn: false },
    { type: SCHE_TOAST_TYPE.SAVE_FAILED,    msg: '스케쥴 등록에 실패했습니다.',               warn: true  },
    { type: SCHE_TOAST_TYPE.DEL_SUCCESS,    msg: '스케쥴 삭제에 성공했습니다.',               warn: false },
    { type: SCHE_TOAST_TYPE.DEL_FAILED,     msg: '스케쥴 삭제에 실패했습니다.',               warn: true  },
    { type: SCHE_TOAST_TYPE.EDIT_SUCCESS,   msg: '스케쥴 수정에 성공했습니다.',               warn: false },
    { type: SCHE_TOAST_TYPE.EDIT_FAILED,    msg: '스케쥴 수정에 실패했습니다.',               warn: true  },
  ];

  // 중복 토스트: 유저 타입에 따라 메시지 분기
  const isDupAdmin = scheToast === SCHE_TOAST_TYPE.DUPLICATE && userInfo?.userType === USER_TYPE.ADMIN;
  const isDupFire  = scheToast === SCHE_TOAST_TYPE.DUPLICATE && userInfo?.userType === USER_TYPE.FIRE;

  return (
    <>
      {TOASTS.map(({ type, msg, warn }) => (
        <StyledToast key={type} $isOpened={scheToast === type} $isWarn={warn}>
          <i />
          <p>{msg}</p>
          <StyledClsBtn onClick={close} />
        </StyledToast>
      ))}
      <StyledToast $isOpened={isDupAdmin} $isWarn>
        <i /><p>이미 해당 시간대에 표출중인 스케쥴이 존재합니다.</p>
        <StyledClsBtn onClick={close} />
      </StyledToast>
      <StyledToast $isOpened={isDupFire} $isWarn>
        <i /><p>이미 선택한 시간대에 등록해 놓은 스케쥴이 존재합니다. 관리자에게 문의하여 주세요.</p>
        <StyledClsBtn onClick={close} />
      </StyledToast>
    </>
  );
};

export default ScheToast;

const StyledToast = styled.div<{ $isOpened: boolean; $isWarn: boolean }>`
  ${CommonToast}
  i { ${({ $isWarn }) => ($isWarn ? CommonToastIconWarn : CommonToastIconNorm)} }
  border: 1px solid ${({ $isWarn }) => ($isWarn ? '#F65569' : '#7A45FF')};
  ${({ $isOpened }) => ($isOpened ? CommonToastShow : CommonToastHide)}
`;

const StyledClsBtn = styled.button`${CommonToastClsBtn}`;
