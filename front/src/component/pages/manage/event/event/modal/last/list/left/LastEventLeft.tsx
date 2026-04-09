import styled from 'styled-components';
import { useIsFetching } from '@tanstack/react-query';
import { useShallow } from 'zustand/react/shallow';
import { useEventStore } from '@/component/stores/eventStore';
import LastEventSkeleton from './LastEventSkeleton';
import LastEventNone from './LastEventNone';
import LastEventError from './LastEventError';
import LastEventDefault from './LastEventDefault';
import LastEventPage from './LastEventPage';

interface Props {
  onReload: () => void;
  onPageChange: () => void;
  isError: boolean;
}

const LastEventLeft = ({ onReload, onPageChange, isError }: Props) => {
  const isFetching = useIsFetching({ queryKey: ['events', 'last'] }) > 0;
  const { lastEventList, lastTotalCnt } = useEventStore(
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

      {isFetching && <LastEventSkeleton />}

      {!isFetching && isError  && <LastEventError onReload={onReload} />}
      {!isFetching && !isError && lastTotalCnt === 0  && lastEventList.length === 0 && <LastEventNone />}
      {!isFetching && !isError && lastEventList.length > 0 && (
        <>
          <LastEventDefault />
          <LastEventPage onPageChange={onPageChange} />
        </>
      )}
    </StyledLeft>
  );
};

export default LastEventLeft;

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
