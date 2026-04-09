import styled from 'styled-components';
import { SCHE_IMAGE } from '@/component/lib/scheImage';
import { useScheStore } from '@/component/stores/scheStore';
import { useShallow } from 'zustand/react/shallow';
import { useEffect, useState } from 'react';
import {
  SCHE_COLOR_TYPE, SCHE_RESULT_TYPE, SCHE_SAVE_RESULT, SCHE_TOAST_TYPE,
} from '@/component/constants/scheConst';
import { ScheItem } from '@/component/types/sche';
import moment from 'moment';
import { useMutation } from '@tanstack/react-query';
import { saveSchedule } from '@/component/api/scheApi';
import { useCommonStore } from '@/component/stores/commonStore';

const DAY_EN: Record<string, string> = {
  '월요일': 'Monday', '화요일': 'Tuesday', '수요일': 'Wednesday',
  '목요일': 'Thursday', '금요일': 'Friday', '토요일': 'Saturday',
  '일요일': 'Sunday',
};

const getDatesBetween = (start: string, end: string, day: string): string[] => {
  const dates: string[] = [];
  const curr = moment(start, 'YYYYMMDD');
  const last = moment(end, 'YYYYMMDD');
  while (curr.isSameOrBefore(last)) {
    if (day === 'Everyday' || day === moment(curr.toDate()).format('dddd')) {
      dates.push(curr.format('YYYYMMDD'));
    }
    curr.add(1, 'days');
  }
  return dates;
};

const SaveBtn = () => {
  const userInfo = useCommonStore((s) => s.userInfo);
  const {
    setScheToast, setRequestState, titleOpt, selectScOpt, selectDay,
    startDtm, endDtm, startTime, endTime, selectContentFileList,
    setTitleOpt, setSelectScOpt, setSelectDay,
    setStartDtm, setEndDtm, setStartTime, setEndTime, setSelectContentFileList,
  } = useScheStore(
    useShallow((s) => ({
      setScheToast:             s.actions.setScheToast,
      setRequestState:          s.actions.setRequestState,
      titleOpt:                 s.titleOpt,
      selectScOpt:              s.selectScOpt,
      selectDay:                s.selectDay,
      startDtm:                 s.startDtm,
      endDtm:                   s.endDtm,
      startTime:                s.startTime,
      endTime:                  s.endTime,
      selectContentFileList:    s.selectContentFileList,
      setTitleOpt:              s.actions.setTitleOpt,
      setSelectScOpt:           s.actions.setSelectScOpt,
      setSelectDay:             s.actions.setSelectDay,
      setStartDtm:              s.actions.setStartDtm,
      setEndDtm:                s.actions.setEndDtm,
      setStartTime:             s.actions.setStartTime,
      setEndTime:               s.actions.setEndTime,
      setSelectContentFileList: s.actions.setSelectContentFileList,
    })),
  );

  const [isDisabled, setIsDisabled] = useState(false);

  useEffect(() => {
    setIsDisabled(
      !titleOpt || !selectScOpt.length || !selectDay ||
      !startDtm || !endDtm || !startTime || !endTime || !selectContentFileList.length,
    );
  }, [titleOpt, selectScOpt, selectDay, startDtm, endDtm, startTime, endTime, selectContentFileList]);

  const buildSchedules = (): ScheItem[] => {
    const dayEn = DAY_EN[selectDay] ?? 'Everyday';
    const dates = getDatesBetween(startDtm, endDtm, dayEn);
    const colorIdx = Math.floor(Math.random() * 5) + 1;
    return dates.map((date) => ({
      contentId:    '',
      contentTitle: titleOpt,
      startDtm:     date,
      endDtm:       date,
      repeatDate:   dayEn,
      contentArea:  selectScOpt.map((i) => i.split('/')[0]).join(','),
      contentFile:  selectContentFileList.map((i) => i.fileId).join(','),
      contentType:  SCHE_RESULT_TYPE.CONTENT,
      contentCntn:  '',
      backImage:    '',
      expireTime:   '',
      colorType:    SCHE_COLOR_TYPE.CONTENT + colorIdx,
      startTime:    startTime.split(':')[0].trim(),
      endTime:      endTime.split(':')[0].trim(),
      contentGrpId: '',
      outbDtm:      moment().format('YYYYMMDDHHmmss'),
      expireDtm:    '',
      editorType:   userInfo?.userType ?? '',
    }));
  };

  const reset = () => {
    setTitleOpt('');
    setSelectScOpt([]);
    setSelectDay('매일');
    setStartDtm(moment().format('YYYYMMDD'));
    setEndDtm(moment().format('YYYYMMDD'));
    setStartTime(moment().format('HH'));
    setEndTime(moment().add(1, 'hours').format('HH'));
    setSelectContentFileList([]);
  };

  const saveScheMutation = useMutation(saveSchedule, {
    onSuccess: (res) => {
      const data = res.data;
      if (data === SCHE_SAVE_RESULT.SUCCESS) {
        setScheToast(SCHE_TOAST_TYPE.SAVE_SUCCESS);
        reset();
        setRequestState('all');
      } else if (data === SCHE_SAVE_RESULT.DUPLICATE) {
        setScheToast(SCHE_TOAST_TYPE.DUPLICATE);
      } else {
        setScheToast(SCHE_TOAST_TYPE.SAVE_FAILED);
      }
    },
    onError: () => setScheToast(SCHE_TOAST_TYPE.SAVE_FAILED),
  });

  return (
    <StyledSaveBtn disabled={isDisabled} onClick={() => saveScheMutation.mutate(buildSchedules())}>
      <i /><span>저장</span>
    </StyledSaveBtn>
  );
};

export default SaveBtn;

const StyledSaveBtn = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 424px;
  height: 36px;
  border-radius: 18px;
  background-color: rgb(122, 69, 255);
  color: #fff;
  cursor: pointer;
  &:disabled { pointer-events: none; opacity: 0.33; }
  i {
    display: inline-block;
    width: 18px; height: 18px;
    margin-right: 6px;
    background: url('${SCHE_IMAGE.BOARD.BTN.SAVE}') no-repeat center / 100%;
  }
`;
