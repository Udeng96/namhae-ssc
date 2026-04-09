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

  return (
    <StyledNav>
      <StyledNavItemWrap
        onMouseOver={() => setIsHover(true)}
        onMouseLeave={() => setIsHover(false)}
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
  z-index: 1000;
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
