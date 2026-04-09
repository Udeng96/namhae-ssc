import styled from 'styled-components';
import { useShallow } from 'zustand/react/shallow';
import {
  CommonBox,
  CommonBoxBtn,
  CommonBoxBtnLeft,
  CommonBoxBtnLeftCls,
  CommonBoxCls,
  CommonBoxDimmed,
  CommonBoxOpen,
} from '@/component/lib/css';
import { useFireStore } from '@/component/stores/fireStore';
import FireEventHead from './FireEventHead';
import FireEventBody from './FireEventBody';

const FireEventArea = () => {
  const { isBoxOpen, setIsBoxOpen } = useFireStore(
    useShallow((state) => ({
      isBoxOpen:    state.isBoxOpen,
      setIsBoxOpen: state.actions.setIsBoxOpen,
    })),
  );

  return (
    <StyledBox $isOpen={isBoxOpen}>
      <StyledDimmed />
      <StyledToggleBtn $isOpen={isBoxOpen} onClick={() => setIsBoxOpen(!isBoxOpen)} />
      <FireEventHead />
      <FireEventBody />
    </StyledBox>
  );
};

export default FireEventArea;

const StyledBox = styled.div<{ $isOpen: boolean }>`
  ${CommonBox};
  ${({ $isOpen }) => ($isOpen ? CommonBoxOpen : CommonBoxCls)}
  top: 0;
  z-index: 2;
`;

const StyledDimmed = styled.div`
  ${CommonBoxDimmed}
`;

const StyledToggleBtn = styled.button<{ $isOpen: boolean }>`
  ${CommonBoxBtn};
  left: 100%;
  ${({ $isOpen }) => ($isOpen ? CommonBoxBtnLeftCls : CommonBoxBtnLeft)}
`;
