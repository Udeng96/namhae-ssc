import { useEffect, useState } from 'react';
import CheckboxTree from 'react-checkbox-tree';
import { useShallow } from 'zustand/react/shallow';
import { useEventStore } from '@/component/stores/eventStore';
import { buildSmsTree } from '../SmsModal';

const TargetTree = () => {
  const { smsTargetRes, sms, setSms, openOpt } = useEventStore(
    useShallow((state) => ({
      smsTargetRes: state.smsTargetRes,
      sms:          state.sms,
      setSms:       state.actions.setSms,
      openOpt:      state.openOpt,
    })),
  );

  const [expanded, setExpanded] = useState<string[]>([]);

  // 모달 닫힐 때 expand 초기화
  useEffect(() => {
    if (openOpt === '') setExpanded([]);
  }, [openOpt]);

  const treeNodes = buildSmsTree(smsTargetRes);

  const handleCheck = (checked: string[]) => setSms({ selectedTargets: checked });

  return (
    <CheckboxTree
      id="smsTargetTree"
      nodes={treeNodes}
      checked={sms.selectedTargets}
      expanded={expanded}
      onCheck={handleCheck}
      onExpand={setExpanded}
    />
  );
};

export default TargetTree;
