import styled from 'styled-components';
import { useEffect, useMemo, useState } from 'react';
import { useShallow } from 'zustand/react/shallow';
import moment from 'moment';
import { EVENT_IMAGE } from '@/component/lib/eventImage';
import { useHomeStore } from '@/component/stores/homeStore';
import { useEventStore } from '@/component/stores/eventStore';
import { EventResultItem } from '@/component/types/event';

import { useConfStore } from '@/component/stores/confStore';

interface Props {
  item: EventResultItem;
}

const EventSuccessRow = ({ item }: Props) => {
  const scFacs = useHomeStore((state) => state.scFacs);
  const { openDetailList, setOpenDetailList } = useEventStore(
    useShallow((state) => ({
      openDetailList: state.openDetailList,
      setOpenDetailList: state.actions.setOpenDetailList,
    })),
  );
  const { conferenceSeqn, setConferenceSeqn } = useConfStore(
    useShallow((state) => ({
      conferenceSeqn: state.conferenceSeqn,
      setConferenceSeqn: state.actions.setConferenceSeqn,
    })),
  );

  const [isConfOpen, setIsConfOpen] = useState(false);

  // 경로당 이름 계산 (mgtNo 형식이면 scFacs에서 조회)
  const scNm = useMemo(() => {
    if (scFacs.length === 0) return '';
    if (item.outbPlac.includes('_')) {
      return scFacs.find((f) => f.mgtNo === item.outbPlac)?.facNm ?? '';
    }
    return item.outbPlac;
  }, [scFacs, item.outbPlac]);

  // 화상회의 상태 반영
  useEffect(() => {
    if (item.confStatus === '5') {
      setIsConfOpen(false);
      if (conferenceSeqn !== '' && item.statEvetOutbSeqn === conferenceSeqn) {
        setConferenceSeqn('');
      }
    } else if (item.confStatus === '1') {
      if (conferenceSeqn === '') {
        setIsConfOpen(true);
        setConferenceSeqn(item.statEvetOutbSeqn);
      }
    }
  }, [item]);

  const toggleDetail = (e: React.MouseEvent) => {
    e.stopPropagation();
    const seqn = item.statEvetOutbSeqn;
    if (openDetailList.includes(seqn)) {
      setOpenDetailList(openDetailList.filter((id) => id !== seqn));
    } else {
      setOpenDetailList([...openDetailList, seqn]);
    }
  };

  const isOpen = openDetailList.includes(item.statEvetOutbSeqn);

  return (
    <StyledRow>
      {isConfOpen ? <StyledConfDot /> : <StyledEmptyDot />}
      <StyledCell>{item.statEvetNm}</StyledCell>
      <StyledCell>{item.znNm}</StyledCell>
      <StyledCell>{scNm}</StyledCell>
      <StyledCell>
        {moment(item.outbDtm, 'YYYYMMDDHHmmssSSS').format('MM-DD HH:mm:ss')}
      </StyledCell>
      <StyledCell>
        <StyledToggleBtn $isOpen={isOpen} onClick={toggleDetail} />
      </StyledCell>
    </StyledRow>
  );
};

export default EventSuccessRow;

const StyledRow = styled.ul`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  height: 29px;
  gap: 6px;
`;

const baseCellStyle = `
  display: flex;
  height: 100%;
  font-size: 13px;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  align-items: center;
  padding: 0;
  line-height: 1;
`;

const StyledEmptyDot = styled.li`
  ${baseCellStyle}
  width: 16px;
`;

const StyledConfDot = styled.li`
  ${baseCellStyle}
  width: 16px;

  &::before {
    content: '';
    display: inline-block;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    border: solid 1px #cd342c;
    background-color: #ff5147;
  }
`;

const StyledCell = styled.li`
  ${baseCellStyle}
  width: 100%;

  &:nth-child(2) { width: 58px; }
  &:nth-child(3) { width: 61px; justify-content: center; }
  &:nth-child(4) { width: 136px; padding-left: 16px; justify-content: flex-start; }
  &:nth-child(5) { width: 112px; }
  &:nth-child(6) { width: 29px; padding: 0; }

  + div {
    margin-top: 3px;
  }
`;

const StyledToggleBtn = styled.button<{ $isOpen: boolean }>`
  width: 29px;
  height: 29px;
  background: url(${({ $isOpen }) =>
      $isOpen
        ? EVENT_IMAGE.CONTENT.LIST.ITEM.MORE.UP.BASE
        : EVENT_IMAGE.CONTENT.LIST.ITEM.MORE.DOWN.BASE})
    no-repeat center;

  &:hover {
    background: url(${({ $isOpen }) =>
        $isOpen
          ? EVENT_IMAGE.CONTENT.LIST.ITEM.MORE.UP.HOVER
          : EVENT_IMAGE.CONTENT.LIST.ITEM.MORE.DOWN.HOVER})
      no-repeat center / 100%;
  }
`;
