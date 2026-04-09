import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useShallow } from 'zustand/react/shallow';
import { useHomeStore } from '../../../stores/homeStore';
import { useCommonStore } from '../../../stores/commonStore';
import { ANI_KEYFRAME } from '../../../lib/animations';

const HomeMenu = () => {
  const [isAni, setIsAni] = useState(false);

  const { selectArea, hoverArea, setHoverArea, setSelectArea, setSelectSc } =
    useHomeStore(
      useShallow((s) => ({
        selectArea: s.selectArea,
        hoverArea: s.hoverArea,
        setHoverArea: s.actions.setHoverArea,
        setSelectArea: s.actions.setSelectArea,
        setSelectSc: s.actions.setSelectSc,
      })),
    );

  const areaList = useCommonStore((s) => s.areaRoles);

  // 지역 권한 로드 후 애니메이션 트리거 → 1.9초 뒤 종료
  useEffect(() => {
    if (areaList.length === 0) return;
    setIsAni(true);
    const timer = setTimeout(() => setIsAni(false), 1900);
    return () => clearTimeout(timer);
  }, [areaList]);

  const handleMenu = (znCd: string) => {
    setSelectArea(znCd);
    setSelectSc('');   // fix: null → ''
  };

  const sortedList = [...areaList].sort(
    (a, b) => (b.active ? 1 : 0) - (a.active ? 1 : 0),
  );

  return (
    <StyledHomeMenu>
      <StyledMenuItem
        $isHover={hoverArea === 'all'}
        $isActive={selectArea === 'all'}
        $isDisabled={false}
        $isAni={false}
        onClick={() => handleMenu('all')}
        onMouseOver={() => setHoverArea('all')}
        onMouseLeave={() => setHoverArea('')}
      >
        전체 지역
      </StyledMenuItem>

      {sortedList.map((area) => (
        <StyledMenuItem
          key={area.znCd}
          $isAni={isAni}
          $isActive={selectArea === area.znCd}
          $isHover={hoverArea === area.znCd}
          $isDisabled={!area.active}
          onMouseOver={() => setHoverArea(area.znCd)}
          onMouseLeave={() => setHoverArea('')}
          onClick={() => handleMenu(area.znCd)}
        >
          {area.znNm}
        </StyledMenuItem>
      ))}
    </StyledHomeMenu>
  );
};

export default HomeMenu;

const StyledHomeMenu = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 10px;
  position: absolute;
  top: 243px;
  left: 40px;
  z-index: 2;
`;

const StyledMenuItem = styled.li<{
  $isActive: boolean;
  $isHover: boolean;
  $isDisabled: boolean;
  $isAni: boolean;
}>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 126px;
  height: 48px;
  font-size: 18px;
  font-weight: 500;
  color: ${({ $isDisabled }) => ($isDisabled ? 'rgba(255,255,255,0.33)' : '#fff')};
  border-radius: 30px;
  border: ${({ $isActive, $isDisabled, $isHover }) =>
    $isDisabled
      ? '1.5px solid rgba(137,141,163,0.2)'
      : $isActive
        ? '2px solid #C7CDFF'
        : $isHover
          ? '1.5px solid rgba(194,194,242,0.40)'
          : '1.5px solid rgba(163,177,204,0.30)'};
  background: ${({ $isActive, $isDisabled, $isHover }) =>
    $isDisabled
      ? 'rgba(54,55,77,0.4)'
      : $isActive
        ? 'linear-gradient(135deg,#9DAAFF 14.06%,#6F40FF 51.87%,#430DA1 85.94%)'
        : $isHover
          ? 'rgba(105,57,252,0.35)'
          : 'rgba(16,28,64,0.45)'};
  box-shadow: ${({ $isActive }) =>
    $isActive
      ? '0px 4px 12px 4px rgba(88,52,235,0.2),0px 4px 6px 0px rgba(0,0,0,0.16)'
      : '0px 4px 6px 0px rgba(0,0,0,0.16)'};
  backdrop-filter: ${({ $isHover }) => ($isHover ? 'blur(4px)' : 'none')};
  cursor: pointer;
  transition: opacity 150ms ease-in-out;
  transform: translateX(0);
  opacity: 0;
  pointer-events: ${({ $isDisabled }) => ($isDisabled ? 'none' : 'auto')};
  animation: ${ANI_KEYFRAME.HOME.MENU} 300ms cubic-bezier(0.42, 0, 0, 0.97) forwards;

  &:first-of-type {
    position: relative;
    margin-bottom: 39px;
    opacity: 1;

    &::after {
      content: '';
      display: block;
      position: absolute;
      top: calc(100% + 24px);
      left: 50%;
      transform: translateX(-50%);
      width: 32px;
      height: 1px;
      background-color: rgba(255, 255, 255, 0.8);
    }
  }

  ${({ $isAni }) =>
    $isAni &&
    `
    &:nth-child(1)  { animation-delay: 50ms; }
    &:nth-child(2)  { animation-delay: 100ms; }
    &:nth-child(3)  { animation-delay: 250ms; }
    &:nth-child(4)  { animation-delay: 350ms; }
    &:nth-child(5)  { animation-delay: 450ms; }
    &:nth-child(6)  { animation-delay: 550ms; }
    &:nth-child(7)  { animation-delay: 650ms; }
    &:nth-child(8)  { animation-delay: 750ms; }
    &:nth-child(9)  { animation-delay: 850ms; }
    &:nth-child(10) { animation-delay: 950ms; }
    &:nth-child(11) { animation-delay: 1000ms; }
    &:nth-child(n+7) { animation-duration: 200ms; }
  `}
`;
