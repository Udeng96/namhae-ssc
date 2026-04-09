import { useEffect, useState } from 'react';
import CheckboxTree from 'react-checkbox-tree';
import { useShallow } from 'zustand/react/shallow';
import { useCommonStore } from '@/component/stores/commonStore';
import { useFireStore } from '@/component/stores/fireStore';
import { WHOLE_OPTION } from '@/component/constants/eventCode';

const FireLastAreaCheck = () => {
  const areaNodes = useCommonStore((state) => state.areaNodes);
  const { lastFilter, setLastFilter } = useFireStore(
    useShallow((state) => ({
      lastFilter:    state.lastFilter,
      setLastFilter: state.actions.setLastFilter,
    })),
  );

  const [expand, setExpand]   = useState<string[]>([WHOLE_OPTION]);
  const [checked, setChecked] = useState<string[]>([]);

  useEffect(() => {
    setChecked(lastFilter.areaOpts);
  }, [lastFilter.areaOpts]);

  const childrenCnt = areaNodes[0]?.children?.length ?? 0;

  const handleChecked = (e: string[]) => {
    if (lastFilter.areaOpts.length === childrenCnt + 1) {
      if (e.length === 1 && e[0] === WHOLE_OPTION) {
        setLastFilter({ areaOpts: [] });
      } else {
        setLastFilter({ areaOpts: e.filter((item) => item !== WHOLE_OPTION) });
      }
    } else {
      if (e.length === childrenCnt) {
        setLastFilter({ areaOpts: [...e, WHOLE_OPTION] });
      } else {
        setLastFilter({ areaOpts: e });
      }
    }
  };

  return (
    <CheckboxTree
      id="fireLastAreaTree"
      nodes={areaNodes}
      checked={checked}
      expanded={expand}
      onCheck={(e) => handleChecked(e)}
      onExpand={(e) => setExpand(e)}
    />
  );
};

export default FireLastAreaCheck;
