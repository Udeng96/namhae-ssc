import styled from 'styled-components';
import { useShallow } from 'zustand/react/shallow';
import { CommonSearchBtn } from '@/component/lib/css';
import { useEventStore } from '@/component/stores/eventStore';
import LastSearchDate from './LastSearchDate';
import LastSearchBox from './LastSearchBox';

interface Props {
  onSearch: () => void;
  isFetching: boolean;
}

const TOAST = {
  NO_AREA: 'last_no_area',
  NO_TYPE: 'last_no_type',
} as const;

const LastSearchArea = ({ onSearch, isFetching }: Props) => {
  const { lastFilter, setLastParam, setLastSelectEvent, setToastKey } = useEventStore(
    useShallow((state) => ({
      lastFilter:         state.lastFilter,
      setLastParam:       state.actions.setLastParam,
      setLastSelectEvent: state.actions.setLastSelectEvent,
      setToastKey:        state.actions.setToastKey,
    })),
  );

  const handleSearch = () => {
    if (lastFilter.areaOpts.length === 0) {
      setToastKey(TOAST.NO_AREA);
      return;
    }
    if (lastFilter.typeOpts.length === 0) {
      setToastKey(TOAST.NO_TYPE);
      return;
    }
    setLastParam({ pageNumber: 1 });
    setLastSelectEvent(null);
    onSearch();
  };

  return (
    <>
      <StyledFields>
        <LastSearchDate />
        <LastSearchBox type="lastArea"  nm="경로당 지역" />
        <LastSearchBox type="lastEvent" nm="이벤트 유형" />
      </StyledFields>
      <StyledSearchBtn onClick={handleSearch} disabled={isFetching}>
        <i />
        {isFetching ? '검색 중...' : '검색'}
      </StyledSearchBtn>
    </>
  );
};

export default LastSearchArea;

const StyledFields = styled.div``;

const StyledSearchBtn = styled.button`
  ${CommonSearchBtn};
  &:disabled { opacity: 0.5; cursor: not-allowed; }
`;
