import styled from 'styled-components';
import { useScheStore } from '@/component/stores/scheStore';
import { SCHE_TYPE } from '@/component/constants/scheConst';

const ScheFileRow = () => {
  const activeType = useScheStore((s) => s.activeType);

  return (
    <StyledRow>
      <StyledItem $isActive={activeType === SCHE_TYPE.CONTENT}>콘텐츠 리스트</StyledItem>
      <StyledItem $isActive={activeType !== SCHE_TYPE.CONTENT}>공지 알림 리스트</StyledItem>
    </StyledRow>
  );
};

export default ScheFileRow;

const StyledRow = styled.div`
  display: flex;
  width: 528px;
  height: 40px;
  background: #0A0E21;
  padding: 4px 0 0 24px;
`;

const StyledItem = styled.div<{ $isActive: boolean }>`
  display: flex;
  width: 127px;
  height: 36px;
  padding-top: 9px;
  flex-direction: column;
  align-items: center;
  gap: 9px;
  flex-shrink: 0;
  border-bottom: 2px solid ${({ $isActive }) => ($isActive ? '#7F7AFF' : 'transparent')};
  text-align: center;
  font-size: 16px;
  font-weight: 500;
  color: ${({ $isActive }) => ($isActive ? '#7F7AFF' : '#868FBF')};
`;
