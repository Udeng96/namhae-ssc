import { useShallow } from 'zustand/react/shallow';
import { useIsFetching } from '@tanstack/react-query';
import { useEventStore } from '@/component/stores/eventStore';
import EventError from './EventError';
import EventSkeleton from './EventSkeleton';
import EventNone from './EventNone';
import EventSuccess from './success/EventSuccess';

/**
 * eventKey 패턴 제거 → React Query isFetching + eventList 상태로 단순화
 * - 로딩 중: Skeleton
 * - 목록 없음: None
 * - 목록 있음: Success
 * - 에러: Error (isError prop으로 외부 전달 가능하나 현재는 빈 목록을 에러로 처리하지 않음)
 */
const EventListBody = () => {
  const eventList = useEventStore((state) => state.eventList);
  const isFetching = useIsFetching({ queryKey: ['events', 'current'] }) > 0;

  if (isFetching) return <EventSkeleton />;
  if (eventList.length === 0) return <EventNone />;
  return <EventSuccess eventItems={eventList} />;
};

export default EventListBody;
