import { useEffect, useState } from 'react';
import CheckboxTree from 'react-checkbox-tree';
import { useShallow } from 'zustand/react/shallow';
import { useEventStore } from '@/component/stores/eventStore';
import { buildBroadTree } from '../SmsModal';

const BroadTargetTree = () => {
  const { broadTargetRes, broadcast, setBroadcast, openOpt } = useEventStore(
    useShallow((state) => ({
      broadTargetRes: state.broadTargetRes,
      broadcast:      state.broadcast,
      setBroadcast:   state.actions.setBroadcast,
      openOpt:        state.openOpt,
    })),
  );

  const [expanded, setExpanded] = useState<string[]>([]);

  useEffect(() => {
    if (openOpt === '') setExpanded([]);
  }, [openOpt]);

  const treeNodes = buildBroadTree(broadTargetRes);

  const handleCheck = (checked: string[]) => setBroadcast({ selectedTargets: checked });

  return (
    <CheckboxTree
      id="broadTargetTree"
      nodes={treeNodes}
      checked={broadcast.selectedTargets}
      expanded={expanded}
      onCheck={handleCheck}
      onExpand={setExpanded}
    />
  );
};

export default BroadTargetTree;
