import styled from 'styled-components';
import { useShallow } from 'zustand/react/shallow';
import { CommonScrollBar, CommonScrollBox } from '@/component/lib/css';
import { EventResultItem } from '@/component/types/event';
import { useFireStore } from '@/component/stores/fireStore';
import FireSuccessRow from './FireSuccessRow';
import FireSuccessMore from './FireSuccessMore';

interface Props {
  eventItems: EventResultItem[];
}

const FireSuccess = ({ eventItems }: Props) => {
  const { openDetailList, newEventList, selectEvent, setSelectEvent, setNewEventList } =
    useFireStore(
      useShallow((state) => ({
        openDetailList:  state.openDetailList,
        newEventList:    state.newEventList,
        selectEvent:     state.selectEvent,
        setSelectEvent:  state.actions.setSelectEvent,
        setNewEventList: state.actions.setNewEventList,
      })),
    );

  const handleSelect = (item: EventResultItem) => {
    if (newEventList.includes(item.statEvetOutbSeqn)) {
      setNewEventList(newEventList.filter((id) => id !== item.statEvetOutbSeqn));
    }
    if (selectEvent?.statEvetOutbSeqn === item.statEvetOutbSeqn) {
      setSelectEvent(null);
    } else {
      setSelectEvent(item);
    }
  };

  return (
    <StyledSuccess>
      {eventItems.map((item) => {
        const seqn     = item.statEvetOutbSeqn;
        const isNew    = newEventList.includes(seqn);
        const isActive = selectEvent?.statEvetOutbSeqn === seqn;
        const isOpen   = openDetailList.includes(seqn);

        return (
          <StyledWrap key={seqn} onClick={() => handleSelect(item)}>
            <StyledBox $isNew={isNew} $isActive={isActive} $isOpen={isOpen}>
              <FireSuccessRow item={item} />
              {isOpen && <FireSuccessMore eventItem={item} />}
            </StyledBox>
          </StyledWrap>
        );
      })}
    </StyledSuccess>
  );
};

export default FireSuccess;

const StyledSuccess = styled.div`
  ${CommonScrollBox};
  ${CommonScrollBar};
  padding-right: 8px;
  height: 627px;
`;

const StyledWrap = styled.div`
  + div {
    margin-top: 5px;
  }
`;

const StyledBox = styled.div<{ $isNew: boolean; $isActive: boolean; $isOpen: boolean }>`
  display: flex;
  flex-wrap: wrap;
  width: 468px;
  height: ${({ $isOpen }) => ($isOpen ? '122px' : '39px')};
  padding: 5px 8px 5px 11px;
  border-radius: 7px;
  justify-content: center;
  cursor: pointer;
  flex-direction: column;
  box-shadow: ${({ $isNew }) => ($isNew ? '0px 0px 3px 0px rgba(247, 57, 66, 0.9)' : 'none')};
  animation: ${({ $isNew }) => ($isNew ? 'alarm 1500ms ease-in-out infinite' : 'none')};
  border: 1px solid
    ${({ $isNew, $isActive }) =>
      $isNew ? '#F73942' : $isActive ? '#7A45FF' : '#2A2E54'};
  background: ${({ $isActive }) => ($isActive ? '#261E5E' : '#1A203A')};

  &:hover {
    border-color: ${({ $isNew, $isActive }) =>
      $isNew ? '#F73942' : $isActive ? '#7A45FF' : '#543FAF'};
    background: ${({ $isActive }) => ($isActive ? '#261E5E' : '#2A2E54')};
  }
`;
