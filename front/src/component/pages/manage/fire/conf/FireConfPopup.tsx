import styled from 'styled-components';
import { useEffect, useState } from 'react';
import { useShallow } from 'zustand/react/shallow';
import {
  CommonModal,
  CommonModalDimmed,
  CommonModalHide,
  CommonModalShow,
} from '@/component/lib/css';
import { MODAL_IMAGE } from '@/component/lib/constImage';
import { EVENT_MODAL_TYPE, EVENT_TOAST_TYPE } from '@/component/constants/eventCode';
import { useCommonStore } from '@/component/stores/commonStore';
import { useFireStore } from '@/component/stores/fireStore';
import { useHomeStore } from '@/component/stores/homeStore';
import { fetchFireConfUrl } from '@/component/api/fireApi';

/**
 * 소방 화상회의 참가 팝업
 * - 구 confPopup.tsx의 fire 전용 refac 버전
 * - 구 SSO form 방식 대신 fetchFireConfUrl → window.location.href 방식 사용
 */
const FireConfPopup = () => {
  const { modal, setModal } = useCommonStore(
    useShallow((state) => ({
      modal:    state.modal,
      setModal: state.actions.setModal,
    })),
  );

  const userInfo = useCommonStore((state) => state.userInfo);
  const scFacs   = useHomeStore((state) => state.scFacs);

  const { participantConf, setParticipantConf, setToastKey } = useFireStore(
    useShallow((state) => ({
      participantConf:    state.participantConf,
      setParticipantConf: state.actions.setParticipantConf,
      setToastKey:        state.actions.setToastKey,
    })),
  );

  const [isLoading, setIsLoading] = useState(false);

  // 팝업 닫을 때 초기화
  const handleClose = () => {
    setParticipantConf(null);
    setModal(EVENT_MODAL_TYPE.NONE);
  };

  // 회의 참가
  const handleParticipant = async () => {
    if (!participantConf || !userInfo) return;
    setIsLoading(true);
    try {
      const res = await fetchFireConfUrl({
        seqn:   participantConf.statEvetOutbSeqn,
        userId: userInfo.userId,
      });
      const url = res.data;
      if (url) {
        window.location.href = url;
      }
      setToastKey(EVENT_TOAST_TYPE.CONF.PARTICIPANT.SUCCESS);
    } catch {
      setToastKey(EVENT_TOAST_TYPE.CONF.PARTICIPANT.FAILURE);
    } finally {
      setIsLoading(false);
      setParticipantConf(null);
      setModal(EVENT_MODAL_TYPE.NONE);
    }
  };

  // 장소명 추출 (mgtNo → facNm 변환)
  const getScNm = () => {
    if (!participantConf) return '-';
    const place = participantConf.outbPlac;
    if (place.includes('_')) {
      return scFacs.find((f) => f.mgtNo === place)?.facNm ?? place;
    }
    return place;
  };

  const isOpen = !!participantConf && modal === EVENT_MODAL_TYPE.CONF.PARTICIPANT;

  return (
    <StyledConfPopup $isOpen={isOpen}>
      <StyledConfPopupDimmed />
      <StyledConfPopupWrap>
        <StyledConfPopupBox>
          <StyledConfPopupHead>
            <StyledConfPopupHeadTitle>화상회의 참가</StyledConfPopupHeadTitle>
            <StyledPopupCloseBtn onClick={handleClose} />
          </StyledConfPopupHead>
          <StyledConfPopupBodyWrap>
            <StyledConfPopupBody>
              {getScNm()}에<br /> 화상 회의 참가 요청을 합니다.
            </StyledConfPopupBody>
          </StyledConfPopupBodyWrap>
          <StyledConfPopupBodyBtnArea>
            <StyledCancelBtn onClick={handleClose}>취소</StyledCancelBtn>
            <StyledEnterBtn onClick={handleParticipant} disabled={isLoading}>
              {isLoading ? '접속 중...' : '회의참가'}
            </StyledEnterBtn>
          </StyledConfPopupBodyBtnArea>
        </StyledConfPopupBox>
      </StyledConfPopupWrap>
    </StyledConfPopup>
  );
};

export default FireConfPopup;

// ── Styled ────────────────────────────────────────────────────────

const StyledConfPopup = styled.div<{ $isOpen: boolean }>`
  ${CommonModal};
  ${({ $isOpen }) => ($isOpen ? CommonModalShow : CommonModalHide)};
`;

const StyledConfPopupDimmed = styled.div`
  ${CommonModalDimmed};
`;

const StyledConfPopupWrap = styled.div`
  display: inline-block;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border-radius: 12px;
`;

const StyledConfPopupBox = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  border-radius: 20px;
  border: 1px solid #7a45ff;
  background: #0f1223;
  box-shadow: 0 12px 20px 4px rgba(0, 0, 0, 0.32);
`;

const StyledConfPopupHead = styled.div`
  display: flex;
  align-items: center;
  padding: 27px 24px 15px 32px;
`;

const StyledConfPopupHeadTitle = styled.h2`
  font-size: 18px;
  font-weight: 500;
`;

const StyledPopupCloseBtn = styled.button`
  width: 30px;
  height: 30px;
  margin-left: auto;
  background: url(${MODAL_IMAGE.CLS.BASE}) no-repeat center / 100%;

  &:hover {
    background-image: url(${MODAL_IMAGE.CLS.HOVER});
  }
`;

const StyledConfPopupBodyWrap = styled.div`
  position: relative;
  padding: 24px 32px;
  font-size: 17px;
  color: #f2f4fc;

  &::before {
    top: 0;
    background: linear-gradient(90deg, #543faf, #2a2e54);
    content: '';
    display: block;
    position: absolute;
    left: 0;
    width: 100%;
    height: 1px;
  }
`;

const StyledConfPopupBody = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  width: 344px;
  height: 56px;
  line-height: 1.33;
  border-radius: 12px;

  &::after {
    background: linear-gradient(90deg, #543faf, #2a2e54);
    content: '';
    display: block;
    position: absolute;
    left: 0;
    width: 100%;
    height: 1px;
    bottom: 0;
  }
`;

const StyledConfPopupBodyBtnArea = styled.div`
  display: flex;
  align-items: center;
  justify-content: end;
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

  &:hover:not(:disabled) {
    border-color: #8962ff;
    background: #8962ff;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;
