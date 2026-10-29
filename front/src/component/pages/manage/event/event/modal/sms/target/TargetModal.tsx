import styled from 'styled-components';
import { useEffect, useState } from 'react';
import { useShallow } from 'zustand/react/shallow';
import {
  CommonModal,
  CommonModalDimmed,
  CommonModalHide,
  CommonModalShow,
  CommonScrollBar,
  CommonScrollBox,
} from '@/component/lib/css';
import { MODAL_IMAGE } from '@/component/lib/constImage';
import { useEventStore } from '@/component/stores/eventStore';
import TargetTree from './TargetTree';

import TargetIcon from '@/assets/images/dark/page/Management_Dashboard/icon/icon_title_pop_eventTarget 1.png';

const TargetModal = () => {
  const { openOpt, sms, setSms, setOpenOpt } = useEventStore(
    useShallow((state) => ({
      openOpt:    state.openOpt,
      sms:        state.sms,
      setSms:     state.actions.setSms,
      setOpenOpt: state.actions.setOpenOpt,
    })),
  );

  // 모달 열릴 때 현재 선택 상태 스냅샷 (취소 시 복원)
  const [snapshot, setSnapshot] = useState<string[]>([]);

  useEffect(() => {
    if (openOpt === 'target') setSnapshot(sms.selectedTargets);
  }, [openOpt]);

  const handleCancel = () => {
    setSms({ selectedTargets: snapshot });
    setOpenOpt('sms');
  };

  const handleApply = () => setOpenOpt('sms');

  const isOpen = openOpt === 'target';

  return (
    <StyledWrap $isOpen={isOpen}>
      <StyledDimmed />
      <StyledBox>
        <StyledHead>
          <StyledTitle>
            이벤트 전파 대상 선택 <span>SMS</span>
          </StyledTitle>
          <StyledClsBtn onClick={handleCancel} />
        </StyledHead>
        <StyledBody>
          <StyledScroll>
            <TargetTree />
          </StyledScroll>
          <StyledBtnWrap>
            <StyledBtn onClick={handleCancel}>취소</StyledBtn>
            <StyledBtn onClick={handleApply}>적용</StyledBtn>
          </StyledBtnWrap>
        </StyledBody>
      </StyledBox>
    </StyledWrap>
  );
};

export default TargetModal;

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
  height: 450px;
  background-color: rgba(0,0,0,.8);
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border-radius: 16px;
`;

const StyledHead = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 64px;
  padding: 6px 12px 4px 24px;
  border-radius: 12px 12px 0 0;
  background-image: linear-gradient(334deg, #2a2c7a 37%, #292564 100%);
`;

const StyledTitle = styled.div`
  display: flex;
  align-items: center;
  font-size: 19px;
  color: #f5f8ff;
  gap: 10px;
  span { color: #9C7BFF; }

  &::before {
    content: '';
    display: block;
    width: 34px;
    height: 34px;
    background: url(${TargetIcon}) no-repeat 100% / contain;
  }
`;

const StyledClsBtn = styled.button`
  width: 34px;
  height: 34px;
  background: url(${MODAL_IMAGE.CLS.BASE}) no-repeat center;
  &:hover { background-image: url(${MODAL_IMAGE.CLS.HOVER}); }
`;

const StyledBody = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  width: 100%;
  height: calc(100% - 64px);
  gap: 19px;
  border-radius: 0 0 12px 12px;
  background-image: linear-gradient(334deg, #1a1b3a, #202249 90%);
`;

const StyledScroll = styled.div`
  width: 368px;
  height: 296px;
  padding: 18px 19px 18px 20px;
  border-radius: 7px;
  border: 1px solid #2F335C;
  background-color: #0F1223;
  ${CommonScrollBox};
  ${CommonScrollBar};
`;

const StyledBtnWrap = styled.div`
  display: flex;
  justify-content: center;
  gap: 8px;
`;

const StyledBtn = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 86px;
  height: 34px;
  border-radius: 6px;
  background-color: #2A2E54;
  font-family: 'SCDreamM', sans-serif;
  font-size: 13px;
  color: #fff;
  cursor: pointer;
  &:hover { background-color: #7A45FF; }
`;
