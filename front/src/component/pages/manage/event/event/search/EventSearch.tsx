import styled from 'styled-components';
import { useEffect } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { useQuery } from '@tanstack/react-query';
import { EVENT_IMAGE } from '@/component/lib/eventImage';
import { useEventStore } from '@/component/stores/eventStore';
import { fetchMainEventList } from '@/component/api/eventApi';
import SearchArea from './SearchArea';

// 필터 옵션 배열 → API znCd/statEvetCd 문자열로 변환
// 전체/all 포함 시 wholeCode('400' or '00')만 반환
const optsToParam = (opts: string[], wholeCode: string) =>
  opts.includes('전체/all') ? wholeCode : opts.map((o) => o.split('/')[1]).join(',');

// TODO: 토스트 키 상수 별도 파일로 분리 예정
const TOAST = {
  NO_AREA: 'search_no_area',
  NO_TYPE: 'search_no_type',
} as const;

const EventSearch = () => {
  const {
    currentFilter,
    setEventList,
    setTotalCnt,
    setSelectEvent,
    setOpenDetailList,
    setNewEventList,
    setToastKey,
    setOpenOpt,
  } = useEventStore(
    useShallow((state) => ({
      currentFilter: state.currentFilter,
      setEventList: state.actions.setEventList,
      setTotalCnt: state.actions.setTotalCnt,
      setSelectEvent: state.actions.setSelectEvent,
      setOpenDetailList: state.actions.setOpenDetailList,
      setNewEventList: state.actions.setNewEventList,
      setToastKey: state.actions.setToastKey,
      setOpenOpt: state.actions.setOpenOpt,
    })),
  );

  // areaOpts가 채워진 후(useRoleInit initFilters 완료) 최초 1회 자동 조회
  // 이후 검색 버튼 클릭 시 refetch()로 수동 트리거
  const { data, isFetching, refetch } = useQuery({
    queryKey: ['events', 'current'],
    queryFn: () =>
      fetchMainEventList({
        znCd: optsToParam(currentFilter.areaOpts, '400'),
        statEvetCd: optsToParam(currentFilter.typeOpts, '00'),
        startDtm: '',
        endDtm: '',
        plcId: '',
      }),
    enabled: currentFilter.areaOpts.length > 0,
    staleTime: Infinity,
  });

  // 검색 결과 반영
  useEffect(() => {
    if (!data) return;
    const result = data.data;
    setEventList(result.eventList);
    setTotalCnt(result.totalCnt);
    setSelectEvent(result.eventList[0] ?? null);
    setOpenDetailList([]);
    setNewEventList([]);
  }, [data]);

  const handleSearch = () => {
    if (currentFilter.areaOpts.length === 0) {
      setToastKey(TOAST.NO_AREA);
      return;
    }
    if (currentFilter.typeOpts.length === 0) {
      setToastKey(TOAST.NO_TYPE);
      return;
    }
    refetch();
  };

  const handleLast = () => {
    setOpenOpt('last');
  };

  return (
    <StyledEventSearch>
      <StyledHead>
        <StyledTitle>
          <i />
          이벤트 검색 조건 설정
        </StyledTitle>
        <StyledLastBtn onClick={handleLast}>지난 이벤트 내역</StyledLastBtn>
      </StyledHead>
      <SearchArea onSearch={handleSearch} isFetching={isFetching} />
    </StyledEventSearch>
  );
};

export default EventSearch;

const StyledEventSearch = styled.div`
  padding: 0 32px 24px;
`;

const StyledHead = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 8px;
`;

const StyledTitle = styled.h3`
  display: flex;
  align-items: center;
  font-size: 15px;
  font-weight: 500;
  color: #f2f4fc;

  i {
    display: inline-block;
    width: 20px;
    height: 20px;
    margin-right: 6px;
    background-size: 100%;
    margin-top: -5px;
    background-image: url('${EVENT_IMAGE.CONTENT.SEARCH.ICON}');
  }
`;

const StyledLastBtn = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 125px;
  height: 35px;
  margin-left: auto;
  font-size: 13px;
  font-weight: 500;
  color: #f2f4fc;
  border-radius: 6px;
  background: #2a2e54;

  &:hover {
    background: #3e4165;
    cursor: pointer;
  }
`;
