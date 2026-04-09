import styled from 'styled-components';
import { useShallow } from 'zustand/react/shallow';
import { useFacStore } from '@/component/stores/facStore';
import { INPUT_IMAGE } from '@/component/lib/constImage';

const FacNameInput = () => {
  const { centerName, setCenterName } = useFacStore(
    useShallow((state) => ({
      centerName:    state.centerName,
      setCenterName: state.actions.setCenterName,
    })),
  );

  return (
    <StyledBox>
      <StyledInput
        placeholder="경로당 이름 등 검색어를 입력해 주시오"
        value={centerName}
        onChange={(e) => setCenterName(e.currentTarget.value)}
      />
      <StyledClrBtn onClick={() => setCenterName('')} />
    </StyledBox>
  );
};

export default FacNameInput;

const StyledBox = styled.div`
  display: inline-block;
  width: 100%;
  position: relative;
  font-size: 13px;
`;

const StyledInput = styled.input`
  width: 100%;
  height: 40px;
  display: flex;
  align-items: center;
  padding: 13px 20px;
  border-radius: 6px;
  border: 1px solid #3e4165;
  background: #0f1223;
  font-size: 13px;
  font-weight: 300;
  color: #fff;
  &::placeholder { color: #707287; }
`;

const StyledClrBtn = styled.button`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  right: 6px;
  width: 28px;
  height: 28px;
  background: url('${INPUT_IMAGE.CLR.BASE}') no-repeat center / 100%;
  &:hover { background-image: url('${INPUT_IMAGE.CLR.HOVER}'); }
`;
