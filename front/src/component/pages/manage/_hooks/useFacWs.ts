import { useEffect, useRef } from 'react';
import { useCommonStore } from '@/component/stores/commonStore';
import { useFacStore } from '@/component/stores/facStore';
import { WS, BASE_URL, API } from '@/component/lib/urls';
import { FacWsType } from '@/component/types/fac';
import { USER_TYPE } from '@/component/constants/user';

const MAX_RETRY = 99999;
const RECONNECT_INTERVAL = 10000;

export const useFacWs = () => {
  const userInfo = useCommonStore((state) => state.userInfo);
  const setWsData = useFacStore((state) => state.actions.setWsData);

  const wsRef          = useRef<WebSocket | null>(null);
  const reconnectRef   = useRef(0);
  const isCheckingRef  = useRef(false);
  const timerRef       = useRef<ReturnType<typeof setTimeout> | null>(null);
  const cleaningUpRef  = useRef(false); // cleanup 중 onclose → health check 방지

  // ─── 헬스체크 루프 (plain fetch, 리렌더 없음) ──────────────────
  const checkHealthLoop = async () => {
    if (isCheckingRef.current) return;
    isCheckingRef.current = true;

    while (reconnectRef.current++ <= MAX_RETRY) {
      try {
        const res = await fetch(`${BASE_URL}${API.HEALTH.CHECK}`);
        if (res.ok) { window.location.reload(); return; }
      } catch { /* 서버 미응답 무시 */ }

      await new Promise<void>((resolve) => {
        timerRef.current = setTimeout(resolve, RECONNECT_INTERVAL);
      });
    }
    isCheckingRef.current = false;
  };

  // ─── WebSocket 초기화 ──────────────────────────────────────────
  const initWs = () => {
    const ws = new WebSocket(WS.FAC);
    wsRef.current = ws;

    let wasConnected = false;

    ws.onopen = () => { reconnectRef.current = 0; wasConnected = true; };

    ws.onmessage = (e) => {
      try {
        const data = JSON.parse(e.data);
        if (!Object.prototype.hasOwnProperty.call(data, 'type')) {
          setWsData(data as FacWsType);
        }
      } catch { /* parse 오류 무시 */ }
    };

    ws.onerror = () => { ws.close(1000, 'auto close'); };

    // 연결된 적 있고, cleanup 중이 아닐 때만 health check
    ws.onclose = () => {
      wsRef.current = null;
      if (wasConnected && !cleaningUpRef.current) checkHealthLoop();
    };
  };

  useEffect(() => {
    if (!userInfo || userInfo.userType === USER_TYPE.SENIOR) return;
    initWs();
    return () => {
      cleaningUpRef.current = true;
      if (timerRef.current) clearTimeout(timerRef.current);
      wsRef.current?.close();
    };
  }, [userInfo]);
};
