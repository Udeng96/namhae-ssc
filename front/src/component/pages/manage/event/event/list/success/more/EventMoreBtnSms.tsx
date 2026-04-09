import styled from 'styled-components';
import { useEventStore } from '@/component/stores/eventStore';
import { EventResultItem } from '@/component/types/event';
import { EVENT_CODE } from '@/component/constants/eventCode';

interface Props {
  eventItem: EventResultItem;
}

const EventMoreBtnSms = ({ eventItem }: Props) => {
  const { setSmsEvent, setOpenOpt } = useEventStore((state) => state.actions);

  const handleSms = () => {
    setSmsEvent(eventItem);
    setOpenOpt('sms');
  };

  const isBell = eventItem.statEvetCd === EVENT_CODE.BELL;

  return (
    <StyledBtn $isBell={isBell} onClick={handleSms}>
      이벤트 전파
    </StyledBtn>
  );
};

export default EventMoreBtnSms;

const StyledBtn = styled.button<{ $isBell: boolean }>`
  width: 117px;
  height: ${({ $isBell }) => ($isBell ? '30px' : '64px')};
  font-size: 13px;
  font-weight: 500;
  color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 10px;
  cursor: pointer;
  background-color: #11a674;

  &:hover {
    background-color: #30be8e;
  }

  &:disabled {
    opacity: 0.3;
    pointer-events: none;
    cursor: default;
  }
`;
