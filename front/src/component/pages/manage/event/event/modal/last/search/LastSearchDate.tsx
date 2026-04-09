import styled from 'styled-components';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import { useShallow } from 'zustand/react/shallow';
import { useEventStore } from '@/component/stores/eventStore';
import { EVENT_PERIOD_LIST } from '@/component/constants/eventCode';

/**
 * 검색 기간 설정 행
 * - 원본 SaerchDateBox + SearchDate 구조를 통합
 * - 라벨 | [기간 버튼들 ─────────────────── 시작일 ~ 종료일] 으로 1열 유지
 */
const LastSearchDate = () => {
  const { lastParam, setLastParam } = useEventStore(
    useShallow((state) => ({
      lastParam:    state.lastParam,
      setLastParam: state.actions.setLastParam,
    })),
  );

  const { startDtm, endDtm } = lastParam;

  const handleStartDtm = (d: Date | null) => {
    if (d) setLastParam({ startDtm: moment(d).format('YYYYMMDD') });
  };

  const handleEndDtm = (d: Date | null) => {
    if (d) setLastParam({ endDtm: moment(d).format('YYYYMMDD') });
  };

  const handlePeriod = (period: { startDtm: string; endDtm: string }) => {
    setLastParam({ startDtm: period.startDtm, endDtm: period.endDtm });
  };

  return (
    <StyledRow>
      <StyledLabel>검색 기간 설정</StyledLabel>
      {/* flex 행: 기간 버튼 + 데이트픽커 나란히 */}
      <StyledValue>
        <StyledPeriod>
          {EVENT_PERIOD_LIST.map((period) => (
            <StyledPeriodBtn
              key={period.cd}
              $isActive={startDtm === period.startDtm && endDtm === period.endDtm}
              onClick={() => handlePeriod(period)}
            >
              {period.nm}
            </StyledPeriodBtn>
          ))}
        </StyledPeriod>
        <StyledDate>
          <StyledDateBox>
            <DatePicker
              wrapperClassName="event_modal"
              onChange={handleStartDtm}
              minDate={moment(startDtm, 'YYYYMMDD').toDate()}
              maxDate={moment(endDtm, 'YYYYMMDD').toDate()}
              selected={moment(startDtm, 'YYYYMMDD').toDate()}
              dateFormat="yyyy-MM-dd"
              onKeyDown={(e) => e.preventDefault()}
              selectsStart
              startDate={moment(startDtm, 'YYYYMMDD').toDate()}
              endDate={moment(endDtm, 'YYYYMMDD').toDate()}
            />
          </StyledDateBox>
          <span>~</span>
          <StyledDateBox>
            <DatePicker
              wrapperClassName="event_modal"
              onChange={handleEndDtm}
              minDate={moment(startDtm, 'YYYYMMDD').toDate()}
              maxDate={moment().toDate()}
              selected={moment(endDtm, 'YYYYMMDD').toDate()}
              dateFormat="yyyy-MM-dd"
              onKeyDown={(e) => e.preventDefault()}
              selectsEnd
              startDate={moment(startDtm, 'YYYYMMDD').toDate()}
              endDate={moment(endDtm, 'YYYYMMDD').toDate()}
            />
          </StyledDateBox>
        </StyledDate>
      </StyledValue>
    </StyledRow>
  );
};

export default LastSearchDate;

/* ─── 바깥 행: 라벨 + 값 나란히 ──────────────────────── */
const StyledRow = styled.div`
  display: flex;
  align-items: center;
  margin-top: 12px;
  margin-bottom: 7px;
`;

const StyledLabel = styled.div`
  width: calc(100% - 728px);
  font-size: 14px;
  color: #f2f4fc;
`;

/* 기간 버튼 + 데이트픽커를 가로로 나열 */
const StyledValue = styled.div`
  display: flex;
  align-items: center;
  gap: 0 26px;
  width: 728px;
`;

/* ─── 기간 버튼 그룹 ──────────────────────────────────── */
const StyledPeriod = styled.div`
  display: flex;
  align-items: center;
  gap: 0 5px;
`;

const StyledPeriodBtn = styled.button<{ $isActive: boolean }>`
  width: 65px;
  height: 36px;
  font-size: 14px;
  font-weight: 500;
  color: ${({ $isActive }) => ($isActive ? '#fff' : '#bcbfcc')};
  border-radius: 18px;
  border: 1px solid ${({ $isActive }) => ($isActive ? '#7c6efc' : '#3e4165')};
  background: ${({ $isActive }) =>
    $isActive ? 'linear-gradient(180deg,#7f7aff,#681ceb)' : '#2a2e54'};

  &:hover {
    color: #fff;
    background: ${({ $isActive }) =>
      $isActive ? 'linear-gradient(180deg,#8985ff,#7d36f7)' : '#3e4165'};
    border-color: ${({ $isActive }) => ($isActive ? '#a69df9' : '#3e4165')};
  }
`;

/* ─── 데이트픽커 ──────────────────────────────────────── */
const StyledDate = styled.div`
  display: flex;
  align-items: center;
  span { margin: 0 8px; font-size: 20px; color: #bcbfcc; }
`;

const StyledDateBox = styled.div`
  display: inline-block;
  position: relative;
  width: 164px;
  height: 36px;
  border-radius: 6px;
`;
