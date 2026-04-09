import styled from 'styled-components';
import { useEffect, useState } from 'react';
import { useCommonStore } from '@/component/stores/commonStore';
import { useFileStore }   from '@/component/stores/fileStore';
import { ScheFileType } from '@/component/types/sche';
import { FILE_MODAL_TYPE } from '@/component/constants/scheConst';
import { SCHE_IMAGE } from '@/component/lib/scheImage';
import FileDefaultNm from '@/component/pages/manage/sche/file/body/result/FileDefaultNm';

interface Props { file: ScheFileType; }

const FileDefaultItem = ({ file }: Props) => {
  const setModal      = useCommonStore((s) => s.actions.setModal);
  const setDeleteFile = useFileStore((s) => s.actions.setDeleteFile);
  const [fileInfo, setFileInfo] = useState('');

  useEffect(() => {
    setFileInfo(
      file.normalYn === '1'
        ? `${file.width}px / ${file.height}px`
        : file.fileDuration,
    );
  }, [file]);

  const handleDel = () => {
    setModal(FILE_MODAL_TYPE.DEL);
    setDeleteFile(file);
  };

  return (
    <StyledItem>
      <StyledRow>
        <StyledCell><FileDefaultNm item={file} /></StyledCell>
        <StyledCell>{fileInfo}</StyledCell>
        <StyledCell>{file.fileType}</StyledCell>
        <StyledCell><button onClick={handleDel} /></StyledCell>
      </StyledRow>
    </StyledItem>
  );
};

export default FileDefaultItem;

const StyledItem = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  height: 48px;
  padding: 4px 7px;
  border-radius: 7px;
  border: 1px solid #2A2E54;
  background: #1A203A;
  margin-bottom: 4px;

  &:last-child { margin-bottom: 0; }
`;

const StyledRow = styled.ul`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
`;

const StyledCell = styled.li`
  display: flex;
  position: relative;
  padding: 0 6px;
  font-size: 13px;
  height: 36px;
  line-height: 36px;
  white-space: nowrap;
  text-overflow: ellipsis;

  &:nth-child(1) { width: 160px; justify-content: flex-start; padding: 0; }
  &:nth-child(2) { width: 123px; justify-content: center; }
  &:nth-child(3) { width: 115px; justify-content: flex-start; }
  &:nth-child(4) { width: 66px;  align-items: center; justify-content: center; }

  button {
    width: 26px;
    height: 26px;
    background: url("${SCHE_IMAGE.FILE.BODY.DEL_BTN.BASE}") no-repeat center / 100%;
    cursor: pointer;
    &:hover { background-image: url("${SCHE_IMAGE.FILE.BODY.DEL_BTN.HOVER}"); }
  }
`;
