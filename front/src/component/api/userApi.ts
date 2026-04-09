import { apiClient, ApiResponse } from '../lib/apiClient';
import { API } from '../lib/urls';
import { InfoType, RoleType } from '../types/common';

const SYSTEM = {
  KEY: 'SSC',
  SECRET: '4oj4pFpEkM9b2WP4nVBmwI',
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
