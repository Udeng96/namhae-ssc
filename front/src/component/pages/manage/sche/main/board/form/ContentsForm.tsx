import styled from 'styled-components';
import {
  CommonFormBox, CommonFormBoxNm, CommonFormBoxVal, CommonFormBoxValDisabled,
  CommonScrollBar, CommonScrollBox,
} from '@/component/lib/css';
import FileBox from '@/component/pages/manage/sche/main/board/form/file/FileBox';
import FileNoneBox from '@/component/pages/manage/sche/main/board/form/file/FileNoneBox';
import { useScheStore } from '@/component/stores/scheStore';
import { useShallow } from 'zustand/react/shallow';
import { useFileStore } from '@/component/stores/fileStore';
import { useEffect } from 'react';
import { SCHE_MODE } from '@/component/constants/scheConst';

const ContentsForm = () => {
  const { contentsFiles } = useFileStore(useShallow((s) => ({ contentsFiles: s.contentsFiles })));
  const { scheMode, activeSche, selectContentFileList, setSelectContentFileList } = useScheStore(
    useShallow((s) => ({
      scheMode:                 s.scheMode,
      activeSche:               s.activeSche,
      selectContentFileList:    s.selectContentFileList,
      setSelectContentFileList: s.actions.setSelectContentFileList,
    })),
  );

  // activeSche 변경 시 파일 목록 동기화
  useEffect(() => {
    if (activeSche) {
      const ids = activeSche.contentFile.split(',');
      setSelectContentFileList(contentsFiles.filter((f) => ids.includes(f.fileId)));
    } else {
      setSelectContentFileList([]);
    }
  }, [activeSche]);

  // contentsFiles 변경 시 선택 목록 검증
  useEffect(() => {
    if (contentsFiles.length === 0) {
      setSelectContentFileList([]);
    } else if (selectContentFileList.length > 0) {
      const ids = contentsFiles.map((f) => f.fileId);
      setSelectContentFileList(selectContentFileList.filter((f) => ids.includes(f.fileId)));
    }
  }, [contentsFiles]);

  return (
    <StyledContents>
      <StyledContentsNm>콘텐츠 선택*</StyledContentsNm>
      <StyledContentsVal>
        <StyledContentsValBox>
          {scheMode === SCHE_MODE.READ && <StyledDisabled />}
          {selectContentFileList.map((item) => (
            <FileBox
              key={item.fileId}
              fileId={item.fileId}
              fileNm={item.fileNm}
              fileType={item.fileType}
              isNotice={false}
              type="contents"
            />
          ))}
          <FileNoneBox type="contents" isNotice={false} />
        </StyledContentsValBox>
        <StyledFileNotice>
          왼쪽 콘텐츠 리스트 영상파일을 Drag &amp; Drop하여 넣어주세요.
        </StyledFileNotice>
      </StyledContentsVal>
    </StyledContents>
  );
};

export default ContentsForm;

const StyledContents    = styled.div`${CommonFormBox}`;
const StyledContentsNm  = styled.div`${CommonFormBoxNm}`;
const StyledContentsVal = styled.div`${CommonFormBoxVal}`;
const StyledDisabled    = styled.div`${CommonFormBoxValDisabled}`;

const StyledContentsValBox = styled.ul`
  ${CommonScrollBox};
  ${CommonScrollBar};
  max-height: 343px;
  display: flex;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: 8px 13px;
`;

const StyledFileNotice = styled.div`
  color: #A8AFBD;
  font-size: 11px;
  font-weight: 300;
  line-height: 14px;
`;
