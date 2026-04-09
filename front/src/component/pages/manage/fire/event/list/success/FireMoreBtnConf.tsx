import styled from 'styled-components';
import { useShallow } from 'zustand/react/shallow';
import { EventResultItem } from '@/component/types/event';
import { useFireStore } from '@/component/stores/fireStore';
import { useConfStore } from '@/component/stores/confStore';
import { useCommonStore } from '@/component/stores/commonStore';

interface Props {
  item: EventResultItem;
}

const FireMoreBtnConf = ({ item }: Props) => {
  const setModal = useCommonStore().actions.setModal;

  const setParticipantConf = useFireStore(
    (state) => state.actions.setParticipantConf,
  );

  const { fireConferenceSeqn } = useConfStore(
    useShallow((state) => ({
      fireConferenceSeqn: state.fireConferenceSeqn,
    })),
  );

  const isDisabled =
    fireConferenceSeqn === '' ||
    item.confStatus === '5' ||
    (fireConferenceSeqn !== '' && fireConferenceSeqn !== item.statEvetOutbSeqn);

  const handleBtn = (e: React.MouseEvent) => {
    e.stopPropagation();
    setParticipantConf(item);
    setModal('conf_participant');
  };

  return (
    <StyledConfBtn disabled={isDisabled} onClick={handleBtn}>
      <p>회의참가</p>
    </StyledConfBtn>
  );
};

export default FireMoreBtnConf;

const StyledConfBtn = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 117px;
  height: 64px;
  flex-shrink: 0;
  border-radius: 10px;
  background: #4070ff;

  p {
    width: 24px;
    height: 24px;
    font-size: 13px;
  }

  &:hover {
    background-color: #5e8fff;
  }

  &:disabled {
    opacity: 0.3;
    pointer-events: none;
    cursor: default;
  }
`;
