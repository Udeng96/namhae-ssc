import styled from 'styled-components';
import { useMutation } from '@tanstack/react-query';
import { useShallow } from 'zustand/react/shallow';
import moment from 'moment';
import { useEventStore } from '@/component/stores/eventStore';
import { EventResultItem } from '@/component/types/event';
import { createEventConf, closeEventConf } from '@/component/api/eventApi';
import { saveSchedule } from '@/component/api/scheApi';
import { ScheItem } from '@/component/types/sche';
import { useFireStore } from '@/component/stores/fireStore';
import { useConfStore } from '@/component/stores/confStore';

// TODO: 토스트 키 상수 분리 예정
const TOAST = {
  CONF_CREATE_SUCCESS: 'conf_create_success',
  CONF_CREATE_FAILURE: 'conf_create_failure',
  CONF_CREATE_ALREADY: 'conf_create_already',
  CONF_CLOSE_SUCCESS: 'conf_close_success',
  CONF_CLOSE_FAILURE: 'conf_close_failure',
} as const;

interface Props {
  eventItem: EventResultItem;
}

const EventMoreBtnConf = ({ eventItem }: Props) => {
  const { eventList, setEventList, setToastKey, setParticipantConf, setOpenOpt } = useEventStore(
    useShallow((state) => ({
      eventList: state.eventList,
      setEventList: state.actions.setEventList,
      setToastKey: state.actions.setToastKey,
      setParticipantConf: state.actions.setParticipantConf,
      setOpenOpt: state.actions.setOpenOpt,
    })),
  );

  const { setOpenPcSchema, setOpenConfEvent } = useFireStore(
    useShallow((state) => ({
      setOpenPcSchema: state.actions.setOpenPcSchema,
      setOpenConfEvent: state.actions.setOpenConfEvent,
    })),
  );

  const { conferenceSeqn, setConferenceSeqn } = useConfStore(
    useShallow((s) => ({
      conferenceSeqn:    s.conferenceSeqn,
      setConferenceSeqn: s.actions.setConferenceSeqn,
    })),
  );

  // 이벤트 목록에서 confStatus 업데이트
  const updateEventConf = (seqn: string, confStatus: string, confUserId: string) => {
    setEventList(
      eventList.map((item) =>
        item.statEvetOutbSeqn === seqn ? { ...item, confStatus, confUserId } : item,
      ),
    );
  };

  // 화상회의 개설
  const createConfMutation = useMutation(
    () => createEventConf({ scMgtNo: eventItem.outbPlac, seqn: eventItem.statEvetOutbSeqn }),
    {
      onSuccess: ({ data }) => {
        if (data.confStatus.toString() === '1') {
          setToastKey(TOAST.CONF_CREATE_SUCCESS);
          updateEventConf(data.statEvetOutbSeqn, data.confStatus, data.userId);
        } else {
          setToastKey(TOAST.CONF_CREATE_FAILURE);
        }
      },
    },
  );

  // 화상회의 종료 스케쥴 저장 → 실제 종료
  const closeConfMutation = useMutation(
    () => closeEventConf(eventItem.statEvetOutbSeqn),
    {
      onSuccess: ({ data }) => {
        if (data.confStatus === 5) {
          setToastKey(TOAST.CONF_CLOSE_SUCCESS);
          setConferenceSeqn('');
          updateEventConf(data.statEvetOutbSeqn, data.confStatus.toString(), data.userId);
        } else {
          setToastKey(TOAST.CONF_CLOSE_FAILURE);
        }
      },
      onError: () => setToastKey(TOAST.CONF_CLOSE_FAILURE),
    },
  );

  const sendClsScheduleMutation = useMutation(
    (bodies: ScheItem[]) => saveSchedule(bodies),
    {
      onSuccess: (data) => {
        if (data.data === 'SUCCESS') {
          setOpenPcSchema('');
          setOpenConfEvent(null);
          closeConfMutation.mutate();
        } else {
          setToastKey(TOAST.CONF_CLOSE_FAILURE);
        }
      },
    },
  );

  const handleOpen = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (conferenceSeqn === '') {
      createConfMutation.mutate();
      setConferenceSeqn(eventItem.statEvetOutbSeqn);
    } else if (conferenceSeqn === eventItem.statEvetOutbSeqn) {
      setParticipantConf(eventItem);
      setOpenOpt('confParticipant');
    } else {
      setToastKey(TOAST.CONF_CREATE_ALREADY);
    }
  };

  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation();
    const closeBody: ScheItem = {
      contentId: '',
      contentTitle: '비상벨 회의 종료',
      startDtm: moment().format('YYYYMMDD'),
      endDtm: moment().format('YYYYMMDD'),
      repeatDate: '',
      contentArea: eventItem.outbPlac,
      contentFile: '',
      contentType: 'NOTICE_E',
      contentCntn: '비상벨 화상회의가 종료되었습니다.',
      backImage: '',
      expireTime: '7000',
      colorType: 'notice-emer',
      startTime: '',
      endTime: '',
      contentGrpId: '',
      outbDtm: moment().format('YYYYMMDDHHmmssSSS'),
      expireDtm: moment().add(7000, 'seconds').format('YYYYMMDDHHmmss'),
      editorType: '001',
    };
    sendClsScheduleMutation.mutate([closeBody]);
  };

  const isConfOpen =
    eventItem.confStatus === '1' && eventItem.confUserId !== '';
  const isOtherConf =
    conferenceSeqn !== '' && conferenceSeqn !== eventItem.statEvetOutbSeqn;
  // 개설: 다른 회의 진행 중이거나 이미 종료된 경우 비활성
  const isOpenDisabled  = eventItem.confStatus === '5' || isOtherConf;
  // 종료: 회의가 없거나(='') 이미 종료된 경우 비활성
  const isCloseDisabled = eventItem.confStatus === '5' || eventItem.confStatus === '';

  const openLabel =
    conferenceSeqn !== '' && conferenceSeqn === eventItem.statEvetOutbSeqn
      ? '참가'
      : '개설';

  return (
    <StyledArea>
      <StyledOpenBtn
        $isOpen={isConfOpen}
        onClick={handleOpen}
        disabled={isOpenDisabled}
      >
        <p>회의</p>
        <p>{openLabel}</p>
      </StyledOpenBtn>
      <StyledCloseBtn onClick={handleClose} disabled={isCloseDisabled}>
        <p>회의</p>
        <p>종료</p>
      </StyledCloseBtn>
    </StyledArea>
  );
};

export default EventMoreBtnConf;

const StyledArea = styled.div`
  width: 117px;
  height: auto;
  display: flex;
  gap: 5px;
`;

const baseConfBtn = `
  width: 56px;
  height: 44px;
  padding: 10px;
  font-size: 13px;
  font-weight: 500;
  color: #fff;
  border-radius: 10px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  text-align: center;

  &:disabled {
    opacity: 0.3;
    pointer-events: none;
    cursor: default;
  }

  p { width: 56px; }
`;

const StyledOpenBtn = styled.button<{ $isOpen: boolean }>`
  ${baseConfBtn}
  background-color: ${({ $isOpen }) => ($isOpen ? '#4070FF' : '#7A45FF')};

  &:hover {
    background-color: ${({ $isOpen }) => ($isOpen ? '#5E8FFF' : '#8962FF')};
  }
`;

const StyledCloseBtn = styled.button`
  ${baseConfBtn}
  background-color: #cc3d82;

  &:hover {
    background: #e55ca1;
  }
`;
