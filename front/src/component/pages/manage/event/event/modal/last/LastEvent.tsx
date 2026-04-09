import { useEffect } from 'react';
import styled from 'styled-components';
import {
  CommonModal,
  CommonModalDimmed,
  CommonModalHide,
  CommonModalShow,
} from '@/component/lib/css';
import { useShallow } from 'zustand/react/shallow';
import moment from 'moment';
import { useEventStore } from '@/component/stores/eventStore';
import LastEventHead from './LastEventHead';
import LastEventBody from './LastEventBody';

const LastEvent = () => {
  const { openOpt, setOpenOpt, setLastParam, setLastSelectEvent, setLastEventList, setLastTotalCnt, lastEventList } =
    useEventStore(
      useShallow((state) => ({
        openOpt:            state.openOpt,
        setOpenOpt:         state.actions.setOpenOpt,
        setLastParam:       state.actions.setLastParam,
        setLastSelectEvent: state.actions.setLastSelectEvent,
        setLastEventList:   state.actions.setLastEventList,
        setLastTotalCnt:    state.actions.setLastTotalCnt,
        lastEventList:      state.lastEventList,
      })),
    );

  const isOpen = openOpt === 'last';

  // 모달 닫힐 때 상태 초기화
  useEffect(() => {
    if (!isOpen) {
      const timer = setTimeout(() => {
        setLastParam({
          startDtm:   moment().format('YYYYMMDD'),
          endDtm:     moment().format('YYYYMMDD'),
          pageNumber: 1,
        });
        setLastSelectEvent(null);
        if (lastEventList.length > 0) {
          setLastEventList([]);
          setLastTotalCnt(0);
        }
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  return (
    <StyledModal $isOpen={isOpen}>
      <StyledDimmed onClick={() => setOpenOpt('')} />
      <StyledBox>
        <StyledContent>
          <LastEventHead />
          <LastEventBody />
        </StyledContent>
      </StyledBox>
    </StyledModal>
  );
};

export default LastEvent;

const StyledModal = styled.div<{ $isOpen: boolean }>`
  ${CommonModal}
  ${({ $isOpen }) => ($isOpen ? CommonModalShow : CommonModalHide)}
`;

const StyledDimmed = styled.div`
  ${CommonModalDimmed}
`;

const StyledBox = styled.div`
  display: inline-block;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border-radius: 12px;
`;

const StyledContent = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  width: 950px;
  border-radius: 20px;
  border: 1px solid #1a203a;
  background: #12172e;
  box-shadow: 0 12px 20px 4px rgba(0, 0, 0, 0.32);
`;
