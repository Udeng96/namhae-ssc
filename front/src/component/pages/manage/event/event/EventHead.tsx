import styled from 'styled-components';
import { useEffect, useState } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { useEventStore } from '@/component/stores/eventStore';
import { useCommonStore } from '@/component/stores/commonStore';
import { useHomeStore } from '@/component/stores/homeStore';

import useEventWs from '@/component/pages/manage/_hooks/useEventWs';

// TODO: 토스트 키 상수 별도 파일로 분리 예정
const TOAST = {
  SOCKET_ON: 'socket_on',
  SOCKET_OFF: 'socket_off',
} as const;

const EventHead = () => {
  const [isSocketOn, setIsSocketOn] = useState(true);

  const { wsEvent, eventList, setEventList, setSelectEvent, setToastKey, newEventList, setNewEventList } =
    useEventStore(
      useShallow((state) => ({
        wsEvent: state.wsEvent,
        eventList: state.eventList,
        setEventList: state.actions.setEventList,
        setSelectEvent: state.actions.setSelectEvent,
        setToastKey: state.actions.setToastKey,
        newEventList: state.newEventList,
        setNewEventList: state.actions.setNewEventList,
      })),
    );

  const setRoleKey = useCommonStore((state) => state.actions.setRoleKey);
  const setWsEvent = useEventStore((state) => state.actions.setWsEvent);

  useEventWs(isSocketOn);

  // 소켓 on/off 토스트
  useEffect(() => {
    setToastKey(isSocketOn ? TOAST.SOCKET_ON : TOAST.SOCKET_OFF);
  }, [isSocketOn]);

  // 소켓 이벤트 처리 - 이미 목록에 없는 신규 이벤트만 추가 (최대 50개)
  // ※ 통계 갱신 트리거는 StatRoot에서 wsEvent 구독으로 분리 처리
  useEffect(() => {
    if (!wsEvent || wsEvent.procSt === '4') return;

    const isDuplicate = eventList.some(
      (item) => item.statEvetOutbSeqn === wsEvent.statEvetOutbSeqn,
    );
    if (isDuplicate) { setWsEvent(null); return; }

    // Home 패널 재구성 트리거
    setRoleKey('socket');

    const nextList = [wsEvent as typeof eventList[number], ...eventList].slice(0, 50);
    setEventList(nextList);
    setNewEventList([wsEvent.statEvetOutbSeqn, ...newEventList]);
    setSelectEvent(wsEvent as typeof eventList[number]);

    // Home 서브 패널: 해당 경로당 todaySitEvet 로컬 +1 → EventSubPanel 전환
    if (wsEvent.outbPlac) {
      const { scFacs } = useHomeStore.getState();
      useHomeStore.getState().actions.setScFacs(
        scFacs.map((f) =>
          f.mgtNo === wsEvent.outbPlac
            ? { ...f, todaySitEvet: f.todaySitEvet + 1 }
            : f,
        ),
      );
    }

    setWsEvent(null);
  }, [wsEvent]);

  return (
    <StyledEventHead>
      <StyledTitle>
        경로당<span>Dashboard</span>
      </StyledTitle>
      <StyledToggle $isActive={isSocketOn} onClick={() => setIsSocketOn((v) => !v)}>
        <p>이벤트 수신</p>
        <StyledToggleBtn $isActive={isSocketOn}>
          <span />
        </StyledToggleBtn>
      </StyledToggle>
    </StyledEventHead>
  );
};

export default EventHead;

const StyledEventHead = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 32px 24px;
`;

const StyledTitle = styled.h2`
  font-size: 20px;
  font-weight: 600;

  span {
    padding-left: 6px;
    font-size: 22px;
    font-weight: 200;
    background: linear-gradient(270deg, #7a45ff 0%, #9c7bff 100%);
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
`;

const StyledToggle = styled.div<{ $isActive: boolean }>`
  display: flex;
  align-items: center;
  gap: 0 8px;
  font-size: 13px;
  font-weight: 300;
  transition: color ease-in-out 250ms;
  color: ${({ $isActive }) => ($isActive ? '#F2F4FC' : '#A8AFBD')};
  border-radius: ${({ $isActive }) => ($isActive ? '10px' : '0')};

  p {
    pointer-events: none;
  }
`;

const StyledToggleBtn = styled.button<{ $isActive: boolean }>`
  position: relative;
  width: 38px;
  height: 20px;
  border-radius: 10px;
  background: ${({ $isActive }) => ($isActive ? '#7A45FF' : '#2A2E54')};
  box-shadow: ${({ $isActive }) =>
    $isActive
      ? '0.5px 0.5px 0.5px 0px rgba(0, 0, 0, 0.15) inset'
      : '0.5px 0.5px 0.5px 0px rgba(0, 0, 0, 0.3) inset'};
  transition: background-color ease-in-out 250ms;
  cursor: pointer;

  span {
    display: inline-block;
    position: absolute;
    top: 50%;
    left: ${({ $isActive }) => ($isActive ? 'calc(100% - 17px)' : '3px')};
    transform: translateY(-50%);
    width: 14px;
    height: 14px;
    border-radius: 50%;
    background-color: ${({ $isActive }) => ($isActive ? '#F2F4FC' : '#9FA6BD')};
    box-shadow: ${({ $isActive }) =>
      $isActive
        ? '0.5px 0.5px 0px 0px #FFF inset'
        : '0.5px 0.5px 0px 0px rgba(255, 255, 255, 0.25) inset'};
    filter: drop-shadow(1px 1px 1px rgba(0, 0, 0, 0.25));
    transition: all ease-in-out 200ms;
  }
`;
