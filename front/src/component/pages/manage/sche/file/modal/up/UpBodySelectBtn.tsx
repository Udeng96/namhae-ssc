import styled from 'styled-components';
import React from 'react';
import { SCHE_IMAGE } from '@/component/lib/scheImage';
import { useShallow } from 'zustand/react/shallow';
import { useFileStore } from '@/component/stores/fileStore';

const UpBodySelectBtn = () => {
  const { setSelectFile } = useFileStore(
    useShallow((s) => ({ setSelectFile: s.actions.setSelectFile })),
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setSelectFile(file);
  };

  return (
    <StyledWrap>
      <label htmlFor="up-file">
        <StyledBox>
          <i />
          <p>업로드 파일 선택</p>
        </StyledBox>
      </label>
      <input type="file" id="up-file" onChange={handleChange} />
    </StyledWrap>
  );
};

export default UpBodySelectBtn;

const StyledWrap = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  width: 444px;
  height: 136px;
  border-radius: 12px;
  border: 1px solid #2A2E54;
  background-color: #12172E;
  cursor: pointer;

  &:hover { border-color: #363A5E; background-color: #1E243D; }

  label {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    cursor: pointer;
  }

  input {
    position: absolute;
    width: 0;
    height: 0;
    padding: 0;
    border: 0;
  }
`;

const StyledBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;

  i {
    display: block;
    width: 60px;
    height: 60px;
    background: url("${SCHE_IMAGE.FILE.MODAL.UP}") no-repeat center / 100%;
  }

  p {
    margin-top: 7px;
    font-size: 15px;
    color: #F2F4FC;
  }
`;
