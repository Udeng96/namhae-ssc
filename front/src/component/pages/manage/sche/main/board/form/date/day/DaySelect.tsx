import styled from 'styled-components';
import { CommonScheSelectBox } from '@/component/lib/css';
import SelectBox from '@/component/pages/manage/sche/main/board/form/select/SelectBox';
import { useEffect, useState } from 'react';
import moment from 'moment';
import 'moment/locale/ko';
import { useScheStore } from '@/component/stores/scheStore';

moment.locale('ko');

const DAY_KR: Record<string, string> = {
  Monday: '월요일', Tuesday: '화요일', Wednesday: '수요일',
  Thursday: '목요일', Friday: '금요일', Saturday: '토요일', Sunday: '일요일',
};

const DaySelect = () => {
  const selectDay = useScheStore((s) => s.selectDay);
  const [dayOpen, setDayOpen] = useState(false);
  const [days, setDays] = useState<string[]>([]);

  useEffect(() => {
    const list = ['매일'];
    for (let i = 1; i <= 7; i++) {
      list.push(DAY_KR[moment().isoWeekday(i).format('dddd')] ?? '');
    }
    setDays(list);
  }, []);

  return (
    <StyledDaySelect $isOpen={false}>
      <SelectBox
        type="day"
        isOpen={dayOpen}
        setIsOpen={setDayOpen}
        width="136px"
        value={selectDay}
        optionList={days}
      />
    </StyledDaySelect>
  );
};

export default DaySelect;

const StyledDaySelect = styled.div<{ $isOpen: boolean }>`
  ${CommonScheSelectBox};
`;
