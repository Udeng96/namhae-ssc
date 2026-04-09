import styled from 'styled-components';
import {
  CommonScrollBar,
  CommonScrollBox,
  CommonSearchSelectBox,
  CommonSearchSelectClsBtn,
  CommonSearchSelectClsBtnArea,
} from '@/component/lib/css';
import CheckboxTree from 'react-checkbox-tree';
import { useEffect, useState } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { useScheStore } from '@/component/stores/scheStore';

// ── ScCheck (인라인) ────────────────────────────────────
const ScCheck = () => {
  const { scheNodes, selectScOpt, setSelectScOpt } = useScheStore(
    useShallow((s) => ({
      scheNodes:      s.scheNodes,
      selectScOpt:    s.selectScOpt,
      setSelectScOpt: s.actions.setSelectScOpt,
    })),
  );
  const [expand, setExpand] = useState(['all/전체']);
  const [checked, setChecked] = useState<string[]>([]);

  useEffect(() => {
    setChecked([...selectScOpt]);
  }, [selectScOpt]);

  const handleChecked = (e: string[]) => {
    if (!selectScOpt.includes('all/전체')) {
      if (
        scheNodes[0]?.children?.length &&
        e.length === scheNodes[0].children[0]?.children?.length
      ) {
        setSelectScOpt([...e, 'all/전체']);
      } else {
        setSelectScOpt([...e]);
      }
    } else {
      setSelectScOpt(e.filter((item) => item !== 'all/전체'));
    }
  };

  return (
    <CheckboxTree
      id="scTree"
      nodes={scheNodes}
      checked={checked}
      expanded={expand}
      onCheck={(e) => handleChecked(e)}
      onExpand={(e) => setExpand(e)}
    />
  );
};

// ── TreeSelectBox ───────────────────────────────────────
interface Props {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const TreeSelectBox = ({ isOpen, setIsOpen }: Props) => (
  <StyledWrap $isOpen={isOpen}>
    <div>
      <StyledScroll>
        <ScCheck />
      </StyledScroll>
      <StyledClsBtnArea>
        <StyledClsBtn onClick={() => setIsOpen(false)}>닫기</StyledClsBtn>
      </StyledClsBtnArea>
    </div>
  </StyledWrap>
);

export default TreeSelectBox;

const StyledWrap = styled.div<{ $isOpen: boolean }>`
  display: ${({ $isOpen }) => ($isOpen ? 'block' : 'none')};
  ${CommonSearchSelectBox};
  z-index: 1;
`;

const StyledScroll = styled.div`
  ${CommonScrollBar};
  ${CommonScrollBox};
  max-height: 158px;
  padding: 15px 10px 15px 15px;
`;

const StyledClsBtnArea = styled.div`
  ${CommonSearchSelectClsBtnArea};
`;

const StyledClsBtn = styled.button`
  ${CommonSearchSelectClsBtn};
`;
