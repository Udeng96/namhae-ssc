import { apiClient, ApiResponse } from '../lib/apiClient';
import { API } from '../lib/urls';
import {
  EventStatResult,
  FacStatResult,
  OperStatResult,
  UsageStatResult,
} from '../types/stat';

interface StatBaseParam {
  startDtm: string;
  endDtm: string;
  area: string;
}

// ─── 통계 ─────────────────────────────────────────────
export const fetchEventStat = (param: StatBaseParam): ApiResponse<EventStatResult> =>
  apiClient.get(API.STAT.EVENT, { params: param });

export const fetchFacStat = (param: StatBaseParam): ApiResponse<FacStatResult> =>
  apiClient.get(API.STAT.FAC, { params: param });

export const fetchOperStat = (param: StatBaseParam): ApiResponse<OperStatResult> =>
  apiClient.get(API.STAT.OPER, { params: param });

export const fetchUsageStat = (param: Omit<StatBaseParam, 'area'>): ApiResponse<UsageStatResult> =>
  apiClient.get(API.STAT.USAGE, { params: param });
