import styled from 'styled-components';
import { useEffect } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { useQuery } from '@tanstack/react-query';
import { EVENT_IMAGE } from '@/component/lib/eventImage';
import { useFireStore } from '@/component/stores/fireStore';
import { fetchFireEventList } from '@/component/api/fireApi';
import FireSearchArea from './FireSearchArea';

const optsToParam = (opts: string[], wholeCode: string) =>
  opts.includes('전체/all') ? wholeCode : opts.map((o) => o.split('/')[1]).join(',');

const TOAST = {
  NO_AREA: 'search_no_area',
  NO_TYPE: 'search_no_type',
} as const;

const FireSearch = () => {
  const {
    currentFilter,
    setEventList,
    setTotalCnt,
    setSelectEvent,
    setOpenDetailList,
    setNewEventList,
    setToastKey,
    setOpenOpt,
  } = useFireStore(
    useShallow((state) => ({
      currentFilter:    state.currentFilter,
      setEventList:     state.actions.setEventList,
      setTotalCnt:      state.actions.setTotalCnt,
      setSelectEvent:   state.actions.setSelectEvent,
      setOpenDetailList: state.actions.setOpenDetailList,
      setNewEventList:  state.actions.setNewEventList,
      setToastKey:      state.actions.setToastKey,
      setOpenOpt:       state.actions.setOpenOpt,
    })),
  );

  const { data, isFetching, refetch } = useQuery({
    queryKey: ['fire', 'events', 'current'],
    queryFn: () =>
      fetchFireEventList({
        znCd:       optsToParam(currentFilter.areaOpts, '400'),
        statEvetCd: '01',
        startDtm:   '',
        endDtm:     '',
        plcId:      '',
        pageNumber: 0,
      }),
    enabled:   currentFilter.areaOpts.length > 0,
    staleTime: Infinity,
  });

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
    refetch();
  };

  const handleLast = () => {
    setOpenOpt('last');
  };

  return (
    <StyledWrap>
      <StyledHead>
        <StyledTitle>
          <i />
          이벤트 검색 조건 설정
        </StyledTitle>
        <StyledLastBtn onClick={handleLast}>지난 이벤트 내역</StyledLastBtn>
      </StyledHead>
      <FireSearchArea onSearch={handleSearch} isFetching={isFetching} />
    </StyledWrap>
  );
};

export default FireSearch;

const StyledWrap = styled.div`
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
