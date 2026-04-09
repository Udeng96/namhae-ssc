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
import { useFacStore } from '@/component/stores/facStore';
import FacListHead from './FacListHead';
import FacListBody from './FacListBody';

const FacList = () => {
  const { listOpen, setListOpen } = useFacStore(
    useShallow((state) => ({
      listOpen:    state.listOpen,
      setListOpen: state.actions.setListOpen,
    })),
  );

  return (
    <StyledList $isOpen={listOpen}>
      <StyledDimmed />
      <StyledBtn $isOpen={listOpen} onClick={() => setListOpen(!listOpen)} />
      <FacListHead />
      <FacListBody />
    </StyledList>
  );
};

export default FacList;

const StyledList = styled.div<{ $isOpen: boolean }>`
  ${CommonBox};
  ${({ $isOpen }) => ($isOpen ? CommonBoxOpen : CommonBoxCls)};
  top: 0;
`;

const StyledDimmed = styled.div`
  ${CommonBoxDimmed}
`;

const StyledBtn = styled.button<{ $isOpen: boolean }>`
  ${CommonBoxBtn};
  left: 100%;
  ${({ $isOpen }) => ($isOpen ? CommonBoxBtnLeftCls : CommonBoxBtnLeft)}
`;
