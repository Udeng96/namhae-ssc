import styled from 'styled-components';
import { useIsFetching } from '@tanstack/react-query';
import { useShallow } from 'zustand/react/shallow';
import { useFireStore } from '@/component/stores/fireStore';
import FireLastEventSkeleton from './FireLastEventSkeleton';
import FireLastEventNone from './FireLastEventNone';
import FireLastEventError from './FireLastEventError';
import FireLastEventDefault from './FireLastEventDefault';
import FireLastEventPage from './FireLastEventPage';

interface Props {
  onReload: () => void;
  onPageChange: () => void;
  isError: boolean;
}

const FireLastEventLeft = ({ onReload, onPageChange, isError }: Props) => {
  const isFetching = useIsFetching({ queryKey: ['fire', 'events', 'last'] }) > 0;
  const { lastEventList, lastTotalCnt } = useFireStore(
    useShallow((state) => ({
      lastEventList: state.lastEventList,
      lastTotalCnt:  state.lastTotalCnt,
    })),
  );

  return (
    <StyledLeft>
      <StyledHeadRow>
        <StyledHeadItem>이벤트</StyledHeadItem>
        <StyledHeadItem>지역</StyledHeadItem>
        <StyledHeadItem>위치</StyledHeadItem>
        <StyledHeadItem>발생 일시</StyledHeadItem>
      </StyledHeadRow>

      {isFetching && <FireLastEventSkeleton />}

      {!isFetching && isError && <FireLastEventError onReload={onReload} />}
      {!isFetching && !isError && lastTotalCnt === 0 && lastEventList.length === 0 && (
        <FireLastEventNone />
      )}
      {!isFetching && !isError && lastEventList.length > 0 && (
        <>
          <FireLastEventDefault />
          <FireLastEventPage onPageChange={onPageChange} />
        </>
      )}
    </StyledLeft>
  );
};

export default FireLastEventLeft;

const StyledLeft = styled.div`
  width: 438px;
`;

const StyledHeadRow = styled.ul`
  margin-bottom: 5px;
  display: flex;
  align-items: center;
  padding: 0 8px;
`;

const StyledHeadItem = styled.li`
  height: 24px;
  padding: 0 6px;
  font-size: 13px;
  color: #a8afbd;
  line-height: 24px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  &:nth-child(1) { width: 70px; }
  &:nth-child(2) { width: 76px; }
  &:nth-child(3) { width: 138px; }
  &:nth-child(4) { width: 146px; }
`;
