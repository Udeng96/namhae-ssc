import { useEffect, useState } from 'react';
import moment from 'moment';
import styled from 'styled-components';

const TopClock = () => {
  const [nowDtm, setNowDtm] = useState(() =>
    moment().locale('ko').format('YYYY년 MM월 DD일 HH:mm'),
  );

  useEffect(() => {
    const timer = setInterval(() => {
      setNowDtm(moment().locale('ko').format('YYYY년 MM월 DD일 HH:mm'));
    }, 1000);

    return () => clearInterval(timer);
  }, []); // 기존: timeoutDuration 의존성 → 매 렌더마다 새 interval 생성 버그 수정

  return <StyledTopDate>{nowDtm}</StyledTopDate>;
};

export default TopClock;

const StyledTopDate = styled.div`
  margin-left: 51px;
  font-size: 14px;
  font-weight: 500;
  color: #f2f4fc;
`;
