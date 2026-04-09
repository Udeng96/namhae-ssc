import styled from 'styled-components';
import { STAT_IMAGE } from '@/component/lib/statImage';

const CntHead = () => (
  <StyledCntHead>
    <h3>전체 경로당 통계 현황</h3>
    <StyledCntReportBtn $isActive={false}>월간 보고서</StyledCntReportBtn>
  </StyledCntHead>
);

export default CntHead;

const StyledCntHead = styled.div`
  display: flex;
  width: 100%;
  height: 36px;
  align-items: center;
  justify-content: space-between;
  position: relative;

  h3 {
    font-size: 20px;
    font-weight: 600;
    margin-top: 3px;
  }
`;

const StyledCntReportBtn = styled.button<{ $isActive: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 118px;
  height: 36px;
  font-size: 14px;
  font-weight: 500;
  color: #BCBFCC;
  border-radius: 6px;
  border: 1px solid ${({ $isActive }) => ($isActive ? '#7A45FF' : '#242945')};
  background: ${({ $isActive }) => ($isActive ? '#252B46' : '#161A30')};
  cursor: pointer;

  &::before {
    content: '';
    display: block;
    width: 18px;
    height: 18px;
    margin-right: 6px;
    opacity: ${({ $isActive }) => ($isActive ? '1' : '0.6')};
    background: url(${STAT_IMAGE.CNT.REPORT.DOWN}) no-repeat;
  }

  &:hover {
    color: #FFF;
    border-color: #484D6B;
    background: #252A46;
  }
`;
