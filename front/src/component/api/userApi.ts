import { apiClient, ApiResponse } from '../lib/apiClient';
import { API } from '../lib/urls';
import { InfoType, RoleType } from '../types/common';

const SYSTEM = {
  KEY: 'SSC',
  SECRET: '', // A trusted local server adapter must supply integration credentials.
} as const;

export const fetchUserInfo = (token: string): ApiResponse<InfoType> =>
  apiClient.get(API.USER.INFO, { params: { token } });

export const fetchRoles = (): ApiResponse<RoleType> =>
  apiClient.get(API.USER.ROLE);

export const fetchLogout = (token: string): ApiResponse<string> =>
  apiClient.post(API.USER.LOGOUT, null, {
    headers: { systemKey: SYSTEM.KEY, secret: SYSTEM.SECRET },
    params: { token },
  });

/**
 * OMS 토큰 keep-alive.
 * - 서버 /user/tokenAlive → 내부적으로 OMS chkTokenAlive 호출
 * - OMS 캐시가 expireAfterAccess 30분 이므로 이 호출로 TTL 이 리셋된다
 * - 만료 시 401 → apiClient 인터셉터가 OMS 로그인으로 redirect
 */
export const chkTokenAlive = (token: string): ApiResponse<{ alive: boolean }> =>
  apiClient.get(API.USER.TOKEN_ALIVE, { params: { token } });
