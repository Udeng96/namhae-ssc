import styled from 'styled-components';
import { useRef, useState } from 'react';
import { useDrag } from 'react-dnd';
import { SCHE_IMAGE } from '@/component/lib/scheImage';
import { ScheFileType } from '@/component/types/sche';
import FileDefaultTooltip from '@/component/pages/manage/sche/file/body/result/FileDefaultTooltip';

interface Props { item: ScheFileType; }

const FileDefaultNm = ({ item }: Props) => {
  const [isShow, setIsShow] = useState(false);
  const pRef = useRef<HTMLParagraphElement>(null);

  const [, dragRef] = useDrag(() => ({
    type: 'BUTTON',
    item,
  }));

  const handleMouseOver = () => {
    if (pRef.current) {
      setIsShow(pRef.current.scrollWidth > pRef.current.clientWidth);
    }
  };

  return (
    <StyledNm
      ref={dragRef}
      onMouseDown={() => setIsShow(false)}
      onMouseLeave={() => setIsShow(false)}
      onMouseOver={handleMouseOver}
    >
      <i />
      <p ref={pRef}>{item.fileNm}</p>
      <FileDefaultTooltip isShow={isShow} content={item.fileNm} />
    </StyledNm>
  );
};

export default FileDefaultNm;

const StyledNm = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 144px;
  height: 36px;
  border-radius: 5px;
  background-color: #3E4165;
  box-shadow: 1px 1px 1px 0 rgba(255,255,255,.1) inset;
  cursor: pointer;

  i {
    display: inline-block;
    width: 18px;
    height: 18px;
    margin-right: 4px;
    background: url("${SCHE_IMAGE.FILE.BODY.FILE_ICON.IMAGE}") no-repeat center / 100%;
  }

  p {
    width: 92px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    line-height: 1.66;
  }

  &:hover {
    background-color: #535680;
    p { text-decoration: underline; text-underline-offset: 3px; }
  }
`;
