import { useState, useMemo } from 'react';
import styled from 'styled-components';
import { useShallow } from 'zustand/react/shallow';
import NavItem from './NavItem';
import { useCommonStore } from '../../../../stores/commonStore';
import { NAV_LIST, NAV_MAP } from '../../../../constants/nav';
import { USER_TYPE } from '../../../../constants/user';

const NavBar = () => {
  const [isHover, setIsHover] = useState(false);

  const { selectNav, userInfo } = useCommonStore(
    useShallow((state) => ({
      selectNav: state.selectNav,
      userInfo: state.userInfo,
    })),
  );

  // userType에 따라 보여줄 nav 아이템 결정
  const navItems = useMemo(() => {
    if (!userInfo) return null;

    if (userInfo.userType === USER_TYPE.ADMIN) {
      return NAV_LIST.map((nav) => (
        <NavItem
          key={nav.cd}
          nav={nav}
          isActive={selectNav.cd === nav.cd}
          isHover={isHover}
        />
      ));
    }

    if (userInfo.userType === USER_TYPE.FIRE) {
      return (
        <NavItem nav={NAV_MAP['EVENT']} isActive={true} isHover={isHover} />
      );
    }

    if (userInfo.userType === USER_TYPE.SENIOR) {
      return (
        <NavItem nav={NAV_MAP['SCHE']} isActive={true} isHover={isHover} />
      );
    }

    return null;
  }, [userInfo, selectNav.cd, isHover]);

  // nav 는 position:absolute + z-index:1000 으로 컨텐츠 위에 오버레이되므로
  // 메인 컨테이너 너비(--nav-width)는 고정(60px). isHover 는 아이템 텍스트 노출 제어용.
  const handleMouseOver  = () => setIsHover(true);
  const handleMouseLeave = () => setIsHover(false);

  return (
    <StyledNav>
      <StyledNavItemWrap
        onMouseOver={handleMouseOver}
        onMouseLeave={handleMouseLeave}
      >
        {navItems}
      </StyledNavItemWrap>
    </StyledNav>
  );
};

export default NavBar;

const StyledNav = styled.section`
  position: absolute;
  top: 48px;
  width: 60px;
  /* 호버 시 확장된 nav 가 다른 컨텐츠(CCTV 플레이어 1899, 토스트 1100 등) 위에 오도록
     2000 으로 상향. 9999 로딩 스피너는 예외(스피너가 덮는 게 정상 동작) */
  z-index: 2000;
`;

const StyledNavItemWrap = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 16px 0;
  width: 60px;
  height: 1032px;
  padding: 30px 13px 0 13px;
  background-color: #0f1223;
  border-right: solid 1px #1a203a;
  overflow: hidden;

  &:hover {
    width: 162px;
    color: #97a0d1;
  }
`;
