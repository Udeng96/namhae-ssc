import styled from 'styled-components';
import { useCallback } from 'react';
import { useScheStore } from '@/component/stores/scheStore';
import { useShallow } from 'zustand/react/shallow';
import { SCHE_TYPE } from '@/component/constants/scheConst';
import { useCommonStore } from '@/component/stores/commonStore';
import { USER_TYPE } from '@/component/constants/user';
import ScheBoardContent from '@/component/pages/manage/sche/main/board/ScheBoardContent';
import ScheBoardNorm    from '@/component/pages/manage/sche/main/board/ScheBoardNorm';
import ScheBoardEmer    from '@/component/pages/manage/sche/main/board/ScheBoardEmer';

const ScheBoard = () => {
  const userInfo = useCommonStore((s) => s.userInfo);
  const { activeType, setActiveType } = useScheStore(
    useShallow((s) => ({
      activeType:    s.activeType,
      setActiveType: s.actions.setActiveType,
    })),
  );

  // 탭 전환: setActiveType 내부에서 이전 폼 상태 자동 초기화
  const handleContent = useCallback(() => setActiveType(SCHE_TYPE.CONTENT), [setActiveType]);
  const handleNorm    = useCallback(() => setActiveType(SCHE_TYPE.NORM),    [setActiveType]);

  return (
    <StyledForm>
      <StyledFormHead>
        <StyledFormHeadItem
          $isActive={activeType === SCHE_TYPE.CONTENT}
          onClick={handleContent}
          disabled={userInfo?.userType === USER_TYPE.SENIOR}
        >
          영상 콘텐츠
        </StyledFormHeadItem>
        <StyledFormHeadItem
          $isActive={activeType !== SCHE_TYPE.CONTENT}
          onClick={handleNorm}
        >
          공지 알림
        </StyledFormHeadItem>
      </StyledFormHead>
      <StyledFormBody>
        <ul>
          {activeType === SCHE_TYPE.CONTENT && <ScheBoardContent />}
          {activeType === SCHE_TYPE.NORM    && <ScheBoardNorm />}
          {activeType === SCHE_TYPE.EMER    && <ScheBoardEmer />}
        </ul>
      </StyledFormBody>
    </StyledForm>
  );
};

export default ScheBoard;

const StyledForm = styled.div`width: 480px;`;

const StyledFormHead = styled.div`
  display: flex;
  justify-content: space-between;
`;

const StyledFormHeadItem = styled.button<{ $isActive: boolean }>`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 50%;
  height: 42px;
  font-size: 15px;
  font-weight: 500;
  color: ${({ $isActive }) => ($isActive ? '#F2F4FC' : '#BCBFCC')};
  border-radius: 10px 10px 0 0;
  background-color: ${({ $isActive }) => ($isActive ? '#1A203A' : '#12172E')};
  cursor: pointer;
  &:disabled { opacity: 0.5; pointer-events: none; }
  &:hover { color: ${({ $isActive }) => ($isActive ? '#F2F4FC' : '#9C7BFFFF')}; cursor: ${({ $isActive }) => ($isActive ? 'default' : 'pointer')}; }
`;

const StyledFormBody = styled.div`
  width: 100%;
  border-radius: 0 0 10px 10px;
`;
