import styled from 'styled-components';
import {
  CommonModal, CommonModalDimmed, CommonModalHide, CommonModalShow, CommonModalWrap,
} from '@/component/lib/css';
import { MODAL_IMAGE } from '@/component/lib/constImage';
import { useShallow } from 'zustand/react/shallow';
import { useCommonStore } from '@/component/stores/commonStore';
import { SCHE_MODAL_TYPE } from '@/component/constants/scheConst';
import PrevNarrow from '@/component/pages/manage/sche/main/modal/prev/norm/PrevNarrow';

const PrevNorm = () => {
  const { modal, setModal } = useCommonStore(
    useShallow((s) => ({ modal: s.modal, setModal: s.actions.setModal })),
  );

  return (
    <StyledModal $isOpen={modal === SCHE_MODAL_TYPE.PREV_NORM}>
      <StyledDimmed />
      <StyledWrap>
        <StyledBox>
          <StyledHead>
            <h2>일반공지 <span>미리보기</span></h2>
            <button onClick={() => setModal(SCHE_MODAL_TYPE.NONE)} />
          </StyledHead>
          <StyledBody>
            <StyledBodyTitle>
              <div>대시보드 (32 인치)</div>
            </StyledBodyTitle>
            <StyledBodyWrap>
              <PrevNarrow />
            </StyledBodyWrap>
          </StyledBody>
        </StyledBox>
      </StyledWrap>
    </StyledModal>
  );
};

export default PrevNorm;

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

  h2 {
    font-size: 18px;
    font-weight: 500;
    span { color: #9C7BFF; }
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
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 1px;
  font-size: 17px;
  color: #F2F4FC;

  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 1px;
    background: linear-gradient(90deg, #543FAF, #2A2E54);
  }
  &::after {
    content: '';
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 1px;
    background: linear-gradient(90deg, #2A2E54, #543FAF);
  }
`;

const StyledBodyTitle = styled.div`
  width: 100%;
  height: 40px;
  display: flex;
  gap: 1px;
  color: #9C7BFF;
  font-size: 16px;
  font-weight: 400;

  div {
    width: 341px;
    display: flex;
    align-items: center;
    padding-left: 32px;
  }
`;

const StyledBodyWrap = styled.div`
  height: 450px;
  width: 100%;
  display: flex;
`;
