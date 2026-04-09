import styled from 'styled-components';
import {
  CommonFormBox, CommonFormBoxNm, CommonFormBoxVal,
} from '@/component/lib/css';
import FileBox from '@/component/pages/manage/sche/main/board/form/file/FileBox';
import FileNoneBox from '@/component/pages/manage/sche/main/board/form/file/FileNoneBox';
import { useScheStore } from '@/component/stores/scheStore';
import { useShallow } from 'zustand/react/shallow';
import { useFileStore } from '@/component/stores/fileStore';
import { useEffect } from 'react';
import { SCHE_RESULT_TYPE } from '@/component/constants/scheConst';

const FileForm = () => {
  const { noticeFiles } = useFileStore(useShallow((s) => ({ noticeFiles: s.noticeFiles })));
  const {
    activeSche, selectNarrowBack, selectWideBack, setSelectNarrowBack, setSelectWideBack,
  } = useScheStore(
    useShallow((s) => ({
      activeSche:          s.activeSche,
      selectNarrowBack:    s.selectNarrowBack,
      selectWideBack:      s.selectWideBack,
      setSelectNarrowBack: s.actions.setSelectNarrowBack,
      setSelectWideBack:   s.actions.setSelectWideBack,
    })),
  );

  useEffect(() => {
    if (!activeSche || activeSche.contentType !== SCHE_RESULT_TYPE.NORM) {
      setSelectWideBack(null);
      setSelectNarrowBack(null);
      return;
    }
    const [wideId, narrowId] = activeSche.backImage.split(',').map((s) => s.trim());
    const find = (id: string) => noticeFiles.find((f) => f.fileId === id) ?? null;
    setSelectWideBack(wideId === 'none' ? null : find(wideId));
    setSelectNarrowBack(narrowId === 'none' ? null : find(narrowId));
  }, [activeSche, noticeFiles]);

  return (
    <StyledFileForm>
      <StyledFileFormNm>배경 선택</StyledFileFormNm>
      <StyledFileFormVal>
        <StyledFileFormValBox>
          <p>이미지 파일 1 (32인치)</p>
          {selectNarrowBack ? (
            <FileBox
              type="narrow"
              fileId={selectNarrowBack.fileId}
              fileNm={selectNarrowBack.fileNm}
              fileType={selectNarrowBack.fileType}
              isNotice={true}
            />
          ) : (
            <FileNoneBox isNotice={true} type="narrow" />
          )}
        </StyledFileFormValBox>
        <StyledFileNotice>
          왼쪽 공지 알림 리스트 파일을 Drag &amp; Drop 하여 넣어주세요.<br />
          배경을 선택하지 않을 시 기본 배경 이미지로 제공됩니다.
        </StyledFileNotice>
      </StyledFileFormVal>
    </StyledFileForm>
  );
};

export default FileForm;

const StyledFileForm    = styled.div`${CommonFormBox}`;
const StyledFileFormNm  = styled.div`${CommonFormBoxNm}`;
const StyledFileFormVal = styled.div`${CommonFormBoxVal}`;

const StyledFileFormValBox = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  p { font-size: 13px; font-weight: 300; }
`;

const StyledFileNotice = styled.div`
  color: #A8AFBD;
  font-size: 11px;
  font-weight: 300;
  line-height: 14px;
`;
