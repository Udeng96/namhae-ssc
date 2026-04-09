import styled from 'styled-components';
import {
  CommonBox,
  CommonBoxBtn,
  CommonBoxBtnLeft,
  CommonBoxBtnLeftCls,
  CommonBoxCls,
  CommonBoxDimmed,
  CommonBoxOpen,
} from '@/component/lib/css';
import { useShallow } from 'zustand/react/shallow';
import { useEventStore } from '@/component/stores/eventStore';
import EventHead from './EventHead';
import EventBody from './EventBody';

const EventListArea = () => {
  const { isBoxOpen, setIsBoxOpen } = useEventStore(
    useShallow((state) => ({
      isBoxOpen: state.isBoxOpen,
      setIsBoxOpen: state.actions.setIsBoxOpen,
    })),
  );

  return (
    <StyledEventListBox $isOpen={isBoxOpen}>
      <StyledEventListBoxDimmed />
      <StyledEventBtn $isOpen={isBoxOpen} onClick={() => setIsBoxOpen(!isBoxOpen)} />
      <EventHead />
      <EventBody />
    </StyledEventListBox>
  );
};

export default EventListArea;

const StyledEventListBox = styled.div<{ $isOpen: boolean }>`
  ${CommonBox};
  ${({ $isOpen }) => ($isOpen ? CommonBoxOpen : CommonBoxCls)}
  top: 0;
`;

const StyledEventListBoxDimmed = styled.div`
  ${CommonBoxDimmed}
`;

const StyledEventBtn = styled.button<{ $isOpen: boolean }>`
  ${CommonBoxBtn};
  left: 100%;
  ${({ $isOpen }) => ($isOpen ? CommonBoxBtnLeftCls : CommonBoxBtnLeft)}
`;
