import styled from 'styled-components';
import moment from 'moment';
import { EventResultItem } from '../../../../../types/event';
import { HOME_MAP } from '../../../../../lib/homeImage';

// 이벤트 코드 → 이름·아이콘 매핑 (기존 하드코딩 if/else 제거)
const EVENT_DISPLAY: Record<string, { nm: string; icon: string }> = {
  '01': { nm: '비상벨',    icon: HOME_MAP.SUB.PANEL.EVENT.BELL },
  '02': { nm: '화재 센서', icon: HOME_MAP.SUB.PANEL.EVENT.FIRE },
};

interface Props {
  eventInfo: EventResultItem;
}

const EventSubPanelItem = ({ eventInfo }: Props) => {
  const display = EVENT_DISPLAY[eventInfo.statEvetCd];

  return (
    <StyledItem>
      {display && <StyledIcon $backImg={display.icon} />}
      <StyledInfo>
        <StyledTitle>{display?.nm ?? eventInfo.statEvetCd}</StyledTitle>
        <StyledDtm>
          {moment(eventInfo.outbDtm, 'YYYYMMDDHHmmss').format('MM-DD HH:mm:ss')}
        </StyledDtm>
      </StyledInfo>
    </StyledItem>
  );
};

export default EventSubPanelItem;

const StyledItem = styled.div`
  width: 180px;
  height: 46px;
  border-radius: 4px;
  display: flex;
  gap: 8px;
  padding: 6px 8px 6px 4px;
`;

const StyledIcon = styled.div<{ $backImg: string }>`
  width: 20px;
  height: 20px;
  background: url('${({ $backImg }) => $backImg}') no-repeat center / 100%;
`;

const StyledInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

const StyledTitle = styled.p`
  font-size: 16px;
  font-weight: 600;
  color: #fff;
`;

const StyledDtm = styled.p`
  font-size: 12px;
  font-weight: 400;
  color: #fff;
`;
