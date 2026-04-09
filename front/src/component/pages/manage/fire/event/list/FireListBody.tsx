import { useIsFetching } from '@tanstack/react-query';
import { useFireStore } from '@/component/stores/fireStore';
import FireSkeleton from './FireSkeleton';
import FireNone from './FireNone';
import FireSuccess from './success/FireSuccess';

const FireListBody = () => {
  const eventList  = useFireStore((state) => state.eventList);
  const isFetching = useIsFetching({ queryKey: ['fire', 'events', 'current'] }) > 0;

  if (isFetching)           return <FireSkeleton />;
  if (eventList.length === 0) return <FireNone />;
  return <FireSuccess eventItems={eventList} />;
};

export default FireListBody;
