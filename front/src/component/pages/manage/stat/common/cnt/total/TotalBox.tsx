import styled from 'styled-components';
import { STAT_IMAGE } from '@/component/lib/statImage';

const TotalBox = ({ title, cnt }: { title: string; cnt: number }) => (
  <StyledTotalBox>
    <h2><i />{title}</h2>
    <StyledTotalBoxItem>{cnt}</StyledTotalBoxItem>
  </StyledTotalBox>
);

export default TotalBox;

const StyledTotalBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;

  h2 {
    display: flex;
    align-items: center;
    font-size: 15px;
    color: #B299FF;
    text-align: center;

    i {
      display: inline-block;
      width: 22px;
      height: 22px;
      margin-right: 8px;
      background: url(${STAT_IMAGE.CNT.TOTAL.SC}) no-repeat center / 100%;
    }
  }

  &:last-child {
    i { background: url(${STAT_IMAGE.CNT.TOTAL.FAC}) no-repeat center / 100%; }
    div:last-child::after { content: '개'; }
  }
`;

const StyledTotalBoxItem = styled.div`
  padding-right: 17px;
  font-size: 28px;
  font-weight: 700;
  color: #FFF;
  text-align: right;

  &::after {
    content: '개소';
    display: inline-block;
    margin-left: 3px;
    font-size: 15px;
    font-weight: 400;
    color: #F2F4FC;
  }
`;
