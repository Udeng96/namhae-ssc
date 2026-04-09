import styled from 'styled-components';
import {
  CommonModal,
  CommonModalDimmed,
  CommonModalHide,
  CommonModalShow,
} from '@/component/lib/css';
import { MODAL_IMAGE } from '@/component/lib/constImage';
import { useShallow } from 'zustand/react/shallow';
import { useEventStore } from '@/component/stores/eventStore';
import { SMS_PRESET } from '@/component/constants/eventCode';

const PresetPopup = () => {
  const { openOpt, sms, broadcast, setSms, setBroadcast, setOpenOpt } = useEventStore(
    useShallow((state) => ({
      openOpt:      state.openOpt,
      sms:          state.sms,
      broadcast:    state.broadcast,
      setSms:       state.actions.setSms,
      setBroadcast: state.actions.setBroadcast,
      setOpenOpt:   state.actions.setOpenOpt,
    })),
  );

  const isSmsPreset = openOpt === 'preset';
  const isOpen      = isSmsPreset || openOpt === 'presetBroad';

  const handleCancel = () => {
    // 프리셋 선택 취소 → 직접입력으로 복원
    if (isSmsPreset)  setSms({ preset: SMS_PRESET[0] });
    else              setBroadcast({ preset: SMS_PRESET[0] });
    setOpenOpt('sms');
  };

  const handleApply = () => {
    // 프리셋 내용 적용
    if (isSmsPreset) {
      setSms({ content: sms.preset.msg });
    } else {
      setBroadcast({ content: broadcast.preset.msg });
    }
    setOpenOpt('sms');
  };

  return (
    <StyledWrap $isOpen={isOpen}>
      <StyledDimmed />
      <StyledBox>
        <StyledHead>
          <StyledTitle>
            <span>프리셋</span> 알림
          </StyledTitle>
          <StyledClsBtn onClick={handleCancel} />
        </StyledHead>
        <StyledBody>
          <StyledContent>
            <p>선택하신 프리셋으로 내용이 변경됩니다.</p>
            <p>입력 중인 내용은 사라집니다. 진행하시겠습니까?</p>
          </StyledContent>
        </StyledBody>
        <StyledBtnArea>
          <StyledBtn onClick={handleCancel}>취소</StyledBtn>
          <StyledBtn onClick={handleApply}>확인</StyledBtn>
        </StyledBtnArea>
      </StyledBox>
    </StyledWrap>
  );
};

export default PresetPopup;

/* ─── Styled ─────────────────────────────────────────── */
const StyledWrap = styled.div<{ $isOpen: boolean }>`
  ${CommonModal};
  ${({ $isOpen }) => ($isOpen ? CommonModalShow : CommonModalHide)};
`;

const StyledDimmed = styled.div`
  ${CommonModalDimmed};
`;

const StyledBox = styled.div`
  width: 408px;
  background-color: rgba(0,0,0,.8);
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

const StyledHead = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 72px;
  padding: 33px 24px 22px 31px;
  border-radius: 12px 12px 0 0;
  border: 1px solid #7A45FF;
  box-shadow: 0 0.58px 2.88px 0 rgba(0,0,0,.2), inset 0 0.58px 0 0 rgba(232,232,232,.18);
`;

const StyledTitle = styled.div`
  display: flex;
  align-items: center;
  font-size: 18px;
  color: #f5f8ff;
  gap: 10px;
  span { color: #FF5147; }
`;

const StyledClsBtn = styled.button`
  width: 30px;
  height: 30px;
  background: url(${MODAL_IMAGE.CLS.BASE}) no-repeat center;
  &:hover { background-image: url(${MODAL_IMAGE.CLS.HOVER}); }
`;

const StyledBody = styled.div`
  display: flex;
  padding: 24px 32px;
  flex-direction: column;
  align-items: center;
  width: 100%;
  border-right: 1px solid #7A45FF;
  border-left: 1px solid #7A45FF;
`;

const StyledContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
  height: 56px;
  font-size: 17px;
  color: #F2F4FC;
  font-weight: 400;
  line-height: 1;
`;

const StyledBtnArea = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;
  width: 100%;
  height: 72px;
  padding: 16px 32px 24px 0;
  border-radius: 0 0 12px 12px;
  border: 1px solid #7A45FF;
`;

const StyledBtn = styled.button`
  width: 86px;
  height: 34px;
  border-radius: 6px;
  border: 1px solid #2A2E54;
  background: #0F1223;
  font-family: 'SCDreamM', sans-serif;
  font-size: 13px;
  color: #fff;
  &:hover { border-color: #3E4165; background: #1A203A; }
`;
