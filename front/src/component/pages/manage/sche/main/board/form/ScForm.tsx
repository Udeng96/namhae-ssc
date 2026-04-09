import styled from 'styled-components';
import {
  CommonFormBox, CommonFormBoxNm, CommonFormBoxVal, CommonFormBoxValDisabled,
} from '@/component/lib/css';
import TokenBox from '@/component/pages/manage/sche/main/board/form/token/TokenBox';
import TreeSelectBox from '@/component/pages/manage/sche/main/board/form/select/TreeSelectBox';
import { useEffect, useState } from 'react';
import { useScheStore } from '@/component/stores/scheStore';
import { useShallow } from 'zustand/react/shallow';
import { SCHE_MODE } from '@/component/constants/scheConst';

const ScForm = () => {
  const { scheMode, activeSche, scheNodes, setSelectScOpt } = useScheStore(
    useShallow((s) => ({
      scheMode:       s.scheMode,
      activeSche:     s.activeSche,
      scheNodes:      s.scheNodes,
      setSelectScOpt: s.actions.setSelectScOpt,
    })),
  );
  const [dropOpen, setDropOpen] = useState(false);

  // 선택된 경로당 표출 (activeSche 기준)
  useEffect(() => {
    if (activeSche) {
      const selectScs = activeSche.contentArea.split(',');
      if (selectScs.length > 0 && scheNodes.length > 0) {
        const allChildren = scheNodes[0].children.flatMap((p) => p.children);
        const matched = allChildren
          .filter((c) => selectScs.includes(c.value.split('/')[0]))
          .map((c) => c.value);
        setSelectScOpt(matched);
      }
    } else {
      setSelectScOpt([]);
    }
  }, [activeSche, scheNodes]);

  return (
    <StyledScForm>
      <StyledScFormNm>지역*</StyledScFormNm>
      <StyledScFormVal>
        <StyledScFormValBox>
          {scheMode === SCHE_MODE.READ && <StyledDisabled />}
          <TokenBox isOpen={dropOpen} setIsOpen={setDropOpen} />
          <TreeSelectBox isOpen={dropOpen} setIsOpen={setDropOpen} />
        </StyledScFormValBox>
      </StyledScFormVal>
    </StyledScForm>
  );
};

export default ScForm;

const StyledScForm    = styled.div`${CommonFormBox}`;
const StyledScFormNm  = styled.div`${CommonFormBoxNm}`;
const StyledScFormVal = styled.div`${CommonFormBoxVal}`;

const StyledScFormValBox = styled.div`
  width: 100%;
  position: relative;
`;

const StyledDisabled = styled.div`${CommonFormBoxValDisabled}`;
