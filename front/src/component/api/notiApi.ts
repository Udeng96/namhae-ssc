import { apiClient, ApiResponse } from '@/component/lib/apiClient';
import { API } from '@/component/lib/urls';
import { ScheduleResType } from '@/component/types/noti';

/** 시니어센터 공지 목록 조회 */
export const fetchNotices = (scMgtNo: string): ApiResponse<ScheduleResType> =>
  apiClient.get(API.NOTI.LIST(scMgtNo));

/** TV 점멸 제어 (긴급공지 종료 후 호출) */
export const turnTv = (scMgtNo: string) =>
  apiClient.post(API.NOTI.TV(scMgtNo));
