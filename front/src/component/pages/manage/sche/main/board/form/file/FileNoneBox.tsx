import styled from 'styled-components';
import { SCHE_IMAGE } from '@/component/lib/scheImage';
import { useDrop } from 'react-dnd';
import { useEffect, useState } from 'react';
import { useScheStore } from '@/component/stores/scheStore';
import { useShallow } from 'zustand/react/shallow';
import { ScheFileType } from '@/component/types/sche';
import { SCHE_TOAST_TYPE } from '@/component/constants/scheConst';

interface Props {
  isNotice: boolean;
  type: 'narrow' | 'wide' | 'contents';
}

const FileNoneBox = ({ isNotice, type }: Props) => {
  const {
    selectNarrowBack, selectWideBack, selectContentFileList, startTime, endTime,
    setScheToast, setSelectNarrowBack, setSelectWideBack, setSelectContentFileList,
  } = useScheStore(
    useShallow((s) => ({
      selectNarrowBack:         s.selectNarrowBack,
      selectWideBack:           s.selectWideBack,
      selectContentFileList:    s.selectContentFileList,
      startTime:                s.startTime,
      endTime:                  s.endTime,
      setScheToast:             s.actions.setScheToast,
      setSelectNarrowBack:      s.actions.setSelectNarrowBack,
      setSelectWideBack:        s.actions.setSelectWideBack,
      setSelectContentFileList: s.actions.setSelectContentFileList,
    })),
  );

  const [isDroppable, setIsDroppable] = useState(false);
  const [allFileDuration, setAllFileDuration] = useState(0);

  useEffect(() => {
    if (!isNotice && selectContentFileList.length > 0) {
      let total = 0;
      selectContentFileList.forEach((item) => {
        if (item.fileType.includes('video')) {
          const [h, m, sec] = item.fileDuration.split(':').map(Number);
          total += h * 3600 + m * 60 + sec;
        }
      });
      setAllFileDuration(total);
    }
  }, [selectContentFileList, isNotice]);

  const addContentsFile = (newFile: ScheFileType) => {
    const ids = selectContentFileList.map((i) => i.fileId);
    if (ids.includes(newFile.fileId)) {
      setScheToast(SCHE_TOAST_TYPE.DUPLICATE_FILE);
      return;
    }
    let maxSec = (Number(endTime) - Number(startTime)) * 3600;
    if (maxSec < 0) maxSec += 24 * 3600;

    if (newFile.fileType.includes('video')) {
      const [h, m, sec] = newFile.fileDuration.split(':').map(Number);
      const dur = h * 3600 + m * 60 + sec;
      if (allFileDuration + dur < maxSec) {
        setSelectContentFileList([...selectContentFileList, newFile]);
      } else {
        setScheToast(SCHE_TOAST_TYPE.OVER_DURATION);
      }
    } else {
      setSelectContentFileList([...selectContentFileList, newFile]);
    }
  };

  const [{ canDrop, isOver }, drop] = useDrop({
    accept: 'BUTTON',
    drop: (item: ScheFileType) => {
      if (!isDroppable) return;
      if (type === 'narrow' && !selectNarrowBack) setSelectNarrowBack(item);
      else if (type === 'wide' && !selectWideBack) setSelectWideBack(item);
      else if (type === 'contents') addContentsFile(item);
    },
    collect: (monitor) => ({
      canDrop: monitor.canDrop(),
      isOver:  monitor.isOver(),
    }),
  });

  useEffect(() => {
    setIsDroppable(isOver && canDrop);
  }, [isOver, canDrop]);

  return (
    <StyledEmpty ref={drop} $isNotice={isNotice} $isHover={isDroppable}>
      <i />
    </StyledEmpty>
  );
};

export default FileNoneBox;

const StyledEmpty = styled.div<{ $isHover: boolean; $isNotice: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: ${({ $isNotice }) => ($isNotice ? '206px' : '156px')};
  height: 36px;
  border-radius: 6px;
  cursor: ${({ $isHover }) => ($isHover ? 'pointer' : 'not-allowed')};
  border: dashed 1px ${({ $isHover }) => ($isHover ? '#7A45FF' : '#4B4E73')};
  background-color: ${({ $isHover }) => ($isHover ? '#12172E' : '#1A203A')};
  i {
    display: block;
    width: 18px;
    height: 18px;
    background: url('${SCHE_IMAGE.FILE.BODY.PLUS_BTN.BASE}') no-repeat center / 100%;
  }
`;
