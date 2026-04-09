import styled from 'styled-components';
import { useEffect, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useShallow } from 'zustand/react/shallow';
import moment from 'moment';
import {
  CommonModal,
  CommonModalDimmed,
  CommonModalHide,
  CommonModalShow,
} from '@/component/lib/css';
import { MODAL_IMAGE } from '@/component/lib/constImage';
import { useEventStore } from '@/component/stores/eventStore';
import { sendMsg } from '@/component/api/eventApi';
import { SMS_PRESET } from '@/component/constants/eventCode';
import { SmsBodyType } from '@/component/types/event';
import ConfirmMsg   from './ConfirmMsg';
import ConfirmBroad from './ConfirmBroad';

import SmsIcon from '@/assets/images/dark/page/Management_Dashboard/icon/icon_title_pop_eventDisseminateMangement.png';

const ConfirmModal = () => {
  const {
    openOpt,
    smsEvent,
    sms,
    broadcast,
    setSms,
    setBroadcast,
    setOpenOpt,
    setToastKey,
  } = useEventStore(
    useShallow((state) => ({
      openOpt:      state.openOpt,
      smsEvent:     state.smsEvent,
      sms:          state.sms,
      broadcast:    state.broadcast,
      setSms:       state.actions.setSms,
      setBroadcast: state.actions.setBroadcast,
      setOpenOpt:   state.actions.setOpenOpt,
      setToastKey:  state.actions.setToastKey,
    })),
  );

  const isSmsActive   = sms.title !== '' && sms.content !== '' && sms.selectedTargets.length > 0;
  const isBroadActive = broadcast.title !== '' && broadcast.content !== '' && broadcast.selectedTargets.length > 0;

  const resetAll = () => {
    setSms({ title: '', content: '', selectedTargets: [], preset: SMS_PRESET[0] });
    setBroadcast({ title: '', content: '', selectedTargets: [], preset: SMS_PRESET[0] });
  };

  const handleBack   = () => setOpenOpt('sms');
  const handleCancel = () => { resetAll(); setOpenOpt(''); };

  const { mutate: send } = useMutation({
    mutationFn: sendMsg,
    onSuccess: (data) => {
      setToastKey(data.data.resultMessage === 'FAIL' ? 'SEND_MSG_FAILED' : 'SEND_MSG_SUCCESS');
      handleCancel();
    },
  });

  const handleApply = () => {
    const body: SmsBodyType[] = [];
    const now = moment().format('YYYYMMDDHHmmssSSS');
    if (isSmsActive) {
      body.push({
        eventSeq: smsEvent?.statEvetOutbSeqn ?? '',
        title: sms.title,
        content: sms.content,
        sendDtm: now,
        sndTarget: sms.selectedTargets,
        type: 'SMS',
      });
    }
    if (isBroadActive) {
      body.push({
        eventSeq: smsEvent?.statEvetOutbSeqn ?? '',
        title: broadcast.title,
        content: broadcast.content,
        sendDtm: now,
        sndTarget: broadcast.selectedTargets,
        type: 'BRC',
      });
    }
    send(body);
    setOpenOpt('');
  };

  const isOpen = openOpt === 'confirm';

  return (
    <StyledWrap $isOpen={isOpen}>
      <StyledDimmed />
      <StyledBox>
        <StyledHead>
          <h2>전파내용 상세보기 및 전파 내용 / 전파 대상 수정</h2>
          <StyledClsBtn onClick={handleCancel} />
        </StyledHead>
        <StyledBodyWrap>
          <StyledBody>
            {isSmsActive   && <ConfirmMsg />}
            {isBroadActive && <ConfirmBroad />}
          </StyledBody>
          <StyledFoot>
            <StyledBackBtn onClick={handleBack}>내용입력으로 돌아가기</StyledBackBtn>
            <StyledApplyBtn onClick={handleApply}>전파하기</StyledApplyBtn>
          </StyledFoot>
        </StyledBodyWrap>
      </StyledBox>
    </StyledWrap>
  );
};

export default ConfirmModal;

/* ─── Styled ─────────────────────────────────────────── */
const StyledWrap = styled.div<{ $isOpen: boolean }>`
  ${CommonModal};
  ${({ $isOpen }) => ($isOpen ? CommonModalShow : CommonModalHide)};
`;

const StyledDimmed = styled.div`
  ${CommonModalDimmed};
`;

const StyledBox = styled.div`
  position: absolute;
  display: inline-block;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border-radius: 16px;
  background-color: rgba(0,0,0,.8);
`;

const StyledHead = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 63px;
  padding: 0 19px 0 24px;
  border-radius: 16px 16px 0 0;
  box-shadow: 0 0.03vw 0.15vw 0 rgba(0,0,0,.2), inset 0 0.03vw 0 0 rgba(232,232,232,.18);
  background-image: linear-gradient(334deg, #2a2c7a 37%, #292564 100%);

  h2 {
    display: flex;
    align-items: center;
    color: #f5f8ff;
    font-size: 19px;
    font-weight: 500;
    &::before {
      content: '';
      display: inline-block;
      width: 34px;
      height: 34px;
      margin-right: 7px;
      background: url(${SmsIcon}) no-repeat center / 100%;
    }
  }
`;

const StyledClsBtn = styled.button`
  width: 28px;
  height: 28px;
  margin-left: auto;
  background: url(${MODAL_IMAGE.CLS.BASE}) no-repeat center / 100%;
  &:hover { background-image: url(${MODAL_IMAGE.CLS.HOVER}); }
`;

const StyledBodyWrap = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  border-bottom-left-radius: 12px;
  border-bottom-right-radius: 12px;
  background-image: linear-gradient(334deg, #1a1b3a, #202249 90%);
`;

const StyledBody = styled.div`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 14px;
  width: 100%;
`;

const StyledFoot = styled.div`
  display: flex;
  padding: 10px 0;
  justify-content: center;
  align-items: center;
  gap: 12px;
`;

const StyledBackBtn = styled.a`
  color: #A9A7C0;
  font-size: 15px;
  cursor: pointer;
  &:hover { text-decoration: underline; }
`;

const StyledApplyBtn = styled.button`
  width: 128px;
  height: 36px;
  margin: 0 auto;
  font-family: 'SCDreamM', sans-serif;
  font-size: 15px;
  color: #fff;
  border-radius: 17.52px;
  background-color: #5d5ce2;
  &:hover { background-color: #6d77fd; }
`;
