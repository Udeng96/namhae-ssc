import styled from 'styled-components';
import { useShallow }   from 'zustand/react/shallow';
import { useMutation }  from '@tanstack/react-query';
import moment           from 'moment';
import { useCommonStore } from '@/component/stores/commonStore';
import { useScheStore }   from '@/component/stores/scheStore';
import { editSchedule }   from '@/component/api/scheApi';
import {
  SCHE_COLOR_TYPE, SCHE_MODAL_TYPE, SCHE_RESULT_TYPE,
  SCHE_SAVE_RESULT, SCHE_TOAST_TYPE, SCHE_TYPE,
} from '@/component/constants/scheConst';
import { ScheItem } from '@/component/types/sche';

// ─── 유틸 ─────────────────────────────────────────────
const DAY_EN: Record<string, string> = {
  '월요일': 'Monday', '화요일': 'Tuesday', '수요일': 'Wednesday',
  '목요일': 'Thursday', '금요일': 'Friday', '토요일': 'Saturday',
  '일요일': 'Sunday', '매일': 'Everyday',
};

const getDatesBetween = (start: string, end: string, day: string): string[] => {
  const dates: string[] = [];
  let curr = moment(start, 'YYYYMMDD');
  const last = moment(end, 'YYYYMMDD');
  while (curr.isSameOrBefore(last)) {
    const dayEn = day === 'Everyday' || day === '' ? 'Everyday' : day;
    if (dayEn === 'Everyday' || curr.format('dddd') === dayEn) {
      dates.push(curr.format('YYYYMMDD'));
    }
    curr.add(1, 'days');
  }
  return dates;
};

const EditFoot = () => {
  const setModal = useCommonStore((s) => s.actions.setModal);

  const {
    activeSche, activeType,
    selectWideBack, selectNarrowBack,
    titleOpt, selectScOpt,
    startDtm, endDtm, startTime, endTime,
    selectContent, selectDay, selectContentFileList,
    setScheToast, setActiveSche, setRequestState,
  } = useScheStore(
    useShallow((s) => ({
      activeSche:            s.activeSche,
      activeType:            s.activeType,
      selectWideBack:        s.selectWideBack,
      selectNarrowBack:      s.selectNarrowBack,
      titleOpt:              s.titleOpt,
      selectScOpt:           s.selectScOpt,
      startDtm:              s.startDtm,
      endDtm:                s.endDtm,
      startTime:             s.startTime,
      endTime:               s.endTime,
      selectContent:         s.selectContent,
      selectDay:             s.selectDay,
      selectContentFileList: s.selectContentFileList,
      setScheToast:          s.actions.setScheToast,
      setActiveSche:         s.actions.setActiveSche,
      setRequestState:       s.actions.setRequestState,
    })),
  );

  const buildContent = (): ScheItem[] => {
    const colorIndex = Math.floor(Math.random() * 5) + 1;
    const dayEn      = DAY_EN[selectDay] ?? 'Everyday';
    return getDatesBetween(startDtm, endDtm, dayEn).map((date) => ({
      contentId:    '',
      contentTitle: titleOpt,
      startDtm:     date,
      endDtm:       date,
      repeatDate:   dayEn,
      contentArea:  selectScOpt.map((v) => v.split('/')[0]).join(','),
      contentFile:  selectContentFileList.map((f) => f.fileId).join(','),
      contentType:  SCHE_RESULT_TYPE.CONTENT,
      contentCntn:  '',
      backImage:    '',
      expireTime:   '',
      colorType:    `${SCHE_COLOR_TYPE.CONTENT}${colorIndex}`,
      startTime:    startTime.split(':')[0].trim(),
      endTime:      endTime.split(':')[0].trim(),
      contentGrpId: activeSche!.contentGrpId,
      outbDtm:      moment().format('YYYYMMDDHHmmss'),
      expireDtm:    '',
      editorType:   activeSche!.editorType,
    }));
  };

  const buildNorm = (): ScheItem[] => {
    const wideBk   = selectWideBack   ? `${selectWideBack.fileId},`   : 'none,';
    const narrowBk = selectNarrowBack ? selectNarrowBack.fileId        : 'none';
    return getDatesBetween(startDtm, endDtm, 'Everyday').map((date) => ({
      contentId:    '',
      contentTitle: titleOpt,
      startDtm:     date,
      endDtm:       date,
      repeatDate:   '',
      contentArea:  selectScOpt.map((v) => v.split('/')[0]).join(','),
      contentFile:  '',
      contentType:  SCHE_RESULT_TYPE.NORM,
      contentCntn:  selectContent,
      backImage:    wideBk + narrowBk,
      expireTime:   '',
      colorType:    SCHE_COLOR_TYPE.NORM,
      startTime:    startTime.split(':')[0].trim(),
      endTime:      endTime.split(':')[0].trim(),
      contentGrpId: activeSche!.contentGrpId,
      outbDtm:      moment().format('YYYYMMDDHHmmss'),
      expireDtm:    '',
      editorType:   activeSche!.editorType,
    }));
  };

  const editMutation = useMutation(
    async (items: ScheItem[]) => {
      const res = await editSchedule(items);
      return res.data;
    },
    {
      onSuccess: (data) => {
        if (data === SCHE_SAVE_RESULT.SUCCESS) {
          setScheToast(SCHE_TOAST_TYPE.EDIT_SUCCESS);
          setActiveSche(null);
          setRequestState('all');
        } else if (data === SCHE_SAVE_RESULT.DUPLICATE) {
          setScheToast(SCHE_TOAST_TYPE.DUPLICATE);
        } else {
          setScheToast(SCHE_TOAST_TYPE.EDIT_FAILED);
        }
        setModal(SCHE_MODAL_TYPE.NONE);
      },
    },
  );

  const handleEdit = () => {
    const items = activeType === SCHE_TYPE.CONTENT ? buildContent() : buildNorm();
    editMutation.mutate(items);
  };

  return (
    <StyledFoot>
      <StyledClsBtn onClick={() => setModal(SCHE_MODAL_TYPE.NONE)}>취소</StyledClsBtn>
      <StyledEditBtn onClick={handleEdit}>수정</StyledEditBtn>
    </StyledFoot>
  );
};

export default EditFoot;

const StyledFoot = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 0 8px;
  padding: 16px 32px 24px;
`;

const btnBase = `
  display: flex; align-items: center; justify-content: center;
  width: 86px; height: 34px; font-size: 13px; font-weight: 500;
  border-radius: 6px; cursor: pointer;
`;

const StyledClsBtn = styled.button`
  ${btnBase}
  color: #A8AFBD; border: 1px solid #2A2E54; background: #0F1223;
  &:hover { color: #FFF; border-color: #3E4165; background: #1A203A; }
`;

const StyledEditBtn = styled.button`
  ${btnBase}
  color: #FFF; border: transparent; background: rgb(224,165,63);
  &:hover { background: #FF7373; box-shadow: 0 10px 12px rgba(122,69,255,.24); }
  &:disabled { background: #32236B; color: #8C84AC; pointer-events: none; }
`;
