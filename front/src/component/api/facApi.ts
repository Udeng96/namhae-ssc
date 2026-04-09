import { apiClient, moduleClient, ApiResponse } from '../lib/apiClient';
import { API } from '../lib/urls';
import { ScFacType, FacParam } from '../types/fac';
import { CctvType } from '../types/common';

// ─── 시설 목록 ────────────────────────────────────────
export const fetchAllFac = (): ApiResponse<ScFacType[]> =>
  apiClient.get(API.FAC.LIST);

export const fetchFacList = (param: FacParam): ApiResponse<ScFacType[]> =>
  apiClient.get(API.FAC.LIST, { params: param });

// ─── CCTV ─────────────────────────────────────────────
export const fetchCrimeCctvs = (): ApiResponse<CctvType[]> =>
  apiClient.get(API.FAC.CCTV.CRIME);

export const fetchScCctvs = (): ApiResponse<CctvType[]> =>
  apiClient.get(API.FAC.CCTV.SC);

// ─── 시설 상태 (moduleClient 사용) ────────────────────
export const fetchFacState = (scId: string): ApiResponse<ScFacType> =>
  moduleClient.post(API.FAC.STATE(scId));
