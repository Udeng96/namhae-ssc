import styled from 'styled-components';
import { useShallow } from 'zustand/react/shallow';
import { useEffect, useState } from 'react';
import moment from 'moment';
import { useIsFetching } from '@tanstack/react-query';
import { useFireStore } from '@/component/stores/fireStore';

const FireSearchResult = () => {
  const { eventList, totalCnt } = useFireStore(
    useShallow((state) => ({
      eventList: state.eventList,
      totalCnt:  state.totalCnt,
    })),
  );

  const isFetching = useIsFetching({ queryKey: ['fire', 'events', 'current'] }) > 0;

  const [updateDtm, setUpdateDtm] = useState<string>(
    moment().format('YYYY-MM-DD HH:mm:ss'),
  );

  useEffect(() => {
    if (!isFetching) {
      setUpdateDtm(moment().format('YYYY-MM-DD HH:mm:ss'));
    }
  }, [isFetching, eventList]);

  return (
    <StyledWrap>
      <StyledBox>
        <StyledCnt>
          검색 결과<span>{`[${totalCnt}]`}</span>
        </StyledCnt>
        <StyledDtm>Update : {updateDtm}</StyledDtm>
      </StyledBox>
    </StyledWrap>
  );
};

export default FireSearchResult;

const StyledWrap = styled.div`
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
