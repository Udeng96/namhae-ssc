import { useIsFetching } from '@tanstack/react-query';
import { useFacStore } from '@/component/stores/facStore';
import FacSkeleton from './FacSkeleton';
import FacNone from './FacNone';
import FacDefault from './FacDefault';

const FacListBoxBody = () => {
  const facList = useFacStore((state) => state.facList);
  const isFetching = useIsFetching({ queryKey: ['facList'] }) > 0;

  if (isFetching) return <FacSkeleton />;
  if (facList.length === 0) return <FacNone />;
  return <FacDefault facs={facList} />;
};

export default FacListBoxBody;
