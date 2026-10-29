import styled from 'styled-components';
import { useEffect, useState } from 'react';
import { useStatStore } from '@/component/stores/statStore';
import { CONN_COLORS } from './ConnChart';

// 색상 상수는 ConnChart 와 공유 (별도 정의 시 순서 불일치로 차트/범례 색상이 어긋났던 버그 수정)

const ConnLegend = () => {
  const usageResult   = useStatStore((s) => s.usageResult);
  const usageConnConf = usageResult?.connConfUsage ?? [];

  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    if (usageConnConf.length > 0) {
      setCategories(usageConnConf.map((item) => item.key));
    }
  }, [usageConnConf]);

  return (
    <StyledLegend>
      {categories.map((item, index) => (
        <StyledItem key={item} $color={CONN_COLORS[index]}>{item}</StyledItem>
      ))}
    </StyledLegend>
  );
};

export default ConnLegend;

const StyledLegend = styled.ul`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 20px 40px;
  width: 136px;
  height: fit-content;
  margin-top: auto;
`;

const StyledItem = styled.li<{ $color: string }>`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  font-weight: 400;
  color: #bcbfcc;
  text-shadow: 0 4px 4px rgba(0, 0, 0, 0.25);

  &::before {
    content: '';
    display: block;
    width: 10px;
    height: 10px;
    border-radius: 3px;
    background: ${({ $color }) => $color};
  }
`;
