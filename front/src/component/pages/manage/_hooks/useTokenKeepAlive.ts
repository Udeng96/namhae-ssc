import { useEffect } from 'react';
import { chkTokenAlive } from '@/component/api/userApi';
import { resolveToken } from '@/component/lib/tokenUtil';
import { IS_DEV } from '@/component/constants/commonConst';

/**
 * /sc/mng 상주 중 OMS 세션 keep-alive.
 *
 * 배경:
 *   - OMS LoginCache 는 Guava CacheBuilder.expireAfterAccess(30분).
 *     마지막 접근 시점부터 30분 미사용 시 토큰 폐기.
 *   - 사용자가 /sc/mng 화면을 열어두고 조작이 없어도 30분 경과 시
 *     다음 API 호출이 401 → OMS 로그인으로 튕기는 버그가 있었다.
 *
 * 해결:
 *   - 15분 간격으로 /user/tokenAlive 를 호출한다.
 *     해당 API 는 내부에서 OMS chkTokenAlive 를 불러 캐시 access 를 유발
 *     → TTL 이 그 시점부터 30분으로 재설정된다.
 *   - 만료·네트워크 실패 시 apiClient 의 401 인터셉터가 로그인으로 redirect 하므로
 *     여기서는 별도 에러 처리를 하지 않는다(의도적 무시).
 *
 * 개발 모드(IS_DEV): OMS 실제 호출이 불필요하므로 스킵.
 */
const KEEP_ALIVE_INTERVAL_MS = 15 * 60 * 1000;

export const useTokenKeepAlive = () => {
  useEffect(() => {
    if (IS_DEV) return;

    const tick = () => {
      const token = resolveToken();
      if (!token) return;
      chkTokenAlive(token).catch(() => {
        /* 401 은 apiClient 인터셉터가 OMS 로그인으로 redirect 처리 */
      });
    };

    const id = window.setInterval(tick, KEEP_ALIVE_INTERVAL_MS);
    return () => window.clearInterval(id);
  }, []);
};
