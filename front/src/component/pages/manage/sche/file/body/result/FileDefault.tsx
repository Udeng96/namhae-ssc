import styled from 'styled-components';
import { ScheFileType } from '@/component/types/sche';
import FileDefaultItem from '@/component/pages/manage/sche/file/body/result/FileDefaultItem';

interface Props { files: ScheFileType[]; isNotice: boolean; }

const FileDefault = ({ files, isNotice }: Props) => (
  <StyledDefault $isNotice={isNotice}>
    {files.map((file) => (
      <FileDefaultItem key={file.fileId} file={file} />
    ))}
  </StyledDefault>
);

export default FileDefault;

const StyledDefault = styled.div<{ $isNotice: boolean }>`
  height: ${({ $isNotice }) => ($isNotice ? '672px' : '736px')};
`;
