import styled from 'styled-components';
import { useShallow } from 'zustand/react/shallow';
import { STAT_TYPE, STAT_TYPE_LIST } from '@/component/constants/statConst';
import { useStatStore } from '@/component/stores/statStore';

const SortMenu = () => {
  const { activeTab, setActiveTab } = useStatStore(
    useShallow((s) => ({
      activeTab:    s.activeTab,
      setActiveTab: s.actions.setActiveTab,
    })),
  );

  const handleSort = (menu: { id: string; nm: string }) => {
    if (menu.id === activeTab) return;
    setActiveTab(menu.id as any);
  };

  return (
    <StyledSortMenu>
      {STAT_TYPE_LIST.map((menu, i) => (
        <StyledSortMenuBtn
          key={i}
          $isActive={activeTab === menu.id}
          onClick={() => handleSort(menu)}
        >
          {menu.nm}
        </StyledSortMenuBtn>
      ))}
    </StyledSortMenu>
  );
};

export default SortMenu;

const StyledSortMenu = styled.div`
  display: flex;
  align-items: center;
  position: absolute;
  top: 24px;
  left: calc(50% - 60px);
  transform: translateX(-50%);
  width: auto;
  height: 46px;
  padding: 3px;
  border-radius: 23px;
  border: 1px solid #292D40;
  background: #1F2233;
  z-index: 3;
`;

const StyledSortMenuBtn = styled.button<{ $isActive: boolean }>`
  width: 114px;
  height: 40px;
  font-size: 16px;
  font-weight: 500;
  color: ${({ $isActive }) => ($isActive ? '#FFF' : '#C8CBE8')};
  border-radius: 20px;
  background: ${({ $isActive }) => ($isActive ? 'linear-gradient(180deg, #8554FF, #543FAF)' : 'transparent')};
  cursor: pointer;

  &:hover {
    color: ${({ $isActive }) => ($isActive ? '#FFF' : '#B299FF')};
  }
`;
