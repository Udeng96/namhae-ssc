import styled from 'styled-components';
import NotiLogo from '@/assets/images/dark/page/SeniorCenter_Dashboard/img/img_seniorCenter_wide_noticeScreen_bi.svg';
import NotiIcon from '@/assets/images/dark/page/SeniorCenter_Dashboard/img/icon_seniorCenter_noticeScreen_warning.png';
import { SCHE_IMAGE } from '@/component/lib/scheImage';
import { ScheduleType } from '@/component/types/noti';

interface Props {
  emer: ScheduleType;
}

type BackType = 'NONE' | 'FIRE' | 'TYPHOON' | string;

const getBackUrl = (eventType: BackType): string => {
  if (eventType === 'FIRE')    return SCHE_IMAGE.MAIN.BACK.FIRE;
  if (eventType === 'TYPHOON') return SCHE_IMAGE.MAIN.BACK.TYPHOON;
  if (eventType === 'NONE')    return SCHE_IMAGE.MAIN.BACK.NONE.WIDE;
  return SCHE_IMAGE.MAIN.BACK.SAFETY;
};

const NotiEmer = ({ emer }: Props) => {
  const backUrl = getBackUrl(emer.fileList[0]?.fileId ?? 'NONE');

  return (
    <StyledEmer $backUrl={backUrl}>
      <StyledEmerPanel>
        <StyledEmerPanelLogo />
        <StyledEmerPanelIcon />
        <StyledEmerPanelTitle>{emer.contentTitle}</StyledEmerPanelTitle>
        <StyledEmerPanelContent>{emer.contentCntn}</StyledEmerPanelContent>
      </StyledEmerPanel>
    </StyledEmer>
  );
};

export default NotiEmer;

/* ─── Styled ─────────────────────────────────────────── */
const StyledEmer = styled.div<{ $backUrl: string }>`
  width: 100%;
  height: 100%;
  background: url(${({ $backUrl }) => $backUrl});
`;

const StyledEmerPanel = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 1560px;
  height: 878px;
  border-radius: 40px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  background: rgba(0, 0, 0, 0.15);
  box-shadow:
    0px 8px 14px 0px rgba(0, 0, 0, 0.25),
    12px 12px 24px 0px rgba(255, 255, 255, 0.1) inset;
  backdrop-filter: blur(20px);
`;

const StyledEmerPanelLogo = styled.i`
  display: inline-block;
  background: url(${NotiLogo}) no-repeat center / 100%;
  position: absolute;
  top: 64px;
  left: 80px;
  width: 153px;
  height: 44px;
`;

const StyledEmerPanelIcon = styled.i`
  display: inline-block;
  background: url(${NotiIcon}) no-repeat center / 100%;
  width: 96px;
  height: 96px;
`;

const StyledEmerPanelTitle = styled.h2`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  width: 714px;
  height: 160px;
  margin: 4px 0 15px;
  font-size: 64px;
  font-weight: 700;
  line-height: 1.25;
  color: #fff;
  text-align: center;
  text-shadow: 0px 0px 4px rgba(0, 0, 0, 0.24);
`;

const StyledEmerPanelContent = styled.p`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  width: 1180px;
  height: 360px;
  font-size: 48px;
  font-weight: 500;
  line-height: 1.5;
  color: #fff;
  text-align: center;
`;
