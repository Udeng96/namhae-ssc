import styled from 'styled-components';
import { useMutation } from '@tanstack/react-query';
import { useShallow } from 'zustand/react/shallow';
import { useCommonStore } from '@/component/stores/commonStore';
import { useEventStore } from '@/component/stores/eventStore';
import { shareEventToFire } from '@/component/api/eventApi';
import { EventResultItem } from '@/component/types/event';
import { USER_TYPE } from '@/component/constants/user';

// TODO: 토스트 키 상수 분리 예정
const TOAST = {
  SHARE_SUCCESS: 'share_success',
  SHARE_FAILURE: 'share_failure',
} as const;

interface Props {
  eventItem: EventResultItem;
}

const EventMoreBtnFire = ({ eventItem }: Props) => {
  const userInfo = useCommonStore((state) => state.userInfo);
  const setToastKey = useEventStore((state) => state.actions.setToastKey);

  const { mutate: share, isLoading } = useMutation(
    () => shareEventToFire(eventItem.statEvetOutbSeqn),
    {
      onSuccess: ({ data }) => {
        setToastKey(data === '' ? TOAST.SHARE_FAILURE : TOAST.SHARE_SUCCESS);
      },
      onError: () => setToastKey(TOAST.SHARE_FAILURE),
    },
  );

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (eventItem.procSt === '4') return;
    if (userInfo?.userType !== USER_TYPE.ADMIN) return;
    share();
  };

  const isDisabled =
    isLoading ||
    eventItem.procSt === '4' ||
    eventItem.confStatus === '5' ||
    eventItem.confStatus === '';

  return (
    <StyledBtn disabled={isDisabled} onClick={handleShare}>
      소방 공유
    </StyledBtn>
  );
};

export default EventMoreBtnFire;

const StyledBtn = styled.button`
  width: 117px;
  height: 30px;
  font-size: 13px;
  font-weight: 500;
  background-color: #ed4842;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 10px;
  cursor: pointer;

  &:hover {
    background-color: #f7665e;
  }

  &:disabled {
    opacity: 0.3;
    pointer-events: none;
    cursor: default;
  }
`;
