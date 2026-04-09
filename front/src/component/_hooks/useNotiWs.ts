import { useEffect, useRef, useState } from 'react';
import { WS } from '@/component/lib/urls';
import { SocketScheType } from '@/component/types/noti';

/**
 * 시니어센터 긴급공지 WebSocket 훅
 * - 구 NotiWs.tsx의 리팩 버전
 * - useRef로 소켓 관리 → 불필요한 리렌더링 방지
 */
const useNotiWs = (): SocketScheType | null => {
  const [wsData, setWsData] = useState<SocketScheType | null>(null);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const connect = () => {
      const socket = new WebSocket(WS.NOTI);

      socket.onmessage = (e) => {
        const content = JSON.parse(e.data);
        // 서버 ping/타입 메시지 제외
        if (!Object.prototype.hasOwnProperty.call(content, 'type')) {
          setWsData(content as SocketScheType);
        }
      };

      socket.onerror = () => {
        socket.close(1000, 'auto close');
        wsRef.current = null;
      };

      wsRef.current = socket;
    };

    connect();

    return () => {
      wsRef.current?.close(1000, 'unmount');
      wsRef.current = null;
    };
  }, []);

  return wsData;
};

export default useNotiWs;
