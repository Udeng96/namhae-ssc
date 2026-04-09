import styled from 'styled-components';
import { CommonModalClsBtn } from '@/component/lib/css';
import { useCommonStore } from '@/component/stores/commonStore';
import { SCHE_MODAL_TYPE } from '@/component/constants/scheConst';

interface Props { isUp: boolean; }

const FileModalHead = ({ isUp }: Props) => {
  const setModal = useCommonStore((s) => s.actions.setModal);

  return (
    <StyledHead $isUp={isUp}>
      <h2>파일 <span>{isUp ? '업로드' : '삭제'}</span></h2>
      <StyledClsBtn onClick={() => setModal(SCHE_MODAL_TYPE.NONE)} />
    </StyledHead>
  );
};

export default FileModalHead;

const StyledHead = styled.div<{ $isUp: boolean }>`
  display: flex;
  align-items: center;
  padding: ${({ $isUp }) => ($isUp ? '27px 24px 15px 32px' : '33px 24px 15px 32px')};

  h2 {
    font-size: 18px;
    font-weight: 500;
    span { color: ${({ $isUp }) => ($isUp ? '#9C7BFF' : '#FF5147')}; }
  }
`;

const StyledClsBtn = styled.button`${CommonModalClsBtn}`;
