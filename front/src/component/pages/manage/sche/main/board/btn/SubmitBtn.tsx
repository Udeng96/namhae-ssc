import styled from 'styled-components';
import { SCHE_IMAGE } from '@/component/lib/scheImage';
import { useScheStore } from '@/component/stores/scheStore';
import { useShallow } from 'zustand/react/shallow';
import { useEffect, useState } from 'react';
import {
  SCHE_COLOR_TYPE, SCHE_EMER_BACK, SCHE_EMER_SHOW_TIME,
  SCHE_RESULT_TYPE, SCHE_SAVE_RESULT, SCHE_TOAST_TYPE, SCHE_TYPE,
} from '@/component/constants/scheConst';
import { ScheItem } from '@/component/types/sche';
import moment from 'moment';
import { useMutation } from '@tanstack/react-query';
import { saveSchedule } from '@/component/api/scheApi';
import { useCommonStore } from '@/component/stores/commonStore';

const getDatesBetween = (start: string, end: string): string[] => {
  const dates: string[] = [];
  const curr = moment(start, 'YYYYMMDD');
  const last = moment(end, 'YYYYMMDD');
  while (curr.isSameOrBefore(last)) {
    dates.push(curr.format('YYYYMMDD'));
    curr.add(1, 'days');
  }
  return dates;
};

const SubmitBtn = () => {
  const userInfo = useCommonStore((s) => s.userInfo);
  const {
    activeType, titleOpt, selectExpire, selectScOpt,
    startDtm, endDtm, startTime, endTime, selectContent,
    selectWideBack, selectNarrowBack, selectBack,
    setScheToast, setRequestState,
    setTitleOpt, setSelectScOpt, setStartDtm, setEndDtm,
    setStartTime, setEndTime, setSelectExpire, setSelectContent,
    setSelectWideBack, setSelectNarrowBack, setSelectBack,
  } = useScheStore(
    useShallow((s) => ({
      activeType:          s.activeType,
      titleOpt:            s.titleOpt,
      selectExpire:        s.selectExpire,
      selectScOpt:         s.selectScOpt,
      startDtm:            s.startDtm,
      endDtm:              s.endDtm,
      startTime:           s.startTime,
      endTime:             s.endTime,
      selectContent:       s.selectContent,
      selectWideBack:      s.selectWideBack,
      selectNarrowBack:    s.selectNarrowBack,
      selectBack:          s.selectBack,
      setScheToast:        s.actions.setScheToast,
      setRequestState:     s.actions.setRequestState,
      setTitleOpt:         s.actions.setTitleOpt,
      setSelectScOpt:      s.actions.setSelectScOpt,
      setStartDtm:         s.actions.setStartDtm,
      setEndDtm:           s.actions.setEndDtm,
      setStartTime:        s.actions.setStartTime,
      setEndTime:          s.actions.setEndTime,
      setSelectExpire:     s.actions.setSelectExpire,
      setSelectContent:    s.actions.setSelectContent,
      setSelectWideBack:   s.actions.setSelectWideBack,
      setSelectNarrowBack: s.actions.setSelectNarrowBack,
      setSelectBack:       s.actions.setSelectBack,
    })),
  );

  const [isDisabled, setIsDisabled] = useState(false);

  useEffect(() => {
    if (activeType === SCHE_TYPE.NORM) {
      setIsDisabled(!titleOpt || !selectScOpt.length || !startDtm || !endDtm || !startTime || !endTime || !selectContent);
    } else {
      setIsDisabled(!titleOpt || !selectExpire || !selectScOpt.length || !startDtm || !endDtm || !selectContent);
    }
  }, [titleOpt, activeType, selectExpire, selectScOpt, startDtm, endDtm, startTime, endTime, selectContent]);

  const buildNorms = (): ScheItem[] => {
    const dates = getDatesBetween(startDtm, endDtm);
    return dates.map((date) => ({
      contentId: '', contentTitle: titleOpt, startDtm: date, endDtm: date,
      repeatDate: '', contentArea: selectScOpt.map((i) => i.split('/')[0]).join(','),
      contentFile: '', contentType: SCHE_RESULT_TYPE.NORM, contentCntn: selectContent,
      backImage: (selectWideBack ? selectWideBack.fileId : 'none') + ',' + (selectNarrowBack ? selectNarrowBack.fileId : 'none'),
      expireTime: '', colorType: SCHE_COLOR_TYPE.NORM,
      startTime: startTime.split(':')[0].trim(), endTime: endTime.split(':')[0].trim(),
      contentGrpId: '', outbDtm: moment().format('YYYYMMDDHHmmss'), expireDtm: '',
      editorType: userInfo?.userType ?? '',
    }));
  };

  const buildEmers = (): ScheItem[] => {
    const dates = getDatesBetween(startDtm, endDtm);
    return dates.map((date) => ({
      contentId: '', contentTitle: titleOpt, startDtm: date, endDtm: date,
      repeatDate: '', contentArea: selectScOpt.map((i) => i.split('/')[0]).join(','),
      contentFile: '', contentType: SCHE_RESULT_TYPE.EMER, contentCntn: selectContent,
      backImage: selectBack, expireTime: selectExpire, colorType: SCHE_COLOR_TYPE.EMER,
      startTime: '', endTime: '',
      contentGrpId: '', outbDtm: moment().format('YYYYMMDDHHmmss'),
      expireDtm: moment().add(Number(selectExpire), 'seconds').format('YYYYMMDDHHmmss'),
      editorType: userInfo?.userType ?? '',
    }));
  };

  const resetNorm = () => {
    setTitleOpt(''); setSelectScOpt([]);
    setStartDtm(moment().format('YYYYMMDD')); setEndDtm(moment().format('YYYYMMDD'));
    setStartTime(moment().format('HH')); setEndTime(moment().add(1, 'hours').format('HH'));
    setSelectContent(''); setSelectWideBack(null); setSelectNarrowBack(null);
  };

  const resetEmer = () => {
    setTitleOpt(''); setSelectScOpt([]);
    setStartDtm(moment().format('YYYYMMDD')); setEndDtm(moment().format('YYYYMMDD'));
    setSelectContent(''); setSelectBack(SCHE_EMER_BACK[0].cd);
    setSelectExpire(SCHE_EMER_SHOW_TIME[0].cd);
  };

  const saveScheMutation = useMutation(saveSchedule, {
    onSuccess: (res) => {
      const data = res.data;
      if (data === SCHE_SAVE_RESULT.SUCCESS) {
        setScheToast(SCHE_TOAST_TYPE.SAVE_SUCCESS);
        activeType === SCHE_TYPE.NORM ? resetNorm() : resetEmer();
        setRequestState('all');
      } else {
        setScheToast(SCHE_TOAST_TYPE.SAVE_FAILED);
      }
    },
    onError: () => setScheToast(SCHE_TOAST_TYPE.SAVE_FAILED),
  });

  const handleSubmit = () => {
    saveScheMutation.mutate(activeType === SCHE_TYPE.NORM ? buildNorms() : buildEmers());
  };

  return (
    <StyledSubmitBtn disabled={isDisabled} onClick={handleSubmit}>
      <i /><span>전송</span>
    </StyledSubmitBtn>
  );
};

export default SubmitBtn;

const StyledSubmitBtn = styled.button`
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
    background: url('${SCHE_IMAGE.BOARD.BTN.SUBMIT}') no-repeat center / 100%;
  }
`;
