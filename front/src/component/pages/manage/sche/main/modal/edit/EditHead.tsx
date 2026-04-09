import styled from 'styled-components';
import { CommonModalClsBtn } from '@/component/lib/css';
import { useCommonStore } from '@/component/stores/commonStore';
import { SCHE_MODAL_TYPE } from '@/component/constants/scheConst';

const EditHead = () => {
  const setModal = useCommonStore((s) => s.actions.setModal);

  return (
    <StyledHead>
      <h2>일정 <span>수정</span></h2>
      <StyledClsBtn onClick={() => setModal(SCHE_MODAL_TYPE.NONE)} />
    </StyledHead>
  );
};

export default EditHead;

const StyledHead = styled.div`
  display: flex;
  align-items: center;
  padding: 33px 24px 15px 32px;

  h2 {
    font-size: 18px;
    font-weight: 500;
    span { color: rgb(224, 165, 63); }
  }
`;

const StyledClsBtn = styled.button`${CommonModalClsBtn}`;
