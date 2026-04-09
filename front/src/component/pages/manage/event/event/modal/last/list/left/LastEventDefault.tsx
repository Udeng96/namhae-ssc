import styled from 'styled-components';
import moment from 'moment';
import { useShallow } from 'zustand/react/shallow';
import { useEventStore } from '@/component/stores/eventStore';
import { useHomeStore } from '@/component/stores/homeStore';
import { EventResultItem } from '@/component/types/event';

const LastEventDefault = () => {
  const { lastEventList, lastSelectEvent, setLastSelectEvent } = useEventStore(
    useShallow((state) => ({
      lastEventList:      state.lastEventList,
      lastSelectEvent:    state.lastSelectEvent,
      setLastSelectEvent: state.actions.setLastSelectEvent,
    })),
  );
  const scFacs = useHomeStore((state) => state.scFacs);

  const resolvePlacNm = (outbPlac: string) => {
    if (outbPlac.includes('_') && scFacs.length > 0) {
      return scFacs.find((f) => f.mgtNo === outbPlac)?.facNm ?? '-';
    }
    return outbPlac;
  };

  const handleEvent = (item: EventResultItem) => {
    setLastSelectEvent(
      lastSelectEvent?.statEvetOutbSeqn === item.statEvetOutbSeqn ? null : item,
    );
  };

  return (
    <StyledDefault>
      {lastEventList.map((item) => (
        <StyledItem
          key={item.statEvetOutbSeqn}
          $isActive={lastSelectEvent?.statEvetOutbSeqn === item.statEvetOutbSeqn}
          onClick={() => handleEvent(item)}
        >
          <StyledRow>
            <StyledCell>{item.statEvetNm}</StyledCell>
            <StyledCell>{item.znNm}</StyledCell>
            <StyledCell>{resolvePlacNm(item.outbPlac)}</StyledCell>
            <StyledCell>
              {moment(item.outbDtm, 'YYYYMMDDHHmmss').format('YYYY-MM-DD HH:mm:ss')}
            </StyledCell>
          </StyledRow>
        </StyledItem>
      ))}
    </StyledDefault>
  );
};

export default LastEventDefault;

const StyledDefault = styled.div`
  width: 100%;
  height: 375px;
`;

const StyledItem = styled.div<{ $isActive: boolean }>`
  display: flex;
  align-items: center;
  height: 39px;
  width: 438px;
  border-radius: 7px;
  border: 1px solid ${({ $isActive }) => ($isActive ? '#7A45FF' : '#3E4165')};
  background: ${({ $isActive }) => ($isActive ? '#261E5E' : '#2A2E54')};
  cursor: pointer;

  &:hover {
    border-color: ${({ $isActive }) => ($isActive ? '#7A45FF' : '#543FAF')};
    background: ${({ $isActive }) => ($isActive ? '#261E5E' : '#363B5E')};
  }

  + div { margin-top: 3px; }
`;

const StyledRow = styled.ul`
  display: flex;
  align-items: center;
  width: 100%;
  padding: 0 8px;
`;

const StyledCell = styled.li`
  height: 24px;
  padding: 0 6px;
  font-size: 13px;
  color: #fff;
  font-weight: 400;
  line-height: 24px;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;

  &:nth-child(1) { width: 70px; }
  &:nth-child(2) { width: 76px; }
  &:nth-child(3) { width: 138px; }
  &:nth-child(4) { width: 146px; }
`;
