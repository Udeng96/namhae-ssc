import { useEffect, useState } from 'react';
import CheckboxTree from 'react-checkbox-tree';
import { useShallow } from 'zustand/react/shallow';
import { useCommonStore } from '@/component/stores/commonStore';
import { useFireStore } from '@/component/stores/fireStore';
import { WHOLE_OPTION } from '@/component/constants/eventCode';

const FireLastEventCheck = () => {
  const eventNodes = useCommonStore((state) => state.eventNodes);
  const { lastFilter, setLastFilter } = useFireStore(
    useShallow((state) => ({
      lastFilter:    state.lastFilter,
      setLastFilter: state.actions.setLastFilter,
    })),
  );

  const [expand, setExpand]   = useState<string[]>([WHOLE_OPTION]);
  const [checked, setChecked] = useState<string[]>([]);

  useEffect(() => {
    setChecked(lastFilter.typeOpts);
  }, [lastFilter.typeOpts]);

  const childrenCnt = eventNodes[0]?.children?.length ?? 0;

  const handleChecked = (e: string[]) => {
    if (lastFilter.typeOpts.length === childrenCnt + 1) {
      if (e.length === 1 && e[0] === WHOLE_OPTION) {
        setLastFilter({ typeOpts: [] });
      } else {
        setLastFilter({ typeOpts: e.filter((item) => item !== WHOLE_OPTION) });
      }
    } else {
      if (e.length === childrenCnt) {
        setLastFilter({ typeOpts: [...e, WHOLE_OPTION] });
      } else {
        setLastFilter({ typeOpts: e });
      }
    }
  };

  return (
    <CheckboxTree
      id="fireLastEventTree"
      nodes={eventNodes}
      checked={checked}
      expanded={expand}
      onCheck={(e) => handleChecked(e)}
      onExpand={(e) => setExpand(e)}
    />
  );
};

export default FireLastEventCheck;
