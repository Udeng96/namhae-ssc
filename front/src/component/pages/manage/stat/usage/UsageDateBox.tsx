import { useState } from 'react';
import styled from 'styled-components';
import { useShallow } from 'zustand/react/shallow';
import moment from 'moment';
import DatePicker from 'react-datepicker';
import { STAT_IMAGE } from '@/component/lib/statImage';
import { STAT_PERIOD_LIST } from '@/component/constants/statConst';
import { useStatStore } from '@/component/stores/statStore';

const UsageDateBox = () => {
  const { startDtm, endDtm, setDates } = useStatStore(
    useShallow((s) => ({
      startDtm: s.startDtm,
      endDtm:   s.endDtm,
      setDates: s.actions.setDates,
    })),
  );

  const [pendingStart, setPendingStart] = useState(startDtm);
  const [pendingEnd, setPendingEnd]     = useState(endDtm);

  const handlePeriod = (period: (typeof STAT_PERIOD_LIST)[number]) => {
    setPendingStart(period.startDtm);
    setPendingEnd(period.endDtm);
  };

  const handleSearch = () => {
    setDates(pendingStart, pendingEnd);
  };

  return (
    <StyledDateBox>
      <h3>기간 설정</h3>

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

export default UsageDateBox;

const StyledDateBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 0 30px;
  height: 70px;
  padding: 17px 30px;
  border-bottom: 1px solid #222A47;

  h3 {
    display: flex;
    align-items: center;
    font-size: 16px;
    font-weight: 500;
    color: #F2F4FC;
    white-space: nowrap;

    &::before {
      content: '';
      display: block;
      width: 20px;
      height: 20px;
      margin-right: 6px;
      background: url(${STAT_IMAGE.CHART.TITLE}) no-repeat center / 100%;
    }
  }
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
    background: ${({ $isActive }) => ($isActive ? '#261E5D' : '#3E4165')};
  }
`;

const StyledDatePick = styled.div`
  display: flex;
  align-items: center;

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
  margin-left: 17px;
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
