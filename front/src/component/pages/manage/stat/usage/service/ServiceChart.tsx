import styled from 'styled-components';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { useStatStore } from '@/component/stores/statStore';

const ServiceChart = () => {
  const { startDtm, endDtm, usageResult } = useStatStore(
    useShallow((s) => ({ startDtm: s.startDtm, endDtm: s.endDtm, usageResult: s.usageResult })),
  );
  const usageService = usageResult?.serviceUsage ?? [];

  const [total, setTotal] = useState(0);

  useEffect(() => {
    setTotal(usageService.length === 0 ? 0 : usageService.reduce((acc, cur) => acc + cur.count, 0));
  }, [usageService]);

  return (
    <StyledServiceChart>
      <StyledTotal>
        <p>전체</p>
        <strong>{total.toLocaleString()}</strong>
        <span>{`${moment(startDtm, 'YYYYMMDD').format('YYYY년MM월DD일')}~ ${moment(endDtm, 'YYYYMMDD').format('YYYY년MM월DD일')} 기준`}</span>
      </StyledTotal>
      <StyledList>
        {usageService.map((item, index) => (
          <StyledItem key={index}>
            <StyledNm>{item.key}</StyledNm>
            <StyledVal>{item.count}</StyledVal>
          </StyledItem>
        ))}
      </StyledList>
    </StyledServiceChart>
  );
};

export default ServiceChart;

const StyledServiceChart = styled.div`
  display: flex;
`;

const StyledTotal = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
  margin-right: 10px;

  p { font-size: 15px; font-weight: 400; color: #9c9eb5; }

  strong {
    font-size: 40px;
    font-weight: 600;
    background: linear-gradient(180deg, #f8f9fe 11.46%, #c4c5c9 100%);
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  span { margin-top: 2px; text-align: right; font-size: 11px; color: #9c9eb5; }
`;

const StyledList = styled.ul`
  width: 214px;
  list-style: none;
`;

const StyledItem = styled.li`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 48px;
  padding: 9px 0;
  border-bottom: solid 1px #3a3d59;

  &:nth-child(2) div::before { border-color: #ff6b6b; }
  &:nth-child(3) div::before { border-color: #4ecdc4; }
`;

const StyledNm = styled.div`
  display: flex;
  align-items: center;
  font-size: 13px;
  line-height: 14px;
  color: #c4c6dd;

  &::before {
    content: '';
    display: block;
    width: 8px;
    height: 8px;
    margin-right: 8px;
    border-radius: 999px;
    border: 2px solid #ffe66d;
  }
`;

const StyledVal = styled.div`
  width: 80px;
  font-size: 20px;
  font-weight: 600;
  color: #f5f5f5;
  text-align: right;
`;
