import { apiClient, ApiResponse } from '../lib/apiClient';
import { API } from '../lib/urls';
import { EventResult, EventParam } from '../types/event';

// ─── 소방 이벤트 목록 ─────────────────────────────────
export const fetchFireEventList = (param: EventParam): ApiResponse<EventResult> =>
  apiClient.get(API.FIRE.EVENT_LIST, { params: param });

// ─── 소방 PC 화상회의 URL ──────────────────────────────
export const fetchFireConfUrl = (param: {
  seqn: string;
  userId: string;
}): ApiResponse<string> =>
  apiClient.get(API.FIRE.CONF_INFO(param.seqn, param.userId));
