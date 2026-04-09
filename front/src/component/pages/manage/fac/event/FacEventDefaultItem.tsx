import styled from 'styled-components';
import moment from 'moment';
import { TodayEventItem } from '@/component/types/event';

const FacEventDefaultItem = ({ item }: { item: TodayEventItem }) => (
  <StyledWrap>
    <StyledRow>
      <StyledItem>{item.statEvetNm?.replace('상태', '').trim()}</StyledItem>
      <StyledItem>{item.statEvetGdCd === '00' ? '정상' : '고장'}</StyledItem>
      <StyledItem>
        {moment(item.outbDtm, 'YYYYMMDDHHmmssSSS').format('YYYY-MM-DD HH:mm:ss')}
      </StyledItem>
      <StyledItem>
        {item.clrDtm === ''
          ? '-'
          : moment(item.clrDtm, 'YYYYMMDDHHmmssSSS').format('YYYY-MM-DD HH:mm:ss')}
      </StyledItem>
    </StyledRow>
  </StyledWrap>
);

export default FacEventDefaultItem;

const StyledWrap = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  height: 39px;
  padding: 4px 7px;
  border-radius: 7px;
  border: 1px solid #2a2e54;
  background: #1a203a;
  margin-top: 3px;
`;

const StyledRow = styled.ul`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
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
  &:nth-child(4) { width: 110px; justify-content: flex-start; }
`;
