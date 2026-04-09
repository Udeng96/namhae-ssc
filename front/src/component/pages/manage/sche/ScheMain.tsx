import styled from 'styled-components';
import { useEffect } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { useQuery } from '@tanstack/react-query';
import { useCommonStore } from '@/component/stores/commonStore';
import { useScheStore } from '@/component/stores/scheStore';
import { fetchAllSchedules } from '@/component/api/scheApi';
import { SCHE_RESULT_TYPE, SCHE_TYPE } from '@/component/constants/scheConst';
import { USER_TYPE } from '@/component/constants/user';
import ScheMainHead from '@/component/pages/manage/sche/main/ScheMainHead';
import ScheMainBody from '@/component/pages/manage/sche/main/ScheMainBody';

/**
 * ScheMain — 콘텐츠 스케줄링 패널
 * - 스케줄 목록 조회 (React Query)
 * - contents / norms / emers 분류
 * - 시니어 유저: 특정 경로당만 조회, activeType=NORM
 */
const ScheMain = () => {
  const userInfo = useCommonStore((s) => s.userInfo);

  const {
    requestState,
    setRequestState,
    setSchedules,
    setContents,
    setNorms,
    setEmers,
    setActiveType,
  } = useScheStore(
    useShallow((s) => ({
      requestState:   s.requestState,
      setRequestState: s.actions.setRequestState,
      setSchedules:   s.actions.setSchedules,
      setContents:    s.actions.setContents,
      setNorms:       s.actions.setNorms,
      setEmers:       s.actions.setEmers,
      setActiveType:  s.actions.setActiveType,
    })),
  );

  // ── 유저 유형에 따라 조회 파라미터 설정 ───────────────────
  useEffect(() => {
    if (!userInfo) {
      setRequestState('none');
      return;
    }
    if (userInfo.userType === USER_TYPE.SENIOR) {
      // 로그인 ID에서 경로당 코드 추출 (예: "nh001" → "001")
      const loginId = userInfo.loginId.replace('nh', '').trim();
      setActiveType(SCHE_TYPE.NORM);
      setRequestState(loginId);
    } else {
      setRequestState('all');
    }
  }, [userInfo]);

  // ── 스케줄 조회 ───────────────────────────────────────────
  const { data: schedules } = useQuery(
    ['schedules', requestState],
    () => fetchAllSchedules(requestState),
    {
      keepPreviousData: true,
      enabled: requestState !== 'none',
    },
  );

  // ── 결과 분류 후 store 저장 ────────────────────────────────
  useEffect(() => {
    if (!schedules) return;
    const list = schedules.data;
    setSchedules(list);
    setContents(list.filter((s) => s.contentType === SCHE_RESULT_TYPE.CONTENT));
    setNorms(list.filter((s) => s.contentType === SCHE_RESULT_TYPE.NORM));
    setEmers(list.filter((s) => s.contentType === SCHE_RESULT_TYPE.EMER));
    setRequestState('none');
  }, [schedules]);

  return (
    <StyledScheMain>
      <StyledScheMainBox>
        <ScheMainHead />
        <ScheMainBody />
      </StyledScheMainBox>
    </StyledScheMain>
  );
};

export default ScheMain;

// ── Styled ────────────────────────────────────────────────────
const StyledScheMain = styled.div`
  height: 908px;
  border-radius: 16px;
  border: 1px solid #222a47;
  background: #12172e;
  box-shadow: 0px 6px 8px 0px rgba(0, 0, 0, 0.16);
`;

const StyledScheMainBox = styled.div`
  width: 1233px;
  height: 908px;
  border-radius: 16px;
  border: 1px solid #222a47;
  background: #12172e;
  box-shadow: 0px 6px 8px 0px rgba(0, 0, 0, 0.16);
`;
