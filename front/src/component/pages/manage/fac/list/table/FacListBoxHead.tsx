import styled from 'styled-components';
import { useShallow } from 'zustand/react/shallow';
import { FAC_IMAGE } from '@/component/lib/facImage';
import { useFacStore } from '@/component/stores/facStore';
import { FAC_SORT } from '@/component/constants/facConst';

const FacListBoxHead = () => {
  const { param, setParam, incrementSearchVersion } = useFacStore(
    useShallow((state) => ({
      param:                  state.param,
      setParam:               state.actions.setParam,
      incrementSearchVersion: state.actions.incrementSearchVersion,
    })),
  );

  const handleSort = () => {
    let nextSort: string;
    if (param.sortType === FAC_SORT.NONE) {
      nextSort = FAC_SORT.NORM;
    } else if (param.sortType === FAC_SORT.NORM) {
      nextSort = FAC_SORT.ERROR;
    } else {
      nextSort = FAC_SORT.NONE;
    }
    setParam({ sortType: nextSort });
    incrementSearchVersion();
  };

  return (
    <StyledHead>
      <StyledRow>
        <StyledItem>경로당 이름</StyledItem>
        <StyledItem>읍면동</StyledItem>
        <StyledItem>법정리</StyledItem>
        <StyledItem>위치</StyledItem>
        <StyledItem onClick={handleSort}>상태</StyledItem>
      </StyledRow>
    </StyledHead>
  );
};

export default FacListBoxHead;

const StyledHead = styled.div`
  margin-top: 8px;
  margin-bottom: 4px;
  color: #a8afbd;
`;

const StyledRow = styled.ul`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 6px;
`;

const StyledItem = styled.li`
  display: flex;
  height: 29px;
  padding: 0 6px;
  line-height: 29px;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  font-size: 13px;

  &:nth-child(1) { width: 124px; }
  &:nth-child(2) { width: 70px; }
  &:nth-child(3) { width: 70px; justify-content: center; }
  &:nth-child(4) { width: 110px; }
  &:nth-child(5) {
    width: 68px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 4px;
    cursor: pointer;
    &:hover { color: #a07aff; }
    &:after {
      content: '';
      display: flex;
      align-items: center;
      justify-content: center;
      width: 9px;
      height: 9px;
      background: url('${FAC_IMAGE.CONTENT.SORT}') no-repeat center / 100%;
    }
  }
`;
