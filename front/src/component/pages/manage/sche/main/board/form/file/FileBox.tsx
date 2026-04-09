import styled from 'styled-components';
import { SCHE_IMAGE } from '@/component/lib/scheImage';
import { MODAL_IMAGE } from '@/component/lib/constImage';
import { useScheStore } from '@/component/stores/scheStore';
import { useShallow } from 'zustand/react/shallow';

interface Props {
  fileId: string;
  fileNm: string;
  fileType: string;
  isNotice: boolean;
  type: 'narrow' | 'wide' | 'contents';
}

const FileBox = ({ fileId, fileNm, fileType, isNotice, type }: Props) => {
  const { selectContentFileList, setSelectContentFileList, setSelectNarrowBack, setSelectWideBack } =
    useScheStore(
      useShallow((s) => ({
        selectContentFileList:    s.selectContentFileList,
        setSelectContentFileList: s.actions.setSelectContentFileList,
        setSelectNarrowBack:      s.actions.setSelectNarrowBack,
        setSelectWideBack:        s.actions.setSelectWideBack,
      })),
    );

  const handleClose = () => {
    if (type === 'narrow') {
      setSelectNarrowBack(null);
    } else if (type === 'wide') {
      setSelectWideBack(null);
    } else {
      setSelectContentFileList(selectContentFileList.filter((i) => i.fileId !== fileId));
    }
  };

  const isImage = fileType.includes('image');

  return (
    <StyledItem $isNotice={isNotice} $isImage={isImage}>
      <span>
        <i />
        <p>{fileNm}</p>
      </span>
      <button onClick={handleClose} />
    </StyledItem>
  );
};

export default FileBox;

const StyledItem = styled.div<{ $isNotice: boolean; $isImage: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  width: ${({ $isNotice }) => ($isNotice ? '206px' : '156px')};
  height: 36px;
  border-radius: 6px;
  background-color: #3E4165;

  span {
    display: flex;
    align-items: center;
    width: ${({ $isNotice }) => ($isNotice ? '147px' : '118px')};
  }

  i {
    display: inline-block;
    width: 18px;
    height: 18px;
    margin-right: 4px;
    background-size: 100%;
    background-image: url('${({ $isImage }) =>
      $isImage ? SCHE_IMAGE.FILE.BODY.FILE_ICON.IMAGE : SCHE_IMAGE.FILE.BODY.FILE_ICON.VIDEO}');
  }

  p {
    width: ${({ $isNotice }) => ($isNotice ? '129px' : '97px')};
    color: #fff;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }

  button {
    width: 18px;
    height: 18px;
    margin-left: 5px;
    background: url('${MODAL_IMAGE.CLS.BASE}') no-repeat center / 100%;
    &:hover { background-image: url('${MODAL_IMAGE.CLS.HOVER}'); }
  }
`;
