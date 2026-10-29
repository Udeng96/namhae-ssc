import { useEffect, useRef } from 'react';
import styled from 'styled-components';
import XeusGate from '@/assets/component/player/xeus.player.2.2.0';
import { WS } from '@/component/lib/urls';
import { CctvType } from '@/component/types/common';

const FacCctvPlayer = (props: { cctvInfo: CctvType | null }) => {
  const mgtNo     = props.cctvInfo?.mgtNo ?? '';
  const playerId  = 'Fac_Video_Player_' + mgtNo;
  const playerRef = useRef<HTMLDivElement>(null);
  const playerInstanceRef = useRef<any>(null);
  const streamUrl = WS.STREAM_URL;

  // mgtNo(primitive) 기준으로만 재생성 — cctvInfo 객체 참조가 바뀌어도
  // 실제 대상 CCTV 가 같으면 플레이어를 유지 (Reload 시 깜빡임 방지)
  useEffect(() => {
    // 이전 플레이어 정리
    if (playerInstanceRef.current?.destroy) {
      playerInstanceRef.current.destroy();
      playerInstanceRef.current = null;
    }

    if (!mgtNo) return;

    // DOM 이 id 로 준비된 직후에 붙어야 하므로 약간의 지연
    const t = setTimeout(() => {
      if (!playerRef.current) return;
      // @ts-ignore
      const xeusPlayer = new XeusGate.Player({
        playerId,
        url: streamUrl,
        cctvMgrNo: mgtNo,
        evtType: '119',
        userId: 'tester1',
        timestamp: '',
        debug: false,
        speed: '',
        codec: 'h264',
        rtsp: '',
      });
      playerInstanceRef.current = xeusPlayer;
    }, 30);

    // 언마운트 / mgtNo 변경 시 타이머 + 플레이어 정리
    return () => {
      clearTimeout(t);
      if (playerInstanceRef.current?.destroy) {
        playerInstanceRef.current.destroy();
        playerInstanceRef.current = null;
      }
    };
  }, [mgtNo]);

  return <StyledPlayer id={playerId} ref={playerRef} />;
};

export default FacCctvPlayer;

const StyledPlayer = styled.div`
  width: 100%;
  height: 100%;
`;
