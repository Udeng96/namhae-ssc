import styled from 'styled-components';
import { useEffect, useState } from 'react';
import { useShallow } from 'zustand/react/shallow';
import moment from 'moment';
import { useEventStore } from '@/component/stores/eventStore';

const EventSearchResult = () => {
  const { totalCnt, eventList } = useEventStore(
    useShallow((state) => ({
      totalCnt: state.totalCnt,
      eventList: state.eventList,
    })),
  );

  const [updateDtm, setUpdateDtm] = useState(moment().format('YYYY-MM-DD HH:mm:ss'));

  // 목록이 바뀔 때마다 갱신 시각 업데이트
  useEffect(() => {
    if (eventList.length > 0) {
      setUpdateDtm(moment().format('YYYY-MM-DD HH:mm:ss'));
    }
  }, [eventList]);

  return (
    <StyledResult>
      <StyledBox>
        <StyledCnt>
          검색 결과<span>{`[${totalCnt}]`}</span>
        </StyledCnt>
        <StyledDtm>Update : {updateDtm}</StyledDtm>
      </StyledBox>
    </StyledResult>
  );
};

export default EventSearchResult;

const StyledResult = styled.div`
  padding: 0 32px;
`;

const StyledBox = styled.div`
  display: flex;
  align-items: center;
  padding: 14px 5px 14px 16px;
  border: solid 1px #2a2e54;
  border-left: none;
  border-right: none;
`;

const StyledCnt = styled.div`
  color: #fff;
  font-size: 13px;

  span {
    color: #fff;
    font-size: 13px;
  }
`;

const StyledDtm = styled.div`
  margin-left: auto;
  font-size: 11px;
  font-weight: 300;
  color: #a8afbd;
`;
