import { memo } from 'react';
import styled from 'styled-components';
import { NavType } from '../../../../types/common';
import { useCommonStore } from '../../../../stores/commonStore';

interface Props {
  nav: NavType;
  isActive: boolean;
  isHover: boolean;
}

/**
 * 단일 네비게이션 아이템
 * - 클릭 시 selectNav만 변경 (상태 리셋은 각 페이지가 selectNav 구독해서 처리)
 * - memo로 감싸서 isActive, isHover 변경 없으면 리렌더 방지
 */
const NavItem = memo(({ nav, isActive, isHover }: Props) => {
  const setSelectNav = useCommonStore.getState().actions.setSelectNav;

  return (
    <StyledNavItem
      key={`NAV_${nav.cd}`}
      $isActive={isActive}
      $isHover={isHover}
      $baseImg={nav.back}
      $hoverImg={nav.hover}
      $activeImg={nav.active}
      onClick={() => setSelectNav(nav)}
    >
      <a>
        <i />
        <div>{nav.nm}</div>
      </a>
    </StyledNavItem>
  );
});

NavItem.displayName = 'NavItem';

export default NavItem;

interface StyledProps {
  $isActive: boolean;
  $isHover: boolean;
  $baseImg: string;
  $hoverImg: string;
  $activeImg: string;
}

const StyledNavItem = styled.li<StyledProps>`
  width: 136px;
  height: 34px;
  font-family: NotoSansCJKkr;
  font-size: 12px;
  font-weight: 500;
  color: ${({ $isHover, $isActive }) => ($isHover ? ($isActive ? '#fff' : '#97A0D1') : 'transparent')};
  border-radius: 8px;
  background: ${({ $isHover, $isActive }) =>
    $isHover ? ($isActive ? 'linear-gradient(180deg, #7F7AFF, #681CEB)' : 'transparent') : 'transparent'};

  a {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    height: 100%;
    line-height: 34px;

    i {
      width: 34px;
      height: 34px;
      background-size: 100%;
      background-repeat: no-repeat;
      background-image: url('${({ $isActive, $isHover, $hoverImg, $activeImg, $baseImg }) =>
        $isActive ? ($isHover ? $hoverImg : $activeImg) : $baseImg}');
    }

    div {
      display: ${({ $isHover }) => ($isHover ? 'flex' : 'none')};
      height: 100%;
      line-height: 34px;
      padding-left: 5px;
      padding-top: 1px;
    }
  }

  &:hover {
    color: #fff;
    background: ${({ $isActive }) =>
      $isActive ? 'linear-gradient(180deg, #7F7AFF, #681CEB)' : '#1A203A'};
    cursor: pointer;

    a i {
      background-image: url('${({ $hoverImg }) => $hoverImg}');
    }

    a div {
      display: flex;
    }
  }
`;
