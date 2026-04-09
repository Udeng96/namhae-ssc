import styled from 'styled-components';
import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useShallow } from 'zustand/react/shallow';
import { useEventStore } from '@/component/stores/eventStore';
import { fetchLastEventList } from '@/component/api/eventApi';
import { WHOLE_OPTION } from '@/component/constants/eventCode';
import LastSearchArea from './search/LastSearchArea';
import LastEventResult from './LastEventResult';

// 필터 opts → API 파라미터 문자열
const optsToParam = (opts: string[]) =>
  opts.filter((o) => o !== WHOLE_OPTION).map((o) => o.split('/')[1]).join(',') ||
  WHOLE_OPTION.split('/')[1];

const LastEventBody = () => {
  const { setLastEventList, setLastTotalCnt, setLastTotalPage, setIsLastReload } =
    useEventStore(
      useShallow((state) => ({
        setLastEventList:   state.actions.setLastEventList,
        setLastTotalCnt:    state.actions.setLastTotalCnt,
        setLastTotalPage:   state.actions.setLastTotalPage,
        setIsLastReload:    state.actions.setIsLastReload,
      })),
    );

  const { data, isFetching, isError, refetch } = useQuery({
    queryKey: ['events', 'last'],
    // useEventStore.getState() 로 항상 최신 값 참조
    // → 페이지 클릭 직후 refetch() 해도 stale closure 문제 없음
    queryFn: () => {
      const { lastFilter: lf, lastParam: lp } = useEventStore.getState();
      return fetchLastEventList({
        znCd:       optsToParam(lf.areaOpts),
        statEvetCd: optsToParam(lf.typeOpts),
        startDtm:   lp.startDtm,
        endDtm:     lp.endDtm,
        pageNumber: lp.pageNumber,
      });
    },
    enabled: false,
  });

  // 검색 결과 스토어에 반영
  useEffect(() => {
    if (!data) return;
    const result = data.data;
    setLastEventList(result.eventList);
    setLastTotalCnt(result.totalCnt);
    setLastTotalPage(result.totalPage);
  }, [data]);

  const handleSearch = () => {
    setIsLastReload(false);
    refetch();
  };

  return (
    <StyledBody>
      <StyledSearch>
        <LastSearchArea onSearch={handleSearch} isFetching={isFetching} />
      </StyledSearch>
      <LastEventResult
        onReload={() => { setIsLastReload(true); refetch(); }}
        onPageChange={refetch}
        isError={isError}
      />
    </StyledBody>
  );
};

export default LastEventBody;

const StyledBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px 0;
  height: 820px;
  padding: 22px 23px 25px 23px;
  border-radius: 0 0 20px 20px;
  border: 1px solid #1a203a;
  background: #12172e;
`;

const StyledSearch = styled.div`
  height: 226px;
  padding: 20px 29px 22px;
  border-radius: 10px;
  border: 1px solid #2a2e54;
  background: #1a203a;
`;
