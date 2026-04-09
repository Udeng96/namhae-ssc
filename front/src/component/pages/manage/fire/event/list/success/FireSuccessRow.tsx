import styled from 'styled-components';
import { useEffect, useState } from 'react';
import { useShallow } from 'zustand/react/shallow';
import moment from 'moment';
import { EVENT_IMAGE } from '@/component/lib/eventImage';
import { EventResultItem } from '@/component/types/event';
import { useHomeStore } from '@/component/stores/homeStore';
import { useFireStore } from '@/component/stores/fireStore';
import { useConfStore } from '@/component/stores/confStore';

interface Props {
  item: EventResultItem;
}

const FireSuccessRow = ({ item }: Props) => {
  const scFacs = useHomeStore((state) => state.scFacs);

  const { openDetailList, setOpenDetailList } = useFireStore(
    useShallow((state) => ({
      openDetailList:    state.openDetailList,
      setOpenDetailList: state.actions.setOpenDetailList,
    })),
  );

  const { conferenceSeqn, setConferenceSeqn } = useConfStore(
    useShallow((state) => ({
      conferenceSeqn:    state.conferenceSeqn,
      setConferenceSeqn: state.actions.setConferenceSeqn,
    })),
  );

  const [scNm, setScNm]           = useState<string>('');
  const [isConfOpen, setIsConfOpen] = useState<boolean>(false);

  useEffect(() => {
    if (scFacs.length === 0) return;
    if (item.outbPlac.includes('_')) {
      const fac = scFacs.find((f) => f.mgtNo === item.outbPlac);
      setScNm(fac?.facNm ?? '');
    } else {
      setScNm(item.outbPlac);
    }
  }, [scFacs, item]);

  useEffect(() => {
    if (item.confStatus === '5') {
      setIsConfOpen(false);
      if (conferenceSeqn !== '' && conferenceSeqn === item.statEvetOutbSeqn) {
        setConferenceSeqn('');
      }
    } else if (item.confStatus === '1') {
      if (conferenceSeqn === '') {
        setIsConfOpen(true);
        setConferenceSeqn(item.statEvetOutbSeqn);
      }
    }
  }, [item]);

  const handleMoreBtn = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (openDetailList.includes(item.statEvetOutbSeqn)) {
      setOpenDetailList(openDetailList.filter((id) => id !== item.statEvetOutbSeqn));
    } else {
      setOpenDetailList([...openDetailList, item.statEvetOutbSeqn]);
    }
  };

  return (
    <StyledRow>
      {isConfOpen ? <StyledConf /> : <StyledNone />}
      <StyledItem>{item.statEvetNm}</StyledItem>
      <StyledItem>{item.znNm}</StyledItem>
      <StyledItem>{scNm}</StyledItem>
      <StyledItem>
        {moment(item.outbDtm, 'YYYYMMDDHHmmssSSS').format('MM-DD HH:mm:ss')}
      </StyledItem>
      <StyledItem>
        <StyledMoreBtn
          $isOpen={openDetailList.includes(item.statEvetOutbSeqn)}
          onClick={(e) => handleMoreBtn(e)}
        />
      </StyledItem>
    </StyledRow>
  );
};

export default FireSuccessRow;

const StyledRow = styled.ul`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  height: 29px;
  gap: 6px;
`;

const StyledNone = styled.li`
  width: 16px;
  height: 100%;
`;

const StyledConf = styled.li`
  width: 16px;
  height: 100%;

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

const StyledItem = styled.li`
  display: flex;
  height: 100%;
  width: 100%;
  font-size: 13px;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  align-items: center;
  padding: 0;
  line-height: 1;

  &:nth-child(2) {
    width: 58px;
  }
  &:nth-child(3) {
    width: 61px;
    justify-content: center;
  }
  &:nth-child(4) {
    width: 136px;
    padding-left: 16px;
    justify-content: flex-start;
  }
  &:nth-child(5) {
    width: 112px;
  }
  &:nth-child(6) {
    width: 29px;
    padding: 0;
  }
`;

const StyledMoreBtn = styled.button<{ $isOpen: boolean }>`
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
