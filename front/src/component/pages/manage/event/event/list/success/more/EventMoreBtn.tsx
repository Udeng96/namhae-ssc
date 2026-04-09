import styled from 'styled-components';
import { EventResultItem } from '@/component/types/event';
import { EVENT_CODE } from '@/component/constants/eventCode';
import EventMoreBtnFire from './EventMoreBtnFire';
import EventMoreBtnSms from './EventMoreBtnSms';
import EventMoreBtnConf from './EventMoreBtnConf';

interface Props {
  eventItem: EventResultItem;
}

const EventMoreBtn = ({ eventItem }: Props) => {
  const isBell = eventItem.statEvetCd === EVENT_CODE.BELL;

  return (
    <StyledBtnArea>
      {isBell ? (
        <>
          <EventMoreBtnFire eventItem={eventItem} />
          <EventMoreBtnSms eventItem={eventItem} />
          <EventMoreBtnConf eventItem={eventItem} />
        </>
      ) : (
        <EventMoreBtnSms eventItem={eventItem} />
      )}
    </StyledBtnArea>
  );
};

export default EventMoreBtn;

const StyledBtnArea = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
`;
