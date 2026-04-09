import styled from 'styled-components';
import { SCHE_IMAGE } from '@/component/lib/scheImage';
import { SCHE_MODAL_TYPE, SCHE_MODE, SCHE_TYPE } from '@/component/constants/scheConst';
import { useScheStore } from '@/component/stores/scheStore';
import { useShallow } from 'zustand/react/shallow';
import { useCommonStore } from '@/component/stores/commonStore';
import { useEffect, useState } from 'react';

const EditBtn = () => {
  const setModal = useCommonStore((s) => s.actions.setModal);
  const {
    scheMode, activeType, titleOpt, selectScOpt, startDtm, endDtm,
    startTime, endTime, selectContent, selectDay, selectContentFileList,
  } = useScheStore(
    useShallow((s) => ({
      scheMode:             s.scheMode,
      activeType:           s.activeType,
      titleOpt:             s.titleOpt,
      selectScOpt:          s.selectScOpt,
      startDtm:             s.startDtm,
      endDtm:               s.endDtm,
      startTime:            s.startTime,
      endTime:              s.endTime,
      selectContent:        s.selectContent,
      selectDay:            s.selectDay,
      selectContentFileList: s.selectContentFileList,
    })),
  );

  const [isDisabled, setIsDisabled] = useState(false);

  useEffect(() => {
    if (activeType === SCHE_TYPE.CONTENT) {
      setIsDisabled(
        !titleOpt || !selectScOpt.length || !startDtm || !endDtm ||
        !startTime || !endTime || !selectContentFileList.length || !selectDay,
      );
    } else {
      setIsDisabled(!titleOpt || !selectScOpt.length || !startDtm || !endDtm || !startTime || !endTime);
    }
  }, [scheMode, activeType, titleOpt, selectScOpt, startDtm, endDtm, startTime, endTime, selectContent, selectDay, selectContentFileList]);

  return (
    <StyledEditBtn
      disabled={isDisabled || scheMode === SCHE_MODE.READ}
      onClick={() => setModal(SCHE_MODAL_TYPE.EDIT)}
    >
      <i /><span>수정</span>
    </StyledEditBtn>
  );
};

export default EditBtn;

const StyledEditBtn = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 208px;
  height: 36px;
  border-radius: 18px;
  background-color: rgb(224, 165, 63);
  cursor: pointer;
  color: #fff;
  &:disabled { pointer-events: none; opacity: 0.33; }
  i {
    display: inline-block;
    width: 18px; height: 18px;
    margin-right: 6px;
    background: url('${SCHE_IMAGE.BOARD.BTN.EDIT}') no-repeat center / 100%;
  }
`;
