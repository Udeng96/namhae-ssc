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
import BroadTargetTree from './BroadTargetTree';
import BroadGisArea    from './gis/BroadGisArea';

import TargetIcon from '@/assets/images/dark/page/Management_Dashboard/icon/icon_title_pop_eventTarget 1.png';

const BroadTargetModal = () => {
  const { openOpt, broadcast, setBroadcast, setOpenOpt } = useEventStore(
    useShallow((state) => ({
      openOpt:      state.openOpt,
      broadcast:    state.broadcast,
      setBroadcast: state.actions.setBroadcast,
      setOpenOpt:   state.actions.setOpenOpt,
    })),
  );

  const [snapshot, setSnapshot] = useState<string[]>([]);

  useEffect(() => {
    if (openOpt === 'broadTarget') setSnapshot(broadcast.selectedTargets);
  }, [openOpt]);

  const handleCancel = () => {
    setBroadcast({ selectedTargets: snapshot });
    setOpenOpt('sms');
  };

  const handleApply = () => setOpenOpt('sms');

  const isOpen = openOpt === 'broadTarget';

  return (
    <StyledWrap $isOpen={isOpen}>
      <StyledDimmed />
      <StyledBox>
        <StyledHead>
          <StyledTitle>
            이벤트 전파 대상 선택 <span>마을방송</span>
          </StyledTitle>
          <StyledClsBtn onClick={handleCancel} />
        </StyledHead>
        <StyledBody>
          <StyledTreeScroll>
            <BroadTargetTree />
          </StyledTreeScroll>
          <StyledGis>
            <BroadGisArea />
          </StyledGis>
        </StyledBody>
        <StyledBtnWrap>
          <StyledBtn onClick={handleCancel}>취소</StyledBtn>
          <StyledBtn onClick={handleApply}>적용</StyledBtn>
        </StyledBtnWrap>
      </StyledBox>
    </StyledWrap>
  );
};

export default BroadTargetModal;

/* ─── Styled ─────────────────────────────────────────── */
const StyledWrap = styled.div<{ $isOpen: boolean }>`
  ${CommonModal};
  ${({ $isOpen }) => ($isOpen ? CommonModalShow : CommonModalHide)};
`;

const StyledDimmed = styled.div`
  ${CommonModalDimmed};
`;

const StyledBox = styled.div`
  width: 1344px;
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

const StyledClsBtn = styled.div`
  width: 34px;
  height: 34px;
  background: url(${MODAL_IMAGE.CLS.BASE}) no-repeat center;
  cursor: pointer;
  &:hover { background-image: url(${MODAL_IMAGE.CLS.HOVER}); }
`;

const StyledBody = styled.div`
  position: relative;
  display: flex;
  padding: 20px;
  justify-content: center;
  gap: 16px;
  background-image: linear-gradient(334deg, #1a1b3a, #202249 90%);
`;

const StyledTreeScroll = styled.div`
  ${CommonScrollBox};
  ${CommonScrollBar};
  width: 336px;
  height: 100%;
  padding: 24px 8px 24px 24px;
`;

const StyledGis = styled.div`
  width: 960px;
  height: 540px;
  border-radius: 8px;
  border: 1px solid #2F335C;
`;

const StyledBtnWrap = styled.div`
  height: 76px;
  background: #161640;
  border-radius: 0 0 12px 12px;
  display: flex;
  padding: 10px 0 32px;
  justify-content: center;
  align-items: center;
  gap: 10px;
`;

const StyledBtn = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 86px;
  height: 34px;
  border-radius: 6px;
  background: #2A2E54;
  font-family: 'SCDreamM', sans-serif;
  font-size: 13px;
  color: #fff;
  cursor: pointer;
  &:hover { background: #363A63; }
`;
