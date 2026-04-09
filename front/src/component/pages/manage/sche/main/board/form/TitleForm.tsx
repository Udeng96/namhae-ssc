import styled from 'styled-components';
import {
  CommonFormBox, CommonFormBoxNm, CommonFormBoxVal, CommonFormBoxValDisabled,
} from '@/component/lib/css';
import { INPUT_IMAGE } from '@/component/lib/constImage';
import { useScheStore } from '@/component/stores/scheStore';
import { useShallow } from 'zustand/react/shallow';
import { SCHE_MODE } from '@/component/constants/scheConst';
import { useEffect } from 'react';

const TitleForm = () => {
  const { titleOpt, setTitleOpt, scheMode, activeSche } = useScheStore(
    useShallow((s) => ({
      titleOpt:    s.titleOpt,
      setTitleOpt: s.actions.setTitleOpt,
      scheMode:    s.scheMode,
      activeSche:  s.activeSche,
    })),
  );

  useEffect(() => {
    setTitleOpt(activeSche ? activeSche.contentTitle : '');
  }, [activeSche]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.length <= 24) setTitleOpt(e.target.value);
  };

  return (
    <StyledTitle>
      <StyledTitleNm>제목*</StyledTitleNm>
      <StyledTitleVal>
        <StyledTitleValBox>
          {scheMode === SCHE_MODE.READ && <StyledDisabled />}
          <StyledInput
            placeholder="제목을 입력해 주세요"
            value={titleOpt}
            onChange={handleChange}
          />
          <StyledClrBtn onClick={() => setTitleOpt('')} />
        </StyledTitleValBox>
        <StyledCnt $isFull={titleOpt.length === 24}>
          <span>{titleOpt.length}</span>/24
        </StyledCnt>
      </StyledTitleVal>
    </StyledTitle>
  );
};

export default TitleForm;

const StyledTitle    = styled.div`${CommonFormBox}`;
const StyledTitleNm  = styled.div`${CommonFormBoxNm}`;
const StyledTitleVal = styled.div`${CommonFormBoxVal}`;

const StyledTitleValBox = styled.div`
  position: relative;
  width: 100%;
`;

const StyledInput = styled.input`
  width: 100%;
  height: 36px;
  padding: 0 65px 0 15px;
  font-weight: 300;
  color: #fff;
  border-radius: 6px;
  border: 1px solid #090A14;
  background: #12172E;
`;

const StyledClrBtn = styled.button`
  position: absolute;
  display: block;
  top: 4px;
  right: 4px;
  width: 28px;
  height: 28px;
  z-index: 1;
  background: url('${INPUT_IMAGE.CLR.BASE}') no-repeat center / 100%;
  &:hover { background: url('${INPUT_IMAGE.CLR.HOVER}') no-repeat center / 100%; cursor: pointer; }
  &:disabled { pointer-events: none; }
`;

const StyledDisabled = styled.div`${CommonFormBoxValDisabled}`;

const StyledCnt = styled.button<{ $isFull: boolean }>`
  padding-left: 15px;
  font-weight: 300;
  color: #8588A1;
  span {
    font-weight: 300;
    color: ${({ $isFull }) => ($isFull ? '#EC5656' : '#F2F3FC')};
  }
`;
