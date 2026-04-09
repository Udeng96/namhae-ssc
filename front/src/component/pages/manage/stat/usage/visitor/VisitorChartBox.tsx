import styled from 'styled-components';
import { useEffect, useState } from 'react';
import { useStatStore } from '@/component/stores/statStore';
import VisitorChart from './VisitorChart';

const VisitorChartBox = () => {
  const usageResult  = useStatStore((s) => s.usageResult);
  const usageVisitor = usageResult?.visitorUsage ?? [];
  const [total, setTotal] = useState(0);

  useEffect(() => {
    setTotal(usageVisitor.length === 0 ? 0 : usageVisitor.reduce((acc, cur) => acc + cur.count, 0));
  }, [usageVisitor]);

  return (
    <StyledBox>
      <StyledHead>
        <p>전체 이용자수</p>
        <strong>{total.toLocaleString()}</strong>
        <span>(단위:건)</span>
      </StyledHead>
      <VisitorChart />
    </StyledBox>
  );
};

export default VisitorChartBox;

const StyledBox = styled.div`
  display: flex;
  padding: 20px 32px 24px;
  border-radius: 12px;
  border: 1px solid #2a2e54;
  background: #1a203a;

  &:nth-of-type(2) {
    grid-row: 1 / 2;
    grid-column: 2 / 4;
  }
`;

const StyledHead = styled.div`
  display: flex;
  width: 152px;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
  margin-right: 10px;
  position: relative;

  &::before {
    content: '';
    display: block;
    position: absolute;
    left: -33px;
    width: 4px;
    height: 17px;
    border-radius: 0 2px 2px 0;
    background: linear-gradient(180deg, #7f7aff, #681ceb);
    box-shadow: 4px 0 5px 0 rgba(111, 57, 241, 0.33);
  }

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
