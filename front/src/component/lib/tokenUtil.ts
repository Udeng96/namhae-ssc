import Cookies from 'js-cookie';
import { IS_DEV } from '@/component/constants/commonConst';

/**
 * sessionStorage 에서 token 관련 키로 간주할 이름 목록.
 *  - 백엔드(ViewController / LoginInterceptor) 가 수용하는 쿠키/세션 키와 동일
 *  - OMS 로그인 단계에서 `accessToken` 으로 심어지는 경우도 포함
 */
const TOKEN_ALIASES = ['token', 'TOKEN', '_TOKEN_', '_TO_KEN_', 'accessToken'] as const;

/** 표준화할 단일 키 (API·백엔드가 기대하는 이름) */
const CANONICAL_KEY = 'token';

/**
 * 현재 요청에 사용할 토큰을 반환한다.
 *
 * 우선순위 (운영 모드):
 *   1) 쿠키의 `token` = source of truth
 *        - 운영에서는 백엔드 ViewController.scMngView 가 페이지 진입 시 항상 쿠키를 심어준다.
 *        - 쿠키값을 그대로 반환하고, sessionStorage 는 쿠키에 맞춰 동기화한다.
 *          · sessionStorage 에 값이 있고 쿠키와 다르면 → 쿠키 값으로 덮어쓰기
 *          · sessionStorage 에 값이 없으면            → 쿠키 값을 저장
 *          · sessionStorage 가 쿠키와 일치하면         → 그대로 유지
 *        - 다른 variant 키(TOKEN/_TOKEN_/_TO_KEN_/accessToken) 는 정리
 *
 *   2) 쿠키가 없는 경우 → sessionStorage fallback
 *        - token 관련 키를 스캔해 가장 최근 삽입된 값을 최신으로 판정
 *        - 이전 키는 삭제하고 CANONICAL_KEY("token") 로 통합
 *        - 하나도 없으면 빈 문자열 (호출부에서 로그인 페이지로 이동)
 *
 * 개발 모드(IS_DEV): 백엔드가 토큰 검증을 skip 하므로 문자열 "token" 을 그대로 반환
 *   (원본 관례 유지 — 이 값이 실제로 어디서 검증되지 않음)
 *
 * Note: sessionStorage.key(i) 의 순서는 스펙상 구현정의이지만
 *       Chromium/Firefox/WebKit 모두 실질적으로 insertion order 를 보장한다.
 */
export const resolveToken = (): string => {
  if (IS_DEV) return 'token';

  // 1) 쿠키 = source of truth
  const cookieToken = Cookies.get(CANONICAL_KEY);
  if (cookieToken && cookieToken !== '') {
    const ssToken = sessionStorage.getItem(CANONICAL_KEY);
    if (ssToken !== cookieToken) {
      // 없거나 불일치 → 쿠키 값으로 덮어쓰기 (일치하면 setItem 하지 않음)
      sessionStorage.setItem(CANONICAL_KEY, cookieToken);
    }
    // 이전/중복 variant 키 정리
    TOKEN_ALIASES.filter((k) => k !== CANONICAL_KEY).forEach((k) =>
      sessionStorage.removeItem(k),
    );
    return cookieToken;
  }

  // 2) 쿠키 없음 → sessionStorage fallback
  const found: { key: string; value: string }[] = [];
  for (let i = 0; i < sessionStorage.length; i++) {
    const key = sessionStorage.key(i);
    if (!key) continue;
    if (!TOKEN_ALIASES.includes(key as typeof TOKEN_ALIASES[number])) continue;
    const value = sessionStorage.getItem(key);
    if (!value) continue;
    found.push({ key, value });
  }

  if (found.length === 0) return '';

  // 삽입 순서상 마지막 = 가장 최근(=최신)
  const latest = found[found.length - 1];

  // 최신을 제외한 이전 token 키만 삭제
  found.slice(0, -1).forEach((entry) => sessionStorage.removeItem(entry.key));

  // 최신 값이 canonical 키가 아니면 canonical 로 이관
  if (latest.key !== CANONICAL_KEY) {
    sessionStorage.removeItem(latest.key);
    sessionStorage.setItem(CANONICAL_KEY, latest.value);
  }

  return latest.value;
};
