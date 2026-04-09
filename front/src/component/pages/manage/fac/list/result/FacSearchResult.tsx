import styled from 'styled-components';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { useIsFetching } from '@tanstack/react-query';
import { useFacStore } from '@/component/stores/facStore';

const FacSearchResult = () => {
  const facList = useFacStore((state) => state.facList);
  const isFetching = useIsFetching({ queryKey: ['facList'] }) > 0;
  const [updateDtm, setUpdateDtm] = useState(moment().format('YYYY-MM-DD HH:mm:ss'));

  useEffect(() => {
    if (!isFetching) setUpdateDtm(moment().format('YYYY-MM-DD HH:mm:ss'));
  }, [isFetching]);

  return (
    <StyledBox>
      <StyledInner>
        <StyledCnt>검색 결과<span>{`[${facList.length}]`}</span></StyledCnt>
        <StyledDtm>Update : {updateDtm}</StyledDtm>
      </StyledInner>
    </StyledBox>
  );
};

export default FacSearchResult;

const StyledBox = styled.div`
  padding: 0 32px;
`;

const StyledInner = styled.div`
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
  span { color: #fff; font-size: 13px; }
`;

const StyledDtm = styled.div`
  margin-left: auto;
  font-size: 11px;
  font-weight: 300;
  color: #a8afbd;
`;
