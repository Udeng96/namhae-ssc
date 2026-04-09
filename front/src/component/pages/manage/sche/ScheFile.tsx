import styled from 'styled-components';
import { useEffect } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { useQuery } from '@tanstack/react-query';
import { CommonModalDimmed } from '@/component/lib/css';
import { useFileStore } from '@/component/stores/fileStore';
import { useScheStore } from '@/component/stores/scheStore';
import { fetchAllFiles } from '@/component/api/fileApi';
import { SCHE_TYPE } from '@/component/constants/scheConst';
import ScheFileHead from '@/component/pages/manage/sche/file/ScheFileHead';
import ScheFileRow  from '@/component/pages/manage/sche/file/ScheFileRow';
import ScheFileBody from '@/component/pages/manage/sche/file/body/ScheFileBody';

const ScheFile = () => {
  const { requestState, setContentsFiles, setNoticeFiles, setRequestState } = useFileStore(
    useShallow((s) => ({
      requestState:    s.requestState,
      setContentsFiles: s.actions.setContentsFiles,
      setNoticeFiles:   s.actions.setNoticeFiles,
      setRequestState:  s.actions.setRequestState,
    })),
  );

  const { selectContentFileList, setSelectContentFileList, activeType } = useScheStore(
    useShallow((s) => ({
      selectContentFileList:    s.selectContentFileList,
      setSelectContentFileList: s.actions.setSelectContentFileList,
      activeType:               s.activeType,
    })),
  );

  const { data: files, isLoading } = useQuery(
    ['scheFiles'],
    fetchAllFiles,
    { enabled: requestState === 'all' || requestState === 'loading' },
  );

  useEffect(() => {
    if (isLoading) setRequestState('loading');
  }, [isLoading]);

  useEffect(() => {
    if (!files) return;
    const contents = files.data.filter((f) => f.normalYn === '0');
    setContentsFiles(contents);
    setNoticeFiles(files.data.filter((f) => f.normalYn === '1'));

    if (contents.length > 0) {
      const ids = contents.map((f) => f.fileId);
      setSelectContentFileList(selectContentFileList.filter((f) => ids.includes(f.fileId)));
    }
    setRequestState('none');
  }, [files]);

  return (
    <StyledFile>
      {activeType === SCHE_TYPE.EMER && <StyledDimmed />}
      <ScheFileHead />
      <ScheFileRow />
      <ScheFileBody />
    </StyledFile>
  );
};

export default ScheFile;

const StyledFile = styled.div`
  position: relative;
  height: 908px;
  border-radius: 16px;
  border: 1px solid #222A47;
  background: #12172E;
  box-shadow: 0 6px 8px rgba(0,0,0,.16);
`;

const StyledDimmed = styled.div`
  ${CommonModalDimmed};
  z-index: 5;
`;
