import styled from 'styled-components';
import {
  CommonModal, CommonModalDimmed, CommonModalHide, CommonModalShow, CommonModalWrap,
} from '@/component/lib/css';
import { MODAL_IMAGE } from '@/component/lib/constImage';
import { useShallow } from 'zustand/react/shallow';
import { useCommonStore } from '@/component/stores/commonStore';
import { SCHE_MODAL_TYPE } from '@/component/constants/scheConst';
import PrevEmerWide from '@/component/pages/manage/sche/main/modal/prev/emer/PrevEmerWide';

const PrevEmer = () => {
  const { modal, setModal } = useCommonStore(
    useShallow((s) => ({ modal: s.modal, setModal: s.actions.setModal })),
  );

  return (
    <StyledModal $isOpen={modal === SCHE_MODAL_TYPE.PREV_EMER}>
      <StyledDimmed />
      <StyledWrap>
        <StyledBox>
          <StyledHead>
            <div>긴급공지 <span>미리보기</span></div>
            <button onClick={() => setModal(SCHE_MODAL_TYPE.NONE)} />
          </StyledHead>
          <StyledBody>
            <PrevEmerWide />
          </StyledBody>
        </StyledBox>
      </StyledWrap>
    </StyledModal>
  );
};

export default PrevEmer;

const StyledModal = styled.div<{ $isOpen: boolean }>`
  ${CommonModal};
  ${({ $isOpen }) => ($isOpen ? CommonModalShow : CommonModalHide)};
`;
const StyledDimmed = styled.div`${CommonModalDimmed}`;
const StyledWrap   = styled.div`${CommonModalWrap}`;

const StyledBox = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  border-radius: 20px;
  border: 1px solid #7A45FF;
  background: #0F1223;
  box-shadow: 0 12px 20px 4px rgba(0,0,0,.32);
`;

const StyledHead = styled.div`
  display: flex;
  align-items: center;
  padding: 33px 24px 22px 32px;

  div {
    width: 100%;
    height: 40px;
    display: flex;
    align-items: center;
    gap: 1px;
    color: #fff;
    font-size: 18px;
    font-weight: 500;
    span { color: #9C7BFF; margin-left: 4px; }
  }

  button {
    width: 30px;
    height: 30px;
    margin-left: auto;
    background: url("${MODAL_IMAGE.CLS.BASE}") no-repeat center / 100%;
    cursor: pointer;
    &:hover { background-image: url("${MODAL_IMAGE.CLS.HOVER}"); }
  }
`;

const StyledBody = styled.div`
  height: 688px;
  width: 100%;
  display: flex;
`;
