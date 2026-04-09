import styled from 'styled-components';
import { HOME_MAP } from '../../../lib/homeImage';
import { ANI_KEYFRAME } from '../../../lib/animations';
import HomeBodyPanel from './panel/HomeBodyPanel';
import { useHomeStore } from '../../../stores/homeStore';

const HomeBody = () => {
  const selectArea = useHomeStore((state) => state.selectArea);
  const isAll = selectArea === 'all';

  return (
    <StyledHomeMain $isActive={isAll}>
      <StyledHomeSea $isActive={isAll} />
      <StyledHomeMap />
      <HomeBodyPanel />
    </StyledHomeMain>
  );
};

export default HomeBody;

/* ── 전체 컨테이너 (배경색 + visibility) ── */
const StyledHomeMain = styled.div<{ $isActive: boolean }>`
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background-color: #3c3f57;
  opacity: ${({ $isActive }) => ($isActive ? '1' : '0')};
  visibility: ${({ $isActive }) => ($isActive ? 'visible' : 'hidden')};
  transition:
    opacity 400ms ease,
    visibility 400ms ease;
`;

/* ── 바다 배경 레이어 ── */
const StyledHomeSea = styled.div<{ $isActive: boolean }>`
  position: absolute;
  width: 100%;
  height: 100%;
  background: url('${HOME_MAP.ALL.BACK}') no-repeat center / cover;
  animation: ${ANI_KEYFRAME.HOME.MAP.BACK} 2850ms cubic-bezier(0.42, 0, 0, 0.95) forwards;
  opacity: ${({ $isActive }) => ($isActive ? '1' : '0')};
  z-index: 0;
`;

/* ── 섬 지도 레이어 ── */
const StyledHomeMap = styled.div`
  position: absolute;
  top: 59px;
  left: 262px;
  width: 1470px;
  height: 970px;
  background: url('${HOME_MAP.ALL.MAP}') no-repeat center;
  opacity: 0;
  visibility: visible;
  animation: ${ANI_KEYFRAME.HOME.MAP.WHOLE} 850ms cubic-bezier(0.42, 0, 0.16, 1.13) forwards;
  z-index: 1;
`;
