import styled from 'styled-components';
import {
  CommonFormBox, CommonFormBoxNm, CommonFormBoxVal, CommonFormBoxValDisabled,
} from '@/component/lib/css';
import DateSelect from '@/component/pages/manage/sche/main/board/form/date/date/DateSelect';
import TimeSelect from '@/component/pages/manage/sche/main/board/form/date/time/TimeSelect';
import DaySelect from '@/component/pages/manage/sche/main/board/form/date/day/DaySelect';
import { SCHE_MODE, SCHE_TYPE } from '@/component/constants/scheConst';
import { useScheStore } from '@/component/stores/scheStore';
import { useShallow } from 'zustand/react/shallow';
import { useEffect } from 'react';
import moment from 'moment';

const DAY_KR: Record<string, string> = {
  Monday: '월요일', Tuesday: '화요일', Wednesday: '수요일',
  Thursday: '목요일', Friday: '금요일', Saturday: '토요일', Sunday: '일요일',
};

interface Props {
  contentType: string;
}

const DateForm = ({ contentType }: Props) => {
  const {
    activeSche, scheMode, activeType,
    setStartDtm, setEndDtm, setStartTime, setEndTime, setSelectDay,
  } = useScheStore(
    useShallow((s) => ({
      activeSche:   s.activeSche,
      scheMode:     s.scheMode,
      activeType:   s.activeType,
      setStartDtm:  s.actions.setStartDtm,
      setEndDtm:    s.actions.setEndDtm,
      setStartTime: s.actions.setStartTime,
      setEndTime:   s.actions.setEndTime,
      setSelectDay: s.actions.setSelectDay,
    })),
  );

  useEffect(() => {
    if (activeSche) {
      setStartDtm(moment(activeSche.startDtm).format('YYYYMMDD'));
      setEndDtm(moment(activeSche.endDtm).format('YYYYMMDD'));
      if (activeType !== SCHE_TYPE.EMER) {
        setStartTime(activeSche.startTime);
        setEndTime(activeSche.endTime);
      }
      if (activeType === SCHE_TYPE.CONTENT) {
        setSelectDay(DAY_KR[activeSche.repeatDate] ?? '매일');
      }
    } else {
      setStartDtm(moment().format('YYYYMMDD'));
      setEndDtm(moment().format('YYYYMMDD'));
      setStartTime(moment().format('HH'));
      setEndTime(moment().add(1, 'hours').format('HH'));
      setSelectDay('매일');
    }
  }, [activeSche]);

  return (
    <StyledDateForm>
      <StyledDateFormNm>기간 설정*</StyledDateFormNm>
      <StyledDateFormVal>
        <StyledDateFormValBox>
          {scheMode === SCHE_MODE.READ && <StyledDisabled />}
          <DateSelect />
          {(contentType === SCHE_TYPE.NORM || contentType === SCHE_TYPE.CONTENT) && <TimeSelect />}
          {contentType === SCHE_TYPE.CONTENT && <DaySelect />}
        </StyledDateFormValBox>
      </StyledDateFormVal>
    </StyledDateForm>
  );
};

export default DateForm;

const StyledDateForm    = styled.div`${CommonFormBox}`;
const StyledDateFormNm  = styled.div`${CommonFormBoxNm}`;
const StyledDateFormVal = styled.div`${CommonFormBoxVal}`;
const StyledDisabled    = styled.div`${CommonFormBoxValDisabled}`;

const StyledDateFormValBox = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 8px 0;
  position: relative;
  width: 345px;
`;
