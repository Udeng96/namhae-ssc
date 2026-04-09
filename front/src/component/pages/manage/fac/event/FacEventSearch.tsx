import styled from 'styled-components';
import { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import { useQuery } from '@tanstack/react-query';
import { useShallow } from 'zustand/react/shallow';
import { EVENT_IMAGE } from '@/component/lib/eventImage';
import { useFacStore } from '@/component/stores/facStore';
import { fetchTodayStatusEventList } from '@/component/api/eventApi';

const FacEventSearch = () => {
  const {
    selectFac,
    eventStartDtm,
    eventEndDtm,
    setEventStartDtm,
    setEventEndDtm,
    setFacEventList,
  } = useFacStore(
    useShallow((state) => ({
      selectFac:        state.selectFac,
      eventStartDtm:    state.eventStartDtm,
      eventEndDtm:      state.eventEndDtm,
      setEventStartDtm: state.actions.setEventStartDtm,
      setEventEndDtm:   state.actions.setEventEndDtm,
      setFacEventList:  state.actions.setFacEventList,
    })),
  );

  const [request, setRequest] = useState(false);

  const { data: statusEvent } = useQuery({
    queryKey: ['facEvent', selectFac?.mgtNo, eventStartDtm, eventEndDtm],
    queryFn: () =>
      fetchTodayStatusEventList({
        mgtNo: selectFac!.mgtNo,
        startDtm: eventStartDtm,
        endDtm: eventEndDtm,
      }),
    enabled: request && !!selectFac,
    staleTime: Infinity,
  });

  useEffect(() => {
    if (statusEvent?.data) {
      setFacEventList(statusEvent.data);
    } else if (statusEvent !== undefined) {
      setFacEventList([]);
    }
    setRequest(false);
  }, [statusEvent]);

  return (
    <StyledBox>
      <StyledDateRow>
        <StyledDateBox>
          <DatePicker
            dateFormat="yyyy-MM-dd"
            selected={moment(eventStartDtm, 'YYYYMMDD').toDate()}
            maxDate={moment(eventEndDtm, 'YYYYMMDD').toDate()}
            onChange={(e) => setEventStartDtm(moment(e).format('YYYYMMDD'))}
            onKeyDown={(e) => e.preventDefault()}
            selectsStart
            startDate={moment(eventStartDtm, 'YYYYMMDD').toDate()}
            endDate={moment(eventEndDtm, 'YYYYMMDD').toDate()}
          />
        </StyledDateBox>
        <span>~</span>
        <StyledDateBox>
          <DatePicker
            dateFormat="yyyy-MM-dd"
            selected={moment(eventEndDtm, 'YYYYMMDD').toDate()}
            maxDate={moment().toDate()}
            onChange={(e) => setEventEndDtm(moment(e).format('YYYYMMDD'))}
            onKeyDown={(e) => e.preventDefault()}
            selectsEnd
            startDate={moment(eventStartDtm, 'YYYYMMDD').toDate()}
            endDate={moment(eventEndDtm, 'YYYYMMDD').toDate()}
          />
        </StyledDateBox>
        <StyledSearchBtn onClick={() => setRequest(true)}>
          <i />검색
        </StyledSearchBtn>
      </StyledDateRow>
    </StyledBox>
  );
};

export default FacEventSearch;

const StyledBox = styled.div`
  padding: 0 24px;
`;

const StyledDateRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 6px;
  margin-bottom: 4px;
  padding: 11px 0;
  border: solid 1px #2a2e54;
  border-left: none;
  border-right: none;
  span { font-size: 20px; color: #bcbfcc; }
`;

const StyledDateBox = styled.div`
  display: inline-block;
  position: relative;
  width: 154px;
  height: 36px;
  border-radius: 6px;
`;

const StyledSearchBtn = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 86px;
  height: 36px;
  margin-left: 9px;
  border-radius: 18px;
  border: 1px solid #7c6efc;
  background: linear-gradient(180deg, #7f7aff 0%, #681ceb 100%);
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  &:hover {
    border-color: #a69df9;
    background: linear-gradient(180deg, #8985ff 0%, #7d36f7 100%);
  }
  i {
    display: inline-block;
    width: 16px;
    height: 16px;
    margin-right: 3px;
    background-size: 100%;
    background-image: url('${EVENT_IMAGE.CONTENT.SEARCH.BTN}');
  }
`;
