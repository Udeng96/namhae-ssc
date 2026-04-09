import { apiClient, ApiResponse } from '../lib/apiClient';
import { API } from '../lib/urls';
import { ScheItem } from '../types/sche';

// ─── 스케줄 ───────────────────────────────────────────
export const fetchAllSchedules = (znCd: string): ApiResponse<ScheItem[]> =>
  apiClient.get(API.SCHE.LIST, {
    params: { znCd: znCd === 'all' ? '' : znCd },
  });

export const saveSchedule = (items: ScheItem[]): ApiResponse<unknown> =>
  apiClient.post(API.SCHE.SAVE, items);

export const editSchedule = (items: ScheItem[]): ApiResponse<unknown> =>
  apiClient.put(API.SCHE.EDIT, items);

export const deleteSchedule = (grpId: string): ApiResponse<unknown> =>
  apiClient.delete(API.SCHE.DELETE(grpId));
