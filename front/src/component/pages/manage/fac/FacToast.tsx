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
import { useFacStore } from '@/component/stores/facStore';
import { FAC_TOAST } from '@/component/constants/facConst';

const FacToast = () => {
  const { toastKey, setToastKey } = useFacStore(
    useShallow((state) => ({
      toastKey:    state.toastKey,
      setToastKey: state.actions.setToastKey,
    })),
  );

  useEffect(() => {
    if (toastKey !== FAC_TOAST.NONE) {
      const timer = setTimeout(() => setToastKey(FAC_TOAST.NONE), 2000);
      return () => clearTimeout(timer);
    }
  }, [toastKey]);

  const clear = () => setToastKey(FAC_TOAST.NONE);

  return (
    <>
      <StyledToast $isOpened={toastKey === FAC_TOAST.NO_AREA} $isWarn={false}>
        <i /><p>경로당 지역을 선택하세요</p>
        <StyledClsBtn onClick={clear} />
      </StyledToast>
      <StyledToast $isOpened={toastKey === FAC_TOAST.RELOAD_SUCCESS} $isWarn={false}>
        <i /><p>성공적으로 조회했습니다.</p>
        <StyledClsBtn onClick={clear} />
      </StyledToast>
      <StyledToast $isOpened={toastKey === FAC_TOAST.RELOAD_FAILURE} $isWarn={true}>
        <i /><p>조회에 실패했습니다.</p>
        <StyledClsBtn onClick={clear} />
      </StyledToast>
    </>
  );
};

export default FacToast;

const StyledToast = styled.div<{ $isOpened: boolean; $isWarn: boolean }>`
  ${CommonToast}
  i { ${({ $isWarn }) => ($isWarn ? CommonToastIconWarn : CommonToastIconNorm)} }
  border: 1px solid ${({ $isWarn }) => ($isWarn ? '#f65569' : '#7a45ff')};
  ${({ $isOpened }) => ($isOpened ? CommonToastShow : CommonToastHide)}
`;

const StyledClsBtn = styled.button`
  ${CommonToastClsBtn}
`;
