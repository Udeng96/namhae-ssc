import { useEffect, useState } from 'react';
import CheckboxTree from 'react-checkbox-tree';
import { useShallow } from 'zustand/react/shallow';
import { useCommonStore } from '@/component/stores/commonStore';
import { useFacStore } from '@/component/stores/facStore';
import { WHOLE_OPTION } from '@/component/constants/eventCode';

const FacAreaCheck = () => {
  const areaNodes = useCommonStore((state) => state.areaNodes);
  const { areaOpts, setAreaOpts } = useFacStore(
    useShallow((state) => ({
      areaOpts:    state.areaOpts,
      setAreaOpts: state.actions.setAreaOpts,
    })),
  );

  const [expand, setExpand] = useState<string[]>([WHOLE_OPTION]);
  const [checked, setChecked] = useState<string[]>([]);

  // areaNodes 로드 시 초기 '전체/all' 단독 상태를 전체 자식 + WHOLE_OPTION으로 보정
  useEffect(() => {
    const children = areaNodes[0]?.children ?? [];
    if (children.length > 0 && areaOpts.length === 1 && areaOpts[0] === WHOLE_OPTION) {
      setAreaOpts([...children.map((n) => n.value), WHOLE_OPTION]);
    }
  }, [areaNodes]);

  useEffect(() => {
    setChecked(areaOpts);
  }, [areaOpts]);

  const childrenCnt = areaNodes[0]?.children?.length ?? 0;

  const handleChecked = (e: string[]) => {
    if (areaOpts.length === childrenCnt + 1) {
      if (e.length === 1 && e[0] === WHOLE_OPTION) {
        setAreaOpts([]);
      } else {
        setAreaOpts(e.filter((item) => item !== WHOLE_OPTION));
      }
    } else {
      if (e.length === childrenCnt) {
        setAreaOpts([...e, WHOLE_OPTION]);
      } else {
        setAreaOpts(e);
      }
    }
  };

  return (
    <CheckboxTree
      id="facAreaTree"
      nodes={areaNodes}
      checked={checked}
      expanded={expand}
      onCheck={(e) => handleChecked(e)}
      onExpand={(e) => setExpand(e)}
    />
  );
};

export default FacAreaCheck;
