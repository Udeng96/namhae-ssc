import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useMutation, useQuery } from '@tanstack/react-query';
import styled from 'styled-components';
import { fetchNotices, turnTv } from '@/component/api/notiApi';
import { SCHE_RESULT_TYPE } from '@/component/constants/scheConst';
import useNotiWs from '@/component/_hooks/useNotiWs';
import NotiEmer from './NotiEmer';
import { ScheduleType } from '@/component/types/noti';

/**
 * 시니어센터 32인치 정보표출모니터 화면
 * - 라우트: /sc/noti/{scMgtNo}
 * - 긴급공지(EMER) 감지 시 NotiEmer 표시 + expireTime 후 TV 점멸 제어
 */
const NotiRoot = () => {
  const location  = useLocation();
  const scMgtNo   = location.pathname.split('/')[3] ?? '';

  const wsData = useNotiWs();
  const [emerList, setEmerList] = useState<ScheduleType[]>([]);

  // ── 공지 목록 조회 ─────────────────────────────────
  const { data: notices, refetch } = useQuery(
    ['notiList', scMgtNo],
    () => fetchNotices(scMgtNo),
    { staleTime: Infinity, keepPreviousData: true, enabled: !!scMgtNo },
  );

  // ── TV 점멸 제어 ───────────────────────────────────
  const turnTvMutation = useMutation(
    () => turnTv(scMgtNo),
    { onSuccess: () => setEmerList([]) },
  );

  // ── 공지 목록 변경 처리 ───────────────────────────
  useEffect(() => {
    const emers = notices?.data?.emers ?? [];

    if (emers.length > 0) {
      setEmerList(emers);
      // expireTime(초) 후 TV 점멸 제어 호출
      setTimeout(() => {
        turnTvMutation.mutate();
      }, Number(emers[0].expireTime) * 1000);
    } else {
      setEmerList([]);
      turnTvMutation.mutate();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [notices]);

  // ── WebSocket 메시지 처리 ─────────────────────────
  useEffect(() => {
    if (!wsData) return;

    const scheType = wsData.postType.split('/')[1];
    if (scheType !== SCHE_RESULT_TYPE.EMER) return;

    const { contentTitle, contentCntn } = wsData.message;
    const isRefresh = contentTitle === 'refresh' && contentCntn === 'refresh';

    if (isRefresh) {
      refetch();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wsData]);

  return (
    <StyledNoti>
      {emerList.length > 0 && <NotiEmer emer={emerList[0]} />}
    </StyledNoti>
  );
};

export default NotiRoot;

/* ─── Styled ─────────────────────────────────────────── */
const StyledNoti = styled.div`
  display: flex;
  flex-wrap: wrap;
  position: relative;
  width: 100%;
  height: 1080px;
  margin: 0 auto;
  max-width: 1920px;
  color: #fff;
  background-color: #0f1223;
`;
