import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { BASE_URL, BASE_URL_EXTERNAL, BASE_URL_MODULE } from './urls';

// ─── 기본 클라이언트 (ssc 서버) ───────────────────────
export const apiClient: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

// ─── 외부 클라이언트 (axis 등) ────────────────────────
export const externalClient: AxiosInstance = axios.create({
  baseURL: BASE_URL_EXTERNAL,
  timeout: 5000,
  headers: { 'Content-Type': 'application/json' },
});

// ─── 시설 모듈 클라이언트 ─────────────────────────────
export const moduleClient: AxiosInstance = axios.create({
  baseURL: BASE_URL_MODULE,
  timeout: 5000,
  headers: { 'Content-Type': 'application/json' },
});

// ─── 에러 처리 인터셉터 ───────────────────────────────
const addErrorInterceptor = (client: AxiosInstance) => {
  client.interceptors.response.use(
    (res) => res,
    (error) => {
      const status = error.response?.status;
      if (status === 401) {
        // 인증 만료 → 로그인 페이지로
        window.location.href = '/ssc/login';
      }
      return Promise.reject(error);
    },
  );
};

addErrorInterceptor(apiClient);
addErrorInterceptor(externalClient);
addErrorInterceptor(moduleClient);

// ─── 편의 헬퍼 타입 ───────────────────────────────────
export type ApiResponse<T> = Promise<AxiosResponse<T>>;
