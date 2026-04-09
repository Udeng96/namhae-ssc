import { useState } from 'react';
import styled from 'styled-components';
import { useShallow } from 'zustand/react/shallow';
import moment from 'moment';
import DatePicker from 'react-datepicker';
import { STAT_PERIOD_LIST } from '@/component/constants/statConst';
import { useStatStore } from '@/component/stores/statStore';

const DateBox = () => {
  const { startDtm, endDtm, setDates } = useStatStore(
    useShallow((s) => ({
      startDtm: s.startDtm,
      endDtm:   s.endDtm,
      setDates: s.actions.setDates,
    })),
  );

  // 검색 버튼 클릭 전까지는 pending 날짜로 UI 반영
  const [pendingStart, setPendingStart] = useState(startDtm);
  const [pendingEnd, setPendingEnd]     = useState(endDtm);

  const handlePeriod = (period: (typeof STAT_PERIOD_LIST)[number]) => {
    setPendingStart(period.startDtm);
    setPendingEnd(period.endDtm);
  };

  const handleSearch = () => {
    setDates(pendingStart, pendingEnd); // 날짜 직접 선택 후 명시적 조회
  };

  return (
    <StyledDateBox>
      <StyledDatePeriod>
        {STAT_PERIOD_LIST.map((period) => (
          <StyledDatePeriodItem
            key={period.cd}
            $isActive={pendingStart === period.startDtm && pendingEnd === period.endDtm}
            onClick={() => handlePeriod(period)}
          >
            {period.nm}
          </StyledDatePeriodItem>
        ))}
      </StyledDatePeriod>

      <StyledDatePick>
        <StyledDatePickBox>
          <DatePicker
            onChange={(e) => setPendingStart(moment(e).format('YYYYMMDD'))}
            dateFormat={'yyyy-MM-dd'}
            maxDate={moment(pendingEnd, 'YYYYMMDD').toDate()}
            wrapperClassName={'statDatePicker'}
            selected={moment(pendingStart, 'YYYYMMDD').toDate()}
            onKeyDown={(e) => e.preventDefault()}
            selectsStart
            startDate={moment(pendingStart, 'YYYYMMDD').toDate()}
            endDate={moment(pendingEnd, 'YYYYMMDD').toDate()}
          />
        </StyledDatePickBox>
        <span>~</span>
        <StyledDatePickBox>
          <DatePicker
            onChange={(e) => setPendingEnd(moment(e).format('YYYYMMDD'))}
            dateFormat={'yyyy-MM-dd'}
            minDate={moment(pendingStart, 'YYYYMMDD').toDate()}
            selected={moment(pendingEnd, 'YYYYMMDD').toDate()}
            onKeyDown={(e) => e.preventDefault()}
            selectsEnd
            wrapperClassName={'statDatePicker'}
            startDate={moment(pendingStart, 'YYYYMMDD').toDate()}
            endDate={moment(pendingEnd, 'YYYYMMDD').toDate()}
          />
        </StyledDatePickBox>
        <StyledSearchBtn onClick={handleSearch}>검색</StyledSearchBtn>
      </StyledDatePick>
    </StyledDateBox>
  );
};

export default DateBox;

const StyledDateBox = styled.div`
  border-radius: 12px;
  border: 1px solid #2A2E54;
  background: #1A203A;
  height: 128px;
  padding: 24px 28px 24px 24px;
`;

const StyledDatePeriod = styled.div`
  display: flex;
  align-items: center;
  gap: 0 4px;
`;

const StyledDatePeriodItem = styled.button<{ $isActive: boolean }>`
  width: 86px;
  height: 36px;
  font-size: 14px;
  font-weight: 500;
  color: ${({ $isActive }) => ($isActive ? '#B299FF' : '#BCBFCC')};
  border-radius: 6px;
  border: 1px solid ${({ $isActive }) => ($isActive ? '#7C6EFC' : '#3E4165')};
  background: ${({ $isActive }) => ($isActive ? '#261E5D' : '#2A2E54')};

  &:hover {
    color: ${({ $isActive }) => ($isActive ? '#B299FF' : '#FFF')};
    border-color: ${({ $isActive }) => ($isActive ? '#7C6EFC' : '#3E4165')};
    background: ${({ $isActive }) => ($isActive ? '#261E5D' : '#3E4165')};
  }
`;

const StyledDatePick = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  margin-top: 7px;

  span {
    margin: 0 8px;
    font-size: 20px;
    color: #BCBFCC;
  }
`;

const StyledDatePickBox = styled.div`
  display: inline-block;
  position: relative;
  width: 158px;
  height: 36px;
  border-radius: 6px;
`;

const StyledSearchBtn = styled.button`
  width: 84px;
  height: 36px;
  margin-left: auto;
  border-radius: 18px;
  border: 1px solid #7C6EFC;
  background: linear-gradient(180deg, #7F7AFF, #681CEB);
  font-size: 14px;
  font-weight: 500;
  color: #FFF;
  cursor: pointer;

  &:hover {
    border: 1px solid #A69DF9;
    background: linear-gradient(180deg, #8985FF, #7D36F7);
  }
`;
