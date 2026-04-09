import styled from 'styled-components';
import { useEffect, useState } from 'react';
import moment from 'moment';

const DAY = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'];

const SocialDate = () => {
  const [nowDate, setNowDate] = useState(moment().locale('ko').format('YYYY년 MM월 DD일'));
  const [nowDay,  setNowDay]  = useState(moment().day());
  const [nowTime, setNowTime] = useState(moment().format('HH:mm'));

  useEffect(() => {
    const timer = setInterval(() => {
      setNowDate(moment().locale('ko').format('YYYY년 MM월 DD일'));
      setNowTime(moment().format('HH:mm'));
      setNowDay(moment().day());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <StyledDate>
      {nowDate + ' ' + DAY[nowDay]}
      <StyledTime>{nowTime}</StyledTime>
    </StyledDate>
  );
};

export default SocialDate;

const StyledDate = styled.div`
  margin-bottom: 27px;
  margin-left: auto;
  font-size: 23px;
  color: #1A203A;
  text-align: right;
`;

const StyledTime = styled.p`
  margin-top: 2px;
  font-size: 72px;
  font-weight: 700;
`;
