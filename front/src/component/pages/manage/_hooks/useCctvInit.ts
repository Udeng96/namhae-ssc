import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useFacStore } from '../../../stores/facStore';
import { fetchCrimeCctvs, fetchScCctvs } from '../../../api/facApi';

/**
 * CCTV 목록 초기화 훅
 * - Event, Fac 등 여러 페이지에서 공통 사용
 * - ManageRoot에서 1회 호출
 */
export const useCctvInit = () => {
  const { setCrimeCctvs, setScCctvs } = useFacStore((state) => state.actions);

  const { data: crimeData } = useQuery({
    queryKey: ['cctv', 'crime'],
    queryFn: fetchCrimeCctvs,
    staleTime: Infinity,
  });

  const { data: scData } = useQuery({
    queryKey: ['cctv', 'sc'],
    queryFn: fetchScCctvs,
    staleTime: Infinity,
  });

  useEffect(() => {
    if (crimeData?.data) setCrimeCctvs(crimeData.data);
  }, [crimeData]);

  useEffect(() => {
    if (scData?.data) setScCctvs(scData.data);
  }, [scData]);
};
