import { useEffect, useState } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { WS } from '@/component/lib/urls';
import { useFireStore } from '@/component/stores/fireStore';
import { EventSocketItem } from '@/component/types/event';

/**
 * 소방 WebSocket 훅
 * - procSt === "4" 필터 유지 (소방공유된 이벤트만 수신)
 * - isFireSocketOn 이 false 이면 소켓 연결을 닫는다
 */
const useFireEventWs = (isFireSocketOn: boolean) => {
  const [readyState, setReadyState] = useState<number>(3);
  const [fireSocket, setFireSocket] = useState<WebSocket | null>(null);

  const { setWsEvent, setIsFireAlarm } = useFireStore(
    useShallow((state) => ({
      setWsEvent:     state.actions.setWsEvent,
      setIsFireAlarm: state.actions.setIsFireAlarm,
    })),
  );

  const initializeWebSocket = () => {
    const ws = new WebSocket(WS.EVENT);

    ws.onopen = () => {
      console.log('open fire event websocket');
      setReadyState(1);
    };

    ws.onmessage = (e) => {
      try {
        const eventData = JSON.parse(e.data);
        if (!Object.prototype.hasOwnProperty.call(eventData, 'type')) {
          const event = eventData as EventSocketItem;
          // 핵심: procSt === "4" (소방공유) 필터
          if (event.procSt === '4') {
            setWsEvent(event);
            if (event.statEvetCd === '02') setIsFireAlarm(true);
          }
        } else {
          setWsEvent(null);
        }
      } catch (err) {
        console.warn('Fire WebSocket message parse error:', err);
      }
    };

    ws.onerror = (err) => {
      console.log('error on fire event websocket:', err);
      ws?.close(1000, 'auto close');
      setFireSocket(null);
      setReadyState(3);
    };

    ws.onclose = () => {
      console.info('close fire event websocket');
      setFireSocket(null);
      setReadyState(3);
    };

    setFireSocket(ws);
  };

  useEffect(() => {
    // 소켓 켜기
    if (!fireSocket && isFireSocketOn) {
      initializeWebSocket();
    }

    // 소켓 끄기
    if (fireSocket && !isFireSocketOn) {
      fireSocket.close();
      setFireSocket(null);
      setReadyState(3);
    }

    // 언마운트 클린업
    return () => {
      if (fireSocket && readyState === WebSocket.OPEN) {
        fireSocket.close();
      }
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFireSocketOn]);
};

export default useFireEventWs;
