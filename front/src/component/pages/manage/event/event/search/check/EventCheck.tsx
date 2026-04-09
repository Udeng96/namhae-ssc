import { useEffect, useState } from 'react';
import CheckboxTree from 'react-checkbox-tree';
import { useShallow } from 'zustand/react/shallow';
import { useCommonStore } from '@/component/stores/commonStore';
import { useEventStore } from '@/component/stores/eventStore';
import { WHOLE_OPTION } from '@/component/constants/eventCode';

const EventCheck = () => {
  const eventNodes = useCommonStore((state) => state.eventNodes);
  const { currentFilter, setCurrentFilter } = useEventStore(
    useShallow((state) => ({
      currentFilter:    state.currentFilter,
      setCurrentFilter: state.actions.setCurrentFilter,
    })),
  );

  const [expand, setExpand] = useState<string[]>([WHOLE_OPTION]);
  const [checked, setChecked] = useState<string[]>([]);

  useEffect(() => {
    setChecked(currentFilter.typeOpts);
  }, [currentFilter.typeOpts]);

  const childrenCnt = eventNodes[0]?.children?.length ?? 0;

  const handleChecked = (e: string[]) => {
    if (currentFilter.typeOpts.length === childrenCnt + 1) {
      if (e.length === 1 && e[0] === WHOLE_OPTION) {
        setCurrentFilter({ typeOpts: [] });
      } else {
        setCurrentFilter({ typeOpts: e.filter((item) => item !== WHOLE_OPTION) });
      }
    } else {
      if (e.length === childrenCnt) {
        setCurrentFilter({ typeOpts: [...e, WHOLE_OPTION] });
      } else {
        setCurrentFilter({ typeOpts: e });
      }
    }
  };

  return (
    <CheckboxTree
      id="eventTree"
      nodes={eventNodes}
      checked={checked}
      expanded={expand}
      onCheck={(e) => handleChecked(e)}
      onExpand={(e) => setExpand(e)}
    />
  );
};

export default EventCheck;
