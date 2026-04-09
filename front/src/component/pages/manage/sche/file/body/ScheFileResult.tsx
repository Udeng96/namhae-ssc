import styled from 'styled-components';
import { useEffect, useState } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { CommonScrollBar, CommonScrollBox } from '@/component/lib/css';
import { useFileStore } from '@/component/stores/fileStore';
import { useScheStore } from '@/component/stores/scheStore';
import { ScheFileType } from '@/component/types/sche';
import { SCHE_TYPE } from '@/component/constants/scheConst';
import FileNone     from '@/component/pages/manage/sche/file/body/result/FileNone';
import FileSkeleton from '@/component/pages/manage/sche/file/body/result/FileSkeleton';
import FileDefault  from '@/component/pages/manage/sche/file/body/result/FileDefault';

const ScheFileResult = () => {
  const [fileList, setFileList] = useState<ScheFileType[]>([]);

  const { contentsFiles, noticeFiles, requestState } = useFileStore(
    useShallow((s) => ({
      contentsFiles: s.contentsFiles,
      noticeFiles:   s.noticeFiles,
      requestState:  s.requestState,
    })),
  );

  const activeType = useScheStore((s) => s.activeType);
  const isNotice   = activeType !== SCHE_TYPE.CONTENT;

  useEffect(() => {
    setFileList(isNotice ? noticeFiles : contentsFiles);
  }, [contentsFiles, noticeFiles, activeType]);

  const isLoading = requestState === 'loading';
  const isEmpty   = !isLoading && fileList.length === 0;

  return (
    <StyledResult>
      {isLoading && <FileSkeleton />}
      {!isLoading && isEmpty  && <FileNone isNotice={isNotice} />}
      {!isLoading && !isEmpty && <FileDefault files={fileList} isNotice={isNotice} />}
    </StyledResult>
  );
};

export default ScheFileResult;

const StyledResult = styled.div`
  ${CommonScrollBox};
  ${CommonScrollBar};
  padding-right: 8px;
`;
