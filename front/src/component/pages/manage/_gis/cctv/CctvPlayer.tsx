import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import XeusGate from '@/assets/component/player/xeus.player.2.2.0';
import { WS } from '@/component/lib/urls';
import { CctvType } from '@/component/types/common';

const CctvPlayer = (props: { cctvInfo: CctvType | null }) => {
  const [player, setPlayer] = useState<any>(null);
  const playerId = 'VIDEO_PLAYER_' + props.cctvInfo?.mgtNo;
  const playerRef = useRef<HTMLDivElement>(null);
  const streamUrl = WS.STREAM_URL;

  // 언마운트 시 destroy
  useEffect(() => {
    return () => {
      if (player && player.destroy) player.destroy();
    };
  }, [player]);

  // cctvInfo 또는 playerId가 바뀔 때 destroy & 생성
  useEffect(() => {
    if (player && player.destroy) player.destroy();
    setPlayer(null);

    if (props.cctvInfo && playerRef.current) {
      setTimeout(() => {
        const xeusPlayer = new XeusGate.Player({
          playerId,
          url: streamUrl,
          userId: 'tester2',
          cctvMgrNo: props.cctvInfo!.mgtNo,
        });
        setPlayer(xeusPlayer);
      }, 30);
    }
  }, [props.cctvInfo, playerId]);

  return <StyledPlayer id={playerId} ref={playerRef} />;
};

export default CctvPlayer;

const StyledPlayer = styled.div`
  width: 100%;
  height: 100%;
`;
