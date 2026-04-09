import { useEffect, useRef, useState } from 'react';
import { WS, BASE_URL, API } from '@/component/lib/urls';
import { SocketScheType } from '@/component/types/social';

const RECONNECT_INTERVAL = 10000;

const useSocialWs = (): SocketScheType | null => {
  const [wsData, setWsData]   = useState<SocketScheType | null>(null);
  const wsRef                 = useRef<WebSocket | null>(null);
  const cleaningUpRef         = useRef(false);
  const isCheckingRef         = useRef(false);
  const timerRef              = useRef<ReturnType<typeof setTimeout> | null>(null);

  const connect = () => {
    if (cleaningUpRef.current) return;
    const socket = new WebSocket(WS.SOCIAL);
    let wasConnected = false;

    socket.onopen = () => {
      wasConnected = true;
      console.log('Social WebSocket Connected');
    };

    socket.onmessage = (event) => {
      try {
        const content = JSON.parse(event.data);
        if (Object.prototype.hasOwnProperty.call(content, 'type')) return;

        const scheData = content as SocketScheType;

        if (
          scheData.message.contentTitle === 'refresh' &&
          scheData.message.contentCntn  === 'refresh'
        ) {
          window.location.reload();
          return;
        }

        if (scheData.message.contentTitle.includes('회의 종료')) return;

        setWsData(scheData);
      } catch (e) {
        console.warn('Social WS parse error:', e);
      }
    };

    socket.onerror = () => {
      console.error('Social WebSocket Error');
      socket.close();
    };

    socket.onclose = () => {
      wsRef.current = null;
      if (cleaningUpRef.current) return;

      if (wasConnected) {
        // 연결됐다 끊긴 경우 → 헬스체크로 서버 상태 판단
        checkHealthLoop();
      } else {
        // 최초 연결 실패 → 10초 후 재시도
        timerRef.current = setTimeout(connect, RECONNECT_INTERVAL);
      }
    };

    wsRef.current = socket;
  };

  // 서버 헬스체크:
  // - 서버가 살아있으면 → WS만 재연결 (reload 없음)
  // - 서버가 다운됐다 복구되면 → reload (데이터 갱신)
  const checkHealthLoop = () => {
    if (isCheckingRef.current) return;
    isCheckingRef.current = true;
    let serverWasDown = false;

    const loop = async () => {
      if (cleaningUpRef.current) { isCheckingRef.current = false; return; }
      try {
        const res = await fetch(`${BASE_URL}${API.HEALTH.CHECK}`);
        if (res.ok) {
          isCheckingRef.current = false;
          if (serverWasDown) {
            window.location.reload();
          } else {
            connect();
          }
          return;
        }
      } catch {
        serverWasDown = true;
      }
      timerRef.current = setTimeout(loop, RECONNECT_INTERVAL);
    };

    loop();
  };

  useEffect(() => {
    connect();
    return () => {
      cleaningUpRef.current = true;
      if (timerRef.current) clearTimeout(timerRef.current);
      wsRef.current?.close(1000, 'unmount');
      wsRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return wsData;
};

export default useSocialWs;
