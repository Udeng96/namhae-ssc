import styled from 'styled-components';
import { useEffect, useState } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useFireStore } from '@/component/stores/fireStore';
import { useConfStore } from '@/component/stores/confStore';
import { useCommonStore } from '@/component/stores/commonStore';
import { fetchFireConfUrl } from '@/component/api/fireApi';
import { setFireAlarmOn, setFireAlarmOff } from '@/component/api/eventApi';
import { USER_TYPE } from '@/component/constants/user';
import { EventResultItem } from '@/component/types/event';
import useFireEventWs from '../../_hooks/useFireEventWs';

const FireEventHead = () => {
  const userInfo = useCommonStore((state) => state.userInfo);

  const {
    wsEvent,
    eventList,
    newEventList,
    setWsEvent,
    setEventList,
    setSelectEvent,
    setNewEventList,
    setToastKey,
  } = useFireStore(
    useShallow((state) => ({
      wsEvent:        state.wsEvent,
      eventList:      state.eventList,
      newEventList:   state.newEventList,
      setWsEvent:     state.actions.setWsEvent,
      setEventList:   state.actions.setEventList,
      setSelectEvent: state.actions.setSelectEvent,
      setNewEventList: state.actions.setNewEventList,
      setToastKey:    state.actions.setToastKey,
    })),
  );

  const { fireConferenceSeqn, setFireConferenceSeqn } = useConfStore(
    useShallow((state) => ({
      fireConferenceSeqn:    state.fireConferenceSeqn,
      setFireConferenceSeqn: state.actions.setFireConferenceSeqn,
    })),
  );

  const [isSocketOn, setIsSocketOn]           = useState<boolean>(true);
  const [reqConfOpen, setReqConfOpen]         = useState<boolean>(false);

  useFireEventWs(isSocketOn);

  // 소켓 ON/OFF 토스트
  useEffect(() => {
    setToastKey(isSocketOn ? 'socket_on' : 'socket_off');
  }, [isSocketOn]);

  // WS 이벤트 수신 처리
  useEffect(() => {
    if (!wsEvent) return;

    console.log('wsEvent (fire):', wsEvent);

    // 목록 맨 앞에 추가
    const newList = [wsEvent as EventResultItem, ...eventList];
    setEventList(newList);
    setNewEventList([wsEvent.statEvetOutbSeqn, ...newEventList]);
    setSelectEvent(wsEvent as EventResultItem);

    // 경광봉
    handleFireAlarm();

    // 회의방 자동 참가
    if (wsEvent.confStatus === '1') {
      console.log('회의방이 개설된 이벤트를 공유했습니다. 자동 참석 요청');
      setFireConferenceSeqn(wsEvent.statEvetOutbSeqn);
      setReqConfOpen(true);
    } else {
      console.log('회의방 없는 이벤트 공유');
      setWsEvent(null);
    }
  }, [wsEvent]);

  // 회의 URL 조회 (자동 참가)
  const { data: confUrl } = useQuery(
    ['fireConfInfo', fireConferenceSeqn],
    () => fetchFireConfUrl({ seqn: fireConferenceSeqn, userId: 'fire00' }),
    { enabled: reqConfOpen && !!fireConferenceSeqn },
  );

  useEffect(() => {
    if (!wsEvent || !reqConfOpen) return;
    if (!confUrl) return;

    const url = confUrl.data;
    if (url && url !== '') {
      if (userInfo?.userType === USER_TYPE.FIRE) {
        window.location.href = url;
      }
    } else {
      console.log('회의 참여 실패 — URL 없음');
    }
    setWsEvent(null);
    setReqConfOpen(false);
  }, [confUrl]);

  const handleFireAlarm = () => {
    fireAlarmOnMutation.mutate();
    setTimeout(() => {
      fireAlarmOffMutation.mutate();
    }, 10000);
  };

  const fireAlarmOnMutation = useMutation(setFireAlarmOn, {
    onSuccess: (data) => {
      setToastKey(data ? 'fire_alarm_on_success' : 'fire_alarm_on_fail');
    },
    onError: () => {
      setToastKey('fire_alarm_on_fail');
    },
  });

  const fireAlarmOffMutation = useMutation(setFireAlarmOff, {
    onSuccess: (data) => {
      setToastKey(data ? 'fire_alarm_off_success' : 'fire_alarm_off_fail');
    },
    onError: () => {
      setToastKey('fire_alarm_off_fail');
    },
  });

  return (
    <StyledHead>
      <StyledTitle>
        경로당<span>Dashboard</span>
      </StyledTitle>
      <StyledToggle $isActive={isSocketOn} onClick={() => setIsSocketOn(!isSocketOn)}>
        <p>이벤트 수신</p>
        <StyledToggleBtn $isActive={isSocketOn}>
          <span />
        </StyledToggleBtn>
      </StyledToggle>
    </StyledHead>
  );
};

export default FireEventHead;

const StyledHead = styled.div`
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
  cursor: pointer;

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
    filter: drop-shadow(1px 1px 1px rgba(0, 0, 0, 0.25));
    transition: all ease-in-out 200ms;
  }
`;
