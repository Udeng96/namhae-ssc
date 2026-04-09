import styled from 'styled-components';
import {
  CommonModal, CommonModalDimmed, CommonModalHide, CommonModalShow, CommonModalWrap,
} from '@/component/lib/css';
import { useCommonStore } from '@/component/stores/commonStore';
import { SCHE_MODAL_TYPE } from '@/component/constants/scheConst';
import DelHead from '@/component/pages/manage/sche/main/modal/del/DelHead';
import DelBody from '@/component/pages/manage/sche/main/modal/del/DelBody';
import DelFoot from '@/component/pages/manage/sche/main/modal/del/DelFoot';

const DelModal = () => {
  const modal = useCommonStore((s) => s.modal);

  return (
    <StyledModal $isOpen={modal === SCHE_MODAL_TYPE.DEL}>
      <StyledDimmed />
      <StyledWrap>
        <StyledBox>
          <DelHead />
          <DelBody />
          <DelFoot />
        </StyledBox>
      </StyledWrap>
    </StyledModal>
  );
};

export default DelModal;

const StyledModal = styled.div<{ $isOpen: boolean }>`
  ${CommonModal};
  ${({ $isOpen }) => ($isOpen ? CommonModalShow : CommonModalHide)};
`;
const StyledDimmed = styled.div`${CommonModalDimmed}`;
const StyledWrap   = styled.div`${CommonModalWrap}`;
const StyledBox    = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  border-radius: 20px;
  border: 1px solid #7A45FF;
  background: #0F1223;
  box-shadow: 0 12px 20px 4px rgba(0,0,0,.32);
`;
