import styled from 'styled-components';
import { useShallow } from 'zustand/react/shallow';
import { useMutation } from '@tanstack/react-query';
import { useCommonStore } from '@/component/stores/commonStore';
import { useScheStore }   from '@/component/stores/scheStore';
import { deleteSchedule } from '@/component/api/scheApi';
import { SCHE_MODAL_TYPE, SCHE_SAVE_RESULT, SCHE_TOAST_TYPE } from '@/component/constants/scheConst';

const DelFoot = () => {
  const setModal = useCommonStore((s) => s.actions.setModal);

  const { activeSche, setActiveSche, setScheToast, setRequestState } = useScheStore(
    useShallow((s) => ({
      activeSche:      s.activeSche,
      setActiveSche:   s.actions.setActiveSche,
      setScheToast:    s.actions.setScheToast,
      setRequestState: s.actions.setRequestState,
    })),
  );

  const delMutation = useMutation(
    async () => {
      const res = await deleteSchedule(activeSche!.contentGrpId);
      return res.data;
    },
    {
      onSuccess: (data) => {
        if (data === SCHE_SAVE_RESULT.SUCCESS) {
          setScheToast(SCHE_TOAST_TYPE.DEL_SUCCESS);
          setActiveSche(null);
          setRequestState('all');
        } else {
          setScheToast(SCHE_TOAST_TYPE.DEL_FAILED);
        }
        setModal(SCHE_MODAL_TYPE.NONE);
      },
    },
  );

  return (
    <StyledFoot>
      <StyledClsBtn onClick={() => setModal(SCHE_MODAL_TYPE.NONE)}>취소</StyledClsBtn>
      <StyledDelBtn onClick={() => delMutation.mutate()}>삭제</StyledDelBtn>
    </StyledFoot>
  );
};

export default DelFoot;

const StyledFoot = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 0 8px;
  padding: 16px 32px 24px;
`;

const btnBase = `
  display: flex;
  align-items: center;
  justify-content: center;
  width: 86px;
  height: 34px;
  font-size: 13px;
  font-weight: 500;
  border-radius: 6px;
  cursor: pointer;
`;

const StyledClsBtn = styled.button`
  ${btnBase}
  color: #A8AFBD;
  border: 1px solid #2A2E54;
  background: #0F1223;
  &:hover { color: #FFF; border-color: #3E4165; background: #1A203A; }
`;

const StyledDelBtn = styled.button`
  ${btnBase}
  color: #FFF;
  border: transparent;
  background: #FF5147;
  &:hover { background: #FF7373; box-shadow: 0 10px 12px rgba(122,69,255,.24); }
  &:disabled { background: #32236B; color: #8C84AC; pointer-events: none; }
`;
