import { useEffect, useRef, useState } from 'react';
import { WS, BASE_URL, API } from '@/component/lib/urls';
import { SocketScheType } from '@/component/types/social';

const RECONNECT_INTERVAL = 10000;

/**
 * 동시 접속 분산 (thundering herd 방지).
 *
 * 남해군 경로당 230곳의 32인치 모니터가 같은 서버를 본다. 부팅 타이머가 같아
 * 아침에 한꺼번에 켜지고(2026-09-17 실측: 10:00 한 분 동안 107대), 서버 재기동이나
 * refresh 브로드캐스트 때는 200대 이상이 같은 순간에 몰린다.
 *
 * 기존에는 세 경로 모두 지연이 고정값이라 한 번 몰리면 계속 같은 박자로 재시도했다.
 * 각 단말이 서로 다른 시각에 붙도록 무작위 지연을 섞는다.
 */
/** reload 를 흩뿌리는 폭 (ms) — refresh 브로드캐스트 수신 시 */
const RELOAD_SPREAD = 30000;
/** 재연결·헬스체크 지연에 더하는 지터 폭 (ms) */
const RECONNECT_JITTER = 5000;

/** base ~ base+jitter 사이의 지연을 돌려준다 */
const withJitter = (base: number, jitter: number) =>
  base + Math.floor(Math.random() * jitter);

const useSocialWs = (): SocketScheType | null => {
  const [wsData, setWsData]   = useState<SocketScheType | null>(null);
  const wsRef                 = useRef<WebSocket | null>(null);
  const cleaningUpRef         = useRef(false);
  const isCheckingRef         = useRef(false);
  const timerRef              = useRef<ReturnType<typeof setTimeout> | null>(null);
  // reload 예약은 재연결/헬스체크 타이머와 분리한다.
  // 같은 ref 를 쓰면 지연 대기 중에 다른 타이머가 덮어써 예약을 놓칠 수 있다.
  const reloadTimerRef        = useRef<ReturnType<typeof setTimeout> | null>(null);

  /** 0 ~ RELOAD_SPREAD 사이로 흩뿌려 재로드를 예약한다 */
  const scheduleReload = (reason: string) => {
    if (reloadTimerRef.current) return;   // 이미 예약됐으면 중복 예약하지 않는다
    const delay = Math.floor(Math.random() * RELOAD_SPREAD);
    console.log(`Social WS :: ${reason} — ${Math.round(delay / 1000)}초 후 재로드`);
    reloadTimerRef.current = setTimeout(() => window.location.reload(), delay);
  };

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
          // 전 단말이 같은 순간 reload 하면 서버에 요청이 한꺼번에 몰린다.
          // 0~30초 사이로 흩어서 재접속한다.
          scheduleReload('refresh 수신');
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
        // 최초 연결 실패 → 10초(+지터) 후 재시도
        timerRef.current = setTimeout(connect, withJitter(RECONNECT_INTERVAL, RECONNECT_JITTER));
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
            // 서버 복구는 전 단말이 동시에 감지한다. reload 도 흩뿌린다.
            scheduleReload('서버 복구 감지');
          } else {
            connect();
          }
          return;
        }
      } catch {
        serverWasDown = true;
      }
      timerRef.current = setTimeout(loop, withJitter(RECONNECT_INTERVAL, RECONNECT_JITTER));
    };

    loop();
  };

  useEffect(() => {
    connect();
    return () => {
      cleaningUpRef.current = true;
      if (timerRef.current) clearTimeout(timerRef.current);
      if (reloadTimerRef.current) clearTimeout(reloadTimerRef.current);
      wsRef.current?.close(1000, 'unmount');
      wsRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return wsData;
};

export default useSocialWs;
