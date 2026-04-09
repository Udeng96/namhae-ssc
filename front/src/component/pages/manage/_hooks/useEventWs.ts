import { useEffect, useRef } from 'react';
import { WS, BASE_URL, API } from '@/component/lib/urls';
import { useEventStore } from '@/component/stores/eventStore';
import { EventSocketItem } from '@/component/types/event';

const MAX_RETRY = 99999;
const RECONNECT_INTERVAL = 10000;

const useEventWs = (isEventSocketOn: boolean) => {
  const setWsEvent       = useEventStore((state) => state.actions.setWsEvent);
  const setIsSocketAlarm = useEventStore((state) => state.actions.setIsSocketAlarm);
  const setIsFireAlarm   = useEventStore((state) => state.actions.setIsFireAlarm);

  const wsRef         = useRef<WebSocket | null>(null);
  const reconnectRef  = useRef(0);
  const isCheckingRef = useRef(false);
  const timerRef      = useRef<ReturnType<typeof setTimeout> | null>(null);
  const cleaningUpRef = useRef(false); // cleanup 중 onclose → health check 방지

  // ─── 헬스체크 루프 ─────────────────────────────────────────────
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

  // ─── WebSocket 초기화 ───────────────────────────────────────────
  const initWs = () => {
    const ws = new WebSocket(WS.EVENT);
    wsRef.current = ws;

    let wasConnected = false;

    ws.onopen = () => { reconnectRef.current = 0; wasConnected = true; };

    ws.onmessage = (e) => {
      try {
        const eventData = JSON.parse(e.data);
        if (!Object.prototype.hasOwnProperty.call(eventData, 'type')) {
          setWsEvent(eventData as EventSocketItem);
          const statEvetCd = eventData.statEvetCd;
          if (statEvetCd === '01') setIsSocketAlarm(true);
          if (statEvetCd === '02') setIsFireAlarm(true);
        } else {
          setWsEvent(null);
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
    if (!isEventSocketOn) {
      // 소켓 off: 의도적 종료 → health check 방지
      cleaningUpRef.current = true;
      if (timerRef.current) clearTimeout(timerRef.current);
      wsRef.current?.close();
      return;
    }

    // 소켓 on: 연결 시작
    cleaningUpRef.current = false;
    initWs();

    return () => {
      cleaningUpRef.current = true;
      if (timerRef.current) clearTimeout(timerRef.current);
      wsRef.current?.close();
    };
  }, [isEventSocketOn]);
};

export default useEventWs;
