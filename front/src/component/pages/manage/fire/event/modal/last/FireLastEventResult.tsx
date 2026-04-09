import { useEffect, useState } from 'react';
import styled from 'styled-components';
import moment from 'moment';
import { useIsFetching } from '@tanstack/react-query';
import { useFireStore } from '@/component/stores/fireStore';
import FireLastEventList from './list/FireLastEventList';

interface Props {
  onReload: () => void;
  onPageChange: () => void;
  isError: boolean;
}

const FireLastEventResult = ({ onReload, onPageChange, isError }: Props) => {
  const isFetching   = useIsFetching({ queryKey: ['fire', 'events', 'last'] }) > 0;
  const lastTotalCnt = useFireStore((state) => state.lastTotalCnt);

  const [updateDtm, setUpdateDtm] = useState(moment().format('YYYY-MM-DD HH:mm:ss'));

  useEffect(() => {
    if (!isFetching) {
      setUpdateDtm(moment().format('YYYY-MM-DD HH:mm:ss'));
    }
  }, [isFetching]);

  return (
    <div>
      <StyledResult>
        <StyledResultInfo>
          <StyledResultInfoBox>
            <StyledResultCnt>검색 결과 [ {lastTotalCnt} ]</StyledResultCnt>
            <StyledResultDtm>Update : {updateDtm}</StyledResultDtm>
          </StyledResultInfoBox>
        </StyledResultInfo>
        <FireLastEventList onReload={onReload} onPageChange={onPageChange} isError={isError} />
      </StyledResult>
    </div>
  );
};

export default FireLastEventResult;

const StyledResult = styled.div`
  height: 532px;
  padding: 11px 29px 37px;
  border-radius: 10px;
  border: 1px solid #2a2e54;
  background: #1a203a;
`;

const StyledResultInfo = styled.div`
  margin-bottom: 11px;
  padding: 0;
`;

const StyledResultInfoBox = styled.div`
  display: flex;
  align-items: center;
  padding: 14px 5px 14px 16px;
  border-bottom: solid 1px #2a2e54;
  padding-top: 12px;
  padding-bottom: 12px;
`;

const StyledResultCnt = styled.div`
  color: #fff;
  font-size: 13px;
`;

const StyledResultDtm = styled.div`
  margin-left: auto;
  font-size: 11px;
  font-weight: 300;
  color: #a8afbd;
`;
