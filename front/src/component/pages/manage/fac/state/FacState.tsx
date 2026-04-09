import styled from 'styled-components';
import { useEffect } from 'react';
import { useShallow } from 'zustand/react/shallow';
import {
  CommonBox,
  CommonBoxBtn,
  CommonBoxBtnRight,
  CommonBoxBtnRightCls,
  CommonBoxDimmed,
  CommonRightBoxCls,
  CommonRightBoxOpen,
} from '@/component/lib/css';
import { useFacStore } from '@/component/stores/facStore';
import FacStateHead from './FacStateHead';
import FacStateBody from './FacStateBody';

const FacState = () => {
  const { selectFac, stateOpen, setStateOpen } = useFacStore(
    useShallow((s) => ({
      selectFac:    s.selectFac,
      stateOpen:    s.stateOpen,
      setStateOpen: s.actions.setStateOpen,
    })),
  );

  // 시설 선택 시 패널 자동 열기 / 해제 시 닫기
  useEffect(() => {
    setStateOpen(!!selectFac);
  }, [selectFac]);

  // 토글 버튼 — 시설이 선택된 경우에만 동작
  const handleBtn = () => {
    if (selectFac) setStateOpen(!stateOpen);
  };

  return (
    <StyledState $isOpen={stateOpen}>
      <StyledDimmed />
      <StyledBtn $isOpen={stateOpen} onClick={handleBtn} />
      <FacStateHead />
      <FacStateBody />
    </StyledState>
  );
};

export default FacState;

const StyledState = styled.div<{ $isOpen: boolean }>`
  ${CommonBox};
  z-index: 9;
  top: 0;
  width: 482px;
  ${({ $isOpen }) => ($isOpen ? CommonRightBoxOpen : CommonRightBoxCls)}
  transition: right 550ms ease;
`;

const StyledDimmed = styled.div`
  ${CommonBoxDimmed}
`;

const StyledBtn = styled.button<{ $isOpen: boolean }>`
  ${CommonBoxBtn};
  ${({ $isOpen }) => ($isOpen ? CommonBoxBtnRightCls : CommonBoxBtnRight)};
  right: ${({ $isOpen }) => ($isOpen ? '482px' : 'unset')};
  left: ${({ $isOpen }) => ($isOpen ? 'unset' : '-25px')};
`;
