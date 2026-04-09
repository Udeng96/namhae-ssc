import styled from 'styled-components';
import { useCommonStore } from '@/component/stores/commonStore';
import { SCHE_MODAL_TYPE } from '@/component/constants/scheConst';

interface Props {
  isUp: boolean;
  setIsRequestUp:  React.Dispatch<React.SetStateAction<boolean>>;
  setIsRequestDel: React.Dispatch<React.SetStateAction<boolean>>;
}

const FileModalFoot = ({ isUp, setIsRequestUp, setIsRequestDel }: Props) => {
  const setModal = useCommonStore((s) => s.actions.setModal);

  const handleAction = () => {
    if (isUp) setIsRequestUp(true);
    else      setIsRequestDel(true);
  };

  return (
    <StyledFoot>
      <StyledClsBtn onClick={() => setModal(SCHE_MODAL_TYPE.NONE)}>취소</StyledClsBtn>
      <StyledActionBtn onClick={handleAction} $isUp={isUp}>
        {isUp ? '업로드' : '삭제'}
      </StyledActionBtn>
    </StyledFoot>
  );
};

export default FileModalFoot;

const StyledFoot = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 0 8px;
  padding: 16px 32px 24px;
`;

const btnBase = `
  display: flex; align-items: center; justify-content: center;
  width: 86px; height: 34px; font-size: 13px; font-weight: 500;
  border-radius: 6px; cursor: pointer;
`;

const StyledClsBtn = styled.button`
  ${btnBase}
  color: #A8AFBD; border: 1px solid #2A2E54; background: #0F1223;
  &:hover { color: #FFF; border-color: #3E4165; background: #1A203A; }
`;

const StyledActionBtn = styled.button<{ $isUp: boolean }>`
  ${btnBase}
  color: #FFF;
  border: 1px solid ${({ $isUp }) => ($isUp ? '#7A45FF' : 'transparent')};
  background: ${({ $isUp }) => ($isUp ? '#7A45FF' : '#FF5147')};
  &:hover {
    border-color: #8962FF;
    background: ${({ $isUp }) => ($isUp ? '#8962FF' : '#FF7373')};
    box-shadow: 0 10px 12px rgba(122,69,255,.24);
  }
  &:disabled { background: #32236B; color: #8C84AC; pointer-events: none; }
`;
