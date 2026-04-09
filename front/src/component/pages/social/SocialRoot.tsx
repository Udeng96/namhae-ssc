import styled from 'styled-components';
import SocialBody from './body/SocialBody';
import SocialHead from './head/SocialHead';
import { useQuery } from '@tanstack/react-query';
import { fetchReport } from '@/component/api/socialApi';
import { useEffect } from 'react';
import { useSocialStore } from '@/component/stores/socialStore';
import { useShallow } from 'zustand/react/shallow';
import ReportPopup from './popup/report/ReportPopup';
import useSocialWs from '@/component/_hooks/useSocialWs';
import EventPopup from './popup/event/EventPopup';
import FireAlarm from './alarm/FireAlarm';
import { useLocation } from 'react-router-dom';

const SocialRoot = () => {
  const wsData   = useSocialWs();
  const location = useLocation();
  const scCode   = location.pathname.split('/')[3] ?? '';

  const {
    report,
    setReport,
    setScheSocketData,
    setEventSocketData,
    eventSocketData,
  } = useSocialStore(
    useShallow((s) => ({
      report:            s.report,
      setReport:         s.actions.setReport,
      setScheSocketData:  s.actions.setScheSocketData,
      setEventSocketData: s.actions.setEventSocketData,
      eventSocketData:   s.eventSocketData,
    })),
  );

  // ─── 보도자료 30분 주기 조회
  const { data: reportRes } = useQuery(
    ['reports'],
    () => fetchReport(),
    { refetchInterval: 1800000 },
  );

  useEffect(() => {
    setReport(reportRes?.data ?? null);
  }, [reportRes]);

  // 보도자료 팝업 15초 후 자동 닫기
  useEffect(() => {
    if (!report) return;
    const id = setTimeout(() => setReport(null), 15000);
    return () => clearTimeout(id);
  }, [report]);

  // ─── WS 메시지 분배
  useEffect(() => {
    if (!wsData) return;

    const postSubType = wsData.postType.split('/')[1];

    if (postSubType === 'NOTICE_S') {
      // 소방 긴급 이벤트 → eventSocketData
      if (wsData.message.contentArea === scCode) {
        if (
          eventSocketData !== null &&
          eventSocketData.message.contentId === wsData.message.contentId
        ) {
          console.log('동일한 이벤트');
        } else {
          setEventSocketData(wsData);
        }
      }
    } else {
      // 일반 스케줄 공지 → scheSocketData
      if (wsData.message.contentArea.split(',').includes(scCode)) {
        setScheSocketData(wsData);
      }
    }
  }, [wsData]);

  return (
    <StyledSocial>
      {/* 화재 알람 (항상 마운트) */}
      <FireAlarm scEvent={eventSocketData} />

      {/* 소방 긴급 이벤트 팝업 */}
      {eventSocketData && <EventPopup />}

      {/* 보도자료 팝업 (이벤트 없을 때) */}
      {!eventSocketData && report && report.resultType !== 'NONE' && (
        <StyledReport>
          <ReportPopup />
        </StyledReport>
      )}

      {/* 일반 화면 (이벤트·보도자료 없을 때) */}
      {!eventSocketData && (!report || report.resultType === 'NONE') && (
        <StyledSocialWrap>
          <StyledSocialBox>
            <SocialHead />
            <SocialBody />
          </StyledSocialBox>
        </StyledSocialWrap>
      )}
    </StyledSocial>
  );
};

export default SocialRoot;

const StyledSocial = styled.div`
  width: 1080px;
  height: 1920px;
  max-width: 1080px;
  position: relative;
`;

const StyledSocialWrap = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-content: flex-start;
  flex-direction: column;
  color: #1a203a;
  position: relative;
  z-index: 100;
`;

const StyledSocialBox = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-wrap: wrap;
  flex-direction: column;
  padding: 32px 58px 21px;
`;

const StyledReport = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  position: relative;
  z-index: 100;
`;
