import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import XeusGate from '@/assets/component/player/xeus.player.2.2.0';
import { WS } from '@/component/lib/urls';
import { CctvType } from '@/component/types/common';

const FullCctvPlayer = (props: { cctvInfo: CctvType | null }) => {
  const PLAYER_ID_PREFIX = 'FULL_Video_Player_';
  const [player, setPlayer] = useState<any>(null);
  const playerId = PLAYER_ID_PREFIX + props.cctvInfo?.mgtNo;
  const playerRef = useRef<HTMLDivElement>(null);
  const streamUrl = WS.STREAM_URL;

  // 언마운트 시 destroy
  useEffect(() => {
    return () => {
      if (player && player.destroy) player.destroy();
    };
  }, [player]);

  // cctvInfo 변경 시 destroy & 재생성
  useEffect(() => {
    if (player && player.destroy) player.destroy();
    setPlayer(null);

    if (props.cctvInfo && playerRef.current) {
      setTimeout(() => {
        // @ts-ignore
        const xeusPlayer = new XeusGate.Player({
          playerId,
          url: streamUrl,
          cctvMgrNo: props.cctvInfo!.mgtNo,
          evtType: '112',
          userId: 'tester1',
          timestamp: '',
          debug: false,
          speed: '',
          codec: 'h264',
          rtsp: '',
        });
        setPlayer(xeusPlayer);
      }, 30);
    }
  }, [props.cctvInfo, playerId]);

  return <StyledPlayer id={playerId} ref={playerRef} />;
};

export default FullCctvPlayer;

const StyledPlayer = styled.div`
  width: 100%;
  height: 100%;
`;
