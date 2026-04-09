import styled from 'styled-components';
import { FAC_IMAGE } from '@/component/lib/facImage';
import { ScFacType } from '@/component/types/fac';

const setAddr = (addr: string) =>
  addr.includes('면') ? addr.split('면 ')[1] : addr;

const FacDefaultRow = ({ item }: { item: ScFacType }) => (
  <StyledRow>
    <StyledItem>{item.facNm}</StyledItem>
    <StyledItem>{item.topAreaName}</StyledItem>
    <StyledItem>{item.areaName}</StyledItem>
    <StyledItem>{setAddr(item.posNm)}</StyledItem>
    <StyledItem>
      {item.sc === '00' ? '정상' : <StyledWarnIcon />}
    </StyledItem>
  </StyledRow>
);

export default FacDefaultRow;

const StyledRow = styled.ul`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  height: 29px;
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
  &:nth-child(4) { width: 100px; display: inline-block; }
  &:nth-child(5) { width: 65px; color: #37c6ed; justify-content: center; align-items: center; }
`;

const StyledWarnIcon = styled.button`
  width: 22px;
  height: 22px;
  background: url('${FAC_IMAGE.CONTENT.WARN}') no-repeat center / 100%;
`;
