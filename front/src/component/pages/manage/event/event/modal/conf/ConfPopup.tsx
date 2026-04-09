import styled from 'styled-components';
import { useEffect, useRef, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useShallow } from 'zustand/react/shallow';
import {
  CommonModal,
  CommonModalDimmed,
  CommonModalHide,
  CommonModalShow,
} from '@/component/lib/css';
import { MODAL_IMAGE } from '@/component/lib/constImage';
import { useCommonStore } from '@/component/stores/commonStore';
import { useEventStore } from '@/component/stores/eventStore';
import { useHomeStore } from '@/component/stores/homeStore';
import { useFireStore } from '@/component/stores/fireStore';
import { getEventConf, getLoginToken } from '@/component/api/eventApi';
import { EventResultItem } from '@/component/types/event';
import { USER_TYPE } from '@/component/constants/user';

const FIRE_USER   = USER_TYPE.FIRE;    // '004'
const SENIOR_USER = USER_TYPE.SENIOR;  // '006'
import { API } from '@/component/lib/urls';
import { EVENT_TOAST_TYPE } from '@/component/constants/eventCode';

const ConfPopup = () => {
  const userInfo = useCommonStore((s) => s.userInfo);
  const scFacs   = useHomeStore((s) => s.scFacs);

  const { participantConf, openOpt, setParticipantConf, setOpenOpt, setToastKey } =
    useEventStore(
      useShallow((s) => ({
        participantConf:    s.participantConf,
        openOpt:            s.openOpt,
        setParticipantConf: s.actions.setParticipantConf,
        setOpenOpt:         s.actions.setOpenOpt,
        setToastKey:        s.actions.setToastKey,
      })),
    );

  const { fireConfEvent, setFireConfEvent, setFireEventToast } = useFireStore(
    useShallow((s) => ({
      fireConfEvent:     s.participantConf,
      setFireConfEvent:  s.actions.setParticipantConf,
      setFireEventToast: s.actions.setToastKey,
    })),
  );

  const [activeConfEvent, setActiveConfEvent] = useState<EventResultItem | null>(null);
  const [isRequest, setIsRequest] = useState(false);
  const formRef  = useRef<HTMLFormElement>(null);
  const tokenRef = useRef<HTMLInputElement>(null);

  // SSO 토큰 조회 (SENIOR_USER + 모달 열렸을 때만)
  const { data: ssoToken } = useQuery<{ data: string }>(
    ['login_token'],
    () => getLoginToken('fire00'),
    { enabled: userInfo?.userType === SENIOR_USER && openOpt === 'confParticipant' },
  );

  // userType에 따라 활성 이벤트 결정
  useEffect(() => {
    if (userInfo) {
      setActiveConfEvent(userInfo.userType !== FIRE_USER ? participantConf : fireConfEvent);
    }
  }, [participantConf, fireConfEvent, userInfo]);

  // 회의 참가 버튼
  const handleParticipantBtn = () => {
    if (!userInfo) return;
    if (userInfo.userType !== FIRE_USER) {
      setIsRequest(true);
    } else {
      if (activeConfEvent) {
        handleSsoLogin();
        setOpenOpt('');
        setFireConfEvent(null);
        setFireEventToast(EVENT_TOAST_TYPE.CONF.PARTICIPANT.SUCCESS);
      }
    }
  };

  const handleClose = () => {
    if (userInfo?.userType !== FIRE_USER) {
      setParticipantConf(null);
    } else {
      setFireConfEvent(null);
    }
    setOpenOpt('');
  };

  const getScNm = () => {
    if (!activeConfEvent) return '-';
    if (activeConfEvent.outbPlac.includes('_')) {
      const sc = scFacs.find((item) => item.mgtNo === activeConfEvent.outbPlac);
      return sc?.facNm ?? '-';
    }
    return activeConfEvent.outbPlac;
  };

  // 회의 정보 조회
  const { data: participantItem } = useQuery(
    ['meetConfInfo'],
    () => getEventConf(activeConfEvent!.statEvetOutbSeqn),
    { enabled: activeConfEvent !== null && isRequest },
  );

  // 소방 SSO 자동 로그인
  const handleSsoLogin = () => {
    if (formRef.current && ssoToken && tokenRef.current) {
      tokenRef.current.name = `{"data":"${ssoToken.data}", "trash":"`;
      formRef.current.action = API.AXIS.SSO_LOGIN_URL;
      formRef.current.submit();
    }
  };

  useEffect(() => {
    if (!participantItem) return;
    if (participantItem.data.length > 0) {
      if (userInfo?.userType === '001') {
        window.open(participantItem.data[0].pcScheme, '_blank');
        setOpenOpt('');
        setParticipantConf(null);
        setToastKey('CONF_PARTICIPANT_SUCCESS');
        setIsRequest(false);
      }
    } else {
      if (userInfo?.userType === '001') {
        setToastKey('CONF_PARTICIPANT_FAILURE');
      } else {
        setFireEventToast(EVENT_TOAST_TYPE.CONF.PARTICIPANT.FAILURE);
      }
    }
  }, [participantItem, userInfo]);

  const isOpen = openOpt === 'confParticipant';

  return (
    <StyledWrap $isOpen={isOpen}>
      <StyledDimmed />
      <StyledBox>
        <StyledHead>
          <h2>화상회의 참가</h2>
          <StyledClsBtn onClick={handleClose} />
        </StyledHead>
        <StyledBodyWrap>
          <StyledBody>
            {getScNm()}에<br /> 화상 회의 참가 요청을 합니다.
          </StyledBody>
        </StyledBodyWrap>
        <StyledBtnArea>
          <StyledCancelBtn onClick={handleClose}>취소</StyledCancelBtn>
          <StyledEnterBtn onClick={handleParticipantBtn}>회의참가</StyledEnterBtn>
        </StyledBtnArea>
      </StyledBox>
      <form ref={formRef} method="POST" encType="text/plain">
        <input type="hidden" value='"}'  ref={tokenRef} />
      </form>
    </StyledWrap>
  );
};

export default ConfPopup;

/* ─── Styled ─────────────────────────────────────────── */
const StyledWrap = styled.div<{ $isOpen: boolean }>`
  ${CommonModal};
  ${({ $isOpen }) => ($isOpen ? CommonModalShow : CommonModalHide)};
`;

const StyledDimmed = styled.div`
  ${CommonModalDimmed};
`;

const StyledBox = styled.div`
  display: inline-block;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  justify-content: center;
  flex-direction: column;
  border-radius: 20px;
  border: 1px solid #7a45ff;
  background: #0f1223;
  box-shadow: 0 12px 20px 4px rgba(0, 0, 0, 0.32);
`;

const StyledHead = styled.div`
  display: flex;
  align-items: center;
  padding: 27px 24px 15px 32px;

  h2 {
    font-size: 18px;
    font-weight: 500;
  }
`;

const StyledClsBtn = styled.button`
  width: 30px;
  height: 30px;
  margin-left: auto;
  background: url(${MODAL_IMAGE.CLS.BASE}) no-repeat center / 100%;
  &:hover { background-image: url(${MODAL_IMAGE.CLS.HOVER}); }
`;

const StyledBodyWrap = styled.div`
  position: relative;
  padding: 24px 32px;
  font-size: 17px;
  color: #f2f4fc;

  &::before {
    content: '';
    display: block;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 1px;
    background: linear-gradient(90deg, #543faf, #2a2e54);
  }
`;

const StyledBody = styled.div`
  display: flex;
  flex-direction: column;
  width: 344px;
  height: 56px;
  line-height: 1.33;

  &::after {
    content: '';
    display: block;
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 1px;
    background: linear-gradient(90deg, #543faf, #2a2e54);
  }
`;

const StyledBtnArea = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 0 8px;
  padding: 16px 32px 24px;
`;

const StyledCancelBtn = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 86px;
  height: 34px;
  font-size: 13px;
  border-radius: 6px;
  color: #a8afbd;
  border: 1px solid #2a2e54;
  background: #0f1223;
  &:hover {
    color: #fff;
    border-color: #3e4165;
    background: #1a203a;
  }
`;

const StyledEnterBtn = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 86px;
  height: 34px;
  font-size: 13px;
  color: #fff;
  border-radius: 6px;
  border: 1px solid #7a45ff;
  background: #7a45ff;
  &:hover {
    border-color: #8962ff;
    background: #8962ff;
  }
`;
