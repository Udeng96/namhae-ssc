import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { BASE_URL, BASE_URL_EXTERNAL, BASE_URL_MODULE } from './urls';

// ─── 기본 클라이언트 (ssc 서버) ───────────────────────
// 원본(develop_2025)과 동일하게 timeout 없음(0 = 무제한).
// DB 쿼리가 수십초 걸리는 케이스(대량 이벤트/시설 조회)에서
// 짧은 timeout 걸면 클라이언트만 abort하고 서버는 계속 돌아서
// Network 탭에 canceled + 200이 뒤섞이는 현상 발생.
export const apiClient: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

// ─── 외부 클라이언트 (axis 등) ────────────────────────
// 외부 서버 연결 실패 시 무한대기 방지용 timeout 유지.
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
        // 인증 만료 → 만료된 토큰 제거 후 OMS 로그인 페이지로
        sessionStorage.removeItem('token');
        window.location.href = '/oms/login/goSysSelView';
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
