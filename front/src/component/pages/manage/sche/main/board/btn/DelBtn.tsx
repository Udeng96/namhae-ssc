import styled from 'styled-components';
import { SCHE_IMAGE } from '@/component/lib/scheImage';
import { SCHE_MODAL_TYPE } from '@/component/constants/scheConst';
import { useCommonStore } from '@/component/stores/commonStore';

interface Props {
  isEmer: boolean;
}

const DelBtn = ({ isEmer }: Props) => {
  const setModal = useCommonStore((s) => s.actions.setModal);
  return (
    <StyledDelBtn $isEmer={isEmer} onClick={() => setModal(SCHE_MODAL_TYPE.DEL)}>
      <i /><span>삭제</span>
    </StyledDelBtn>
  );
};

export default DelBtn;

const StyledDelBtn = styled.button<{ $isEmer: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: ${({ $isEmer }) => ($isEmer ? '424px' : '208px')};
  height: 36px;
  border-radius: 18px;
  background-color: rgb(236, 86, 86);
  cursor: pointer;
  color: #fff;
  &:disabled { pointer-events: none; opacity: 0.33; }
  i {
    display: inline-block;
    width: 18px; height: 18px;
    margin-right: 6px;
    background: url('${SCHE_IMAGE.BOARD.BTN.DEL}') no-repeat center / 100%;
  }
`;
