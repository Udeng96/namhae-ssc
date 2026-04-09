import styled from 'styled-components';
import moment from 'moment';
import {
  CommonScrollBar,
  CommonScrollBox,
} from '@/component/lib/css';
import { useEventStore } from '@/component/stores/eventStore';
import LastGis from '../../gis/LastGis';

const LastEventRightDetail = () => {
  const lastSelectEvent = useEventStore((state) => state.lastSelectEvent);

  if (!lastSelectEvent) {
    return (
      <StyledDetail>
        <span>선택한 이벤트가 없습니다.</span>
      </StyledDetail>
    );
  }

  return (
    <StyledDetail>
      <StyledDetailBox>
        <StyledDetailItem>
          <StyledNm>이벤트 유형</StyledNm>
          <StyledVal>{lastSelectEvent.statEvetNm}</StyledVal>
        </StyledDetailItem>
        <StyledDetailItem>
          <StyledNm>지역</StyledNm>
          <StyledVal>{lastSelectEvent.posNm}</StyledVal>
        </StyledDetailItem>
        <StyledDetailItem>
          <StyledNm>발생 일시</StyledNm>
          <StyledVal>
            {moment(lastSelectEvent.outbDtm, 'YYYYMMDDHHmmss').format('YYYY-MM-DD HH:mm:ss')}
          </StyledVal>
        </StyledDetailItem>
        <StyledDetailItem>
          <StyledNm>발생 위치</StyledNm>
          <StyledValLoc>
            <StyledGisWrap>
              <LastGis />
            </StyledGisWrap>
          </StyledValLoc>
        </StyledDetailItem>
        <StyledDetailItem>
          <StyledNm>공유 내용</StyledNm>
          <StyledValCntn>
            <StyledCntnScroll>{lastSelectEvent.statEvetCntn}</StyledCntnScroll>
          </StyledValCntn>
        </StyledDetailItem>
        <StyledDetailItem>
          <StyledNm>화상 회의</StyledNm>
          <StyledVal>
            {lastSelectEvent.clrDtm === ''
              ? '-'
              : moment(lastSelectEvent.clrDtm, 'YYYYMMDDHHmmss').format('YYYY-MM-DD HH:mm:ss')}
          </StyledVal>
        </StyledDetailItem>
      </StyledDetailBox>
    </StyledDetail>
  );
};

export default LastEventRightDetail;

const StyledDetail = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  color: #f2f4fc;
  width: 100%;
  height: 100%;
  padding: 16px 10px 16px 24px;
  line-height: 1.84;
  border-radius: 4px;
  background: #1a203a;
`;

const StyledDetailBox = styled.div`
  height: 310px;
  padding-right: 8px;
  ${CommonScrollBox}
  ${CommonScrollBar}
`;

const StyledDetailItem = styled.div`
  display: flex;
  align-items: flex-start;
  flex-wrap: wrap;
  + div { margin-top: 8px; }
`;

const StyledNm = styled.div`
  width: 76px;
  height: 36px;
  line-height: 36px;
`;

const StyledVal = styled.div`
  width: 232px;
  padding: 10px 15px;
  color: #fff;
  line-height: 1;
  border-radius: 6px;
  border: 1px solid #3e4165;
  background: #1a203a;
`;

const StyledValLoc = styled.div`
  width: 232px;
  color: #fff;
  line-height: 1;
  border-radius: 6px;
  border: 1px solid #3e4165;
  background: #1a203a;
  height: 130px;
  padding: 0;
  overflow: hidden;
`;

const StyledGisWrap = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  background-color: #000;
`;

const StyledValCntn = styled.div`
  width: 232px;
  padding: 10px 15px;
  color: #fff;
  line-height: 1;
  border-radius: 6px;
  border: 1px solid #3e4165;
  background: #1a203a;
`;

const StyledCntnScroll = styled.div`
  max-height: 110px;
  height: 310px;
  padding-right: 8px;
  line-height: 1.84;
  overflow-y: auto;
  ${CommonScrollBox}
  ${CommonScrollBar}
`;
