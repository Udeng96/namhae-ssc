import styled from 'styled-components';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useShallow } from 'zustand/react/shallow';
import TopBar from './common/top/TopBar';
import NavBar from './common/nav/NavBar';
import { useCommonStore } from '../../stores/commonStore';
import { useRoleInit } from './_hooks/useRoleInit';
import { useCctvInit } from './_hooks/useCctvInit';
import { useFacInit } from './_hooks/useFacInit';
import { NAV_CODE } from '../../constants/nav';
import { USER_TYPE } from '../../constants/user';

import HomeRoot    from './home/HomeRoot';
import EventRoot   from './event/EventRoot';
import FacRoot     from './fac/FacRoot';
import ScheRoot    from './sche/ScheRoot';
import StatRoot    from './stat/StatRoot';
import FullCctvBox from './_gis/FullCctvBox';
import FireRoot    from './fire/FireRoot';

const ManageRoot = () => {
  useRoleInit();  // 권한 초기화 (1회)
  useCctvInit();  // CCTV 목록 초기화 - Event/Fac 공통 (1회)
  useFacInit();   // 시설물 전체 목록 초기화 → scFacs 저장 (1회)

  const { selectNav, userInfo } = useCommonStore(
    useShallow((state) => ({
      selectNav: state.selectNav,
      userInfo: state.userInfo,
    })),
  );

  const isAdmin = userInfo?.userType === USER_TYPE.ADMIN;
  const isFire = userInfo?.userType === USER_TYPE.FIRE;
  const isSenior = userInfo?.userType === USER_TYPE.SENIOR;

  return (
    <DndProvider backend={HTML5Backend}>
      <StyledManage>
        {/* ── 공통 레이아웃 ── */}
        <TopBar />
        <NavBar />

        {/* ── Full CCTV Player 모달 (전역) ── */}
        <FullCctvBox />

        {/* ── ADMIN 전용 페이지 ── */}
        {isAdmin && (
          <>
            <HomeRoot  isShow={selectNav.cd === NAV_CODE.HOME} />
            <EventRoot isShow={selectNav.cd === NAV_CODE.EVENT} />
            <FacRoot   isShow={selectNav.cd === NAV_CODE.FAC} />
            <ScheRoot  isShow={selectNav.cd === NAV_CODE.SCHE} />
            <StatRoot  isShow={selectNav.cd === NAV_CODE.STAT} />
          </>
        )}

        {/* ── 소방 전용 페이지 ── */}
        {isFire && (
          <>
            <FireRoot isShow={true} />
          </>
        )}

        {/* ── 시니어 전용 페이지 ── */}
        {isSenior && (
          <>
            <ScheRoot isShow={true} />
          </>
        )}
      </StyledManage>
    </DndProvider>
  );
};

export default ManageRoot;

const StyledManage = styled.div`
  display: flex;
  flex-wrap: wrap;
  position: relative;
  overflow: hidden;
  width: 100%;
  height: 100vh;
  color: #fff;
  background-color: #0f1223;
  max-height: 2160px;
  max-width: 3840px;
  min-height: 1080px;
  min-width: 1920px;

  &:hover {
    cursor: default;
  }
`;
