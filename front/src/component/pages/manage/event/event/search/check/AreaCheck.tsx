import { useEffect, useState } from 'react';
import CheckboxTree from 'react-checkbox-tree';
import { useShallow } from 'zustand/react/shallow';
import { useCommonStore } from '@/component/stores/commonStore';
import { useEventStore } from '@/component/stores/eventStore';
import { WHOLE_OPTION } from '@/component/constants/eventCode';

const AreaCheck = () => {
  const areaNodes = useCommonStore((state) => state.areaNodes);
  const { currentFilter, setCurrentFilter } = useEventStore(
    useShallow((state) => ({
      currentFilter:    state.currentFilter,
      setCurrentFilter: state.actions.setCurrentFilter,
    })),
  );

  const [expand, setExpand] = useState<string[]>([WHOLE_OPTION]);
  const [checked, setChecked] = useState<string[]>([]);

  useEffect(() => {
    setChecked(currentFilter.areaOpts);
  }, [currentFilter.areaOpts]);

  const childrenCnt = areaNodes[0]?.children?.length ?? 0;

  const handleChecked = (e: string[]) => {
    if (currentFilter.areaOpts.length === childrenCnt + 1) {
      if (e.length === 1 && e[0] === WHOLE_OPTION) {
        setCurrentFilter({ areaOpts: [] });
      } else {
        setCurrentFilter({ areaOpts: e.filter((item) => item !== WHOLE_OPTION) });
      }
    } else {
      if (e.length === childrenCnt) {
        setCurrentFilter({ areaOpts: [...e, WHOLE_OPTION] });
      } else {
        setCurrentFilter({ areaOpts: e });
      }
    }
  };

  return (
    <CheckboxTree
      id="areaTree"
      nodes={areaNodes}
      checked={checked}
      expanded={expand}
      onCheck={(e) => handleChecked(e)}
      onExpand={(e) => setExpand(e)}
    />
  );
};

export default AreaCheck;
