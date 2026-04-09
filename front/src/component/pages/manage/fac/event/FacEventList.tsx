import styled from 'styled-components';
import { useShallow } from 'zustand/react/shallow';
import { useFacStore } from '@/component/stores/facStore';
import FacEventNone from './FacEventNone';
import FacEventDefault from './FacEventDefault';

const FacEventList = () => {
  const { selectFac, facEventList } = useFacStore(
    useShallow((state) => ({
      selectFac:    state.selectFac,
      facEventList: state.facEventList,
    })),
  );

  return (
    <StyledBox>
      <StyledHead>
        <StyledItem>시설물</StyledItem>
        <StyledItem>이벤트 구분</StyledItem>
        <StyledItem>발생 시간</StyledItem>
        <StyledItem>해제 시간</StyledItem>
      </StyledHead>
      <StyledBody>
        {facEventList.length === 0 && <FacEventNone />}
        {selectFac && facEventList.length > 0 && (
          <FacEventDefault list={facEventList} />
        )}
      </StyledBody>
    </StyledBox>
  );
};

export default FacEventList;

const StyledBox = styled.div`
  padding: 0 12px 0 24px;
`;

const StyledHead = styled.ul`
  padding: 0 8px;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  margin-top: 8px;
  margin-bottom: 4px;
  color: #a8afbd;
`;

const StyledItem = styled.li`
  height: 24px;
  padding: 0 6px;
  font-size: 13px;
  line-height: 24px;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  display: flex;
  justify-content: center;

  &:nth-child(1) { width: 72px; }
  &:nth-child(2) { width: 74px; }
  &:nth-child(3) { width: 160px; justify-content: flex-start; }
  &:nth-child(4) { width: 124px; justify-content: flex-start; }
`;

const StyledBody = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;
