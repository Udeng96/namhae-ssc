import styled from 'styled-components';
import { useSocialStore } from '@/component/stores/socialStore';
import { SOCIAL_IMAGE } from '@/component/lib/socialImage';
import { useEffect, useState } from 'react';
import moment from 'moment';

const REPORT_BACK_IMG = [
  SOCIAL_IMAGE.REPORT.GALE,
  SOCIAL_IMAGE.REPORT.HIGH_SEA,
  SOCIAL_IMAGE.REPORT.RAIN,
  SOCIAL_IMAGE.REPORT.SNOW,
  SOCIAL_IMAGE.REPORT.DRY,
  SOCIAL_IMAGE.REPORT.STORM,
  SOCIAL_IMAGE.REPORT.TYPHOON,
  SOCIAL_IMAGE.REPORT.DUST,
  SOCIAL_IMAGE.REPORT.COLD,
  SOCIAL_IMAGE.REPORT.HEAT,
];
const REPORT_BACK_TITLE = ['강풍', '풍랑', '호우', '대설', '건조', '폭풍해일', '태풍', '황사', '한파', '폭염'];

const ReportPopup = () => {
  const report = useSocialStore((s) => s.report);

  const [reportTime,  setReportTime]  = useState(moment().format('YYYY년 MM월 DD일 HH시 mm분'));
  const [reportBack,  setReportBack]  = useState<string>(SOCIAL_IMAGE.REPORT.GALE);
  const [reportTitle, setReportTitle] = useState<string>('강풍');

  useEffect(() => {
    if (!report) return;
    setReportBack(REPORT_BACK_IMG[Number(report.resultType) - 1]);
    setReportTitle(REPORT_BACK_TITLE[Number(report.resultType) - 1]);
    if (!report.resultTime) {
      setReportTime(moment().format('YYYY년 MM월 DD일 HH시 mm분'));
    } else {
      setReportTime(report.resultTime);
    }
  }, [report]);

  if (!report || report.resultType === 'NONE') return null;

  const displayTime = reportTime.includes('\r') ? reportTime.split('\r')[0] : reportTime;

  return (
    <StyledReport $backImg={reportBack}>
      <StyledReportTitle>
        {report.resultTitle.includes('·')
          ? report.resultTitle
              .split('·')
              .filter((line) => line.includes(reportTitle))
              .map((line, i) => <span key={i}>{line}</span>)
          : <span>{reportTitle}</span>
        }
      </StyledReportTitle>
      <StyledReportDate>{displayTime}</StyledReportDate>
      <StyledReportBox>
        {report.resultMessage.split('\n').map((line, i) => (
          <StyledReportContent key={i}>{line}<br /></StyledReportContent>
        ))}
      </StyledReportBox>
    </StyledReport>
  );
};

export default ReportPopup;

const StyledReport = styled.div<{ $backImg: string }>`
  width: 100%;
  height: 100%;
  top: 0; left: 0;
  position: relative;
  background-image: url("${({ $backImg }) => $backImg}");
`;

const StyledReportTitle = styled.div`
  width: 100%;
  height: 62px;
  color: #FFF;
  font-size: 88px;
  font-weight: 600;
  text-align: center;
  position: absolute;
  top: 300px;
`;

const StyledReportDate = styled.div`
  width: 100%;
  font-size: 40px;
  font-weight: 600;
  color: #FFF;
  text-align: center;
  position: absolute;
  top: 838px;
`;

const StyledReportBox = styled.div`
  width: 808px;
  height: 540px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-size: 60px;
  font-weight: 600;
  color: #FFF;
  text-align: center;
  line-height: 80px;
  position: absolute;
  top: 946px;
  left: 136px;
`;

const StyledReportContent = styled.div`
  width: 100%;
  height: auto;
`;
