import styled from 'styled-components';
import { useSocialStore } from '@/component/stores/socialStore';
import { useShallow } from 'zustand/react/shallow';
import YouTube, { YouTubeEvent } from 'react-youtube';
import { useEffect, useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import { SOCIAL_VIDEO_MENU } from '@/component/constants/socialConst';
import { useMutation } from '@tanstack/react-query';
import { updateYoutubeErr } from '@/component/api/socialApi';

/** 멈춤 판정(SocialVideo)과 되감김 감지가 위치를 읽는 데 쓰는 YT.Player 의 일부 */
export interface YoutubePlayer {
  getCurrentTime?: () => number;
  getDuration?: () => number;
  getVideoData?: () => { video_id?: string };
}

/** 되감김 감지 주기 (ms) */
const WRAP_CHECK_MS = 500;
/** 끝에서 이 시간(초) 안쪽까지 갔다가 처음으로 돌아오면 한 바퀴 돈 것으로 본다 */
const WRAP_NEAR_END_SEC = 2;

/**
 * 서버에 신고할 오류코드. 101 과 150 은 같은 뜻(소유자가 임베드 재생을 허용하지 않음)이다.
 * 나머지(2·5·100 등)는 단말 환경이나 일시 오류로도 나므로 신고하지 않고 넘기기만 한다.
 */
const EMBED_BLOCKED_ERROR_CODES = [101, 150];

/**
 * 이미 신고한 영상. 한 바퀴 돌 때마다 같은 영상을 다시 신고하지 않는다.
 * 유튜브 차례가 끝나면 이 컴포넌트가 언마운트되므로 ref 가 아니라 모듈 범위(페이지 세션)에 둔다.
 */
const reportedBlocked = new Set<string>();

interface Props {
  onPlayerChange?: (player: YoutubePlayer | null) => void;
}

const VideoYoutube = ({ onPlayerChange }: Props) => {
  const { youtubes, vmsVideos, videos, setActiveVideo, setYoutubes } = useSocialStore(
    useShallow((s) => ({
      youtubes:      s.youtubes,
      vmsVideos:     s.vmsVideos,
      videos:        s.videos,
      setActiveVideo: s.actions.setActiveVideo,
      setYoutubes:   s.actions.setYoutubes,
    })),
  );

  const [activeIndex, setActiveIndex] = useState(0);
  const [isBuffer,    setIsBuffer]    = useState(false);
  const [timeoutId,   setTimeoutId]   = useState<NodeJS.Timeout | null>(null);

  const opts = {
    height: '481',
    width:  '100%',
    playerVars: {
      autoplay: 1,
      mute:     1,
      rel:      0,
      // 다음 영상으로 넘기는 것은 onEnd·되감김 감지가 맡는다. 반복 재생은 쓰지 않는다.
      // (playlist 없이 1 을 줘도 반복되지 않는다 — YouTube 문서. 끝남 없이 반복되는 현상은
      //  이 값과 무관하게 발생했다. 아래 "되감김 감지" 참고)
      loop:     0,
      controls: 1,
    },
  };

  // 버퍼링 10초 타임아웃
  useEffect(() => {
    if (isBuffer) {
      const id = setTimeout(() => {
        console.log('youtube buffering ::');
        handleEnd();
      }, 10000);
      setTimeoutId(id);
    } else {
      if (timeoutId) {
        clearTimeout(timeoutId);
        setTimeoutId(null);
      }
    }
    return () => { if (timeoutId) clearTimeout(timeoutId); };
  }, [isBuffer]);

  // 목록이 갱신(150 에러 영상 제외)되면 activeIndex 가 범위를 벗어날 수 있다.
  const safeIndex = activeIndex < youtubes.length ? activeIndex : 0;
  const currentVideoId = youtubes[safeIndex]?.videoId;

  const playerRef    = useRef<YoutubePlayer | null>(null);
  const handleEndRef = useRef<() => void>(() => {});

  // 영상이 바뀌면 이전 플레이어는 곧 폐기된다. 새 플레이어가 준비(onReady)될 때까지 비워 둬야
  // 멈춤 판정이 죽은 플레이어의 위치를 읽지 않는다. 새 플레이어가 끝내 준비되지 않으면
  // (로드 실패) 비어 있는 상태가 이어지고, 그것도 멈춤으로 센다.
  useEffect(() => {
    playerRef.current = null;
    onPlayerChange?.(null);
  }, [currentVideoId]);

  // ─── 되감김 감지
  // 유튜브 플레이어가 끝남(onEnd) 없이 같은 영상을 처음부터 다시 트는 경우가 있다.
  // 브라우저 세션 단위로 발생하며(한 번 생기면 그 세션의 모든 영상이 그렇다), loop 값과
  // 무관했다. 그러면 첫 영상에서 다음으로 넘어가지 못해 그 영상 하나만 하루 종일 반복되고,
  // 새로고침하면 대개 정상으로 돌아온다. 끝 근처까지 갔던 위치가 앞으로 돌아오면 끝난
  // 것으로 보고 넘긴다.
  useEffect(() => {
    let last = -1;
    const id = setInterval(() => {
      const player = playerRef.current;
      if (!player) { last = -1; return; }
      const t = player.getCurrentTime?.();
      const d = player.getDuration?.();
      if (!Number.isFinite(t) || !Number.isFinite(d) || !(d! > 0)) return;

      if (last >= d! - WRAP_NEAR_END_SEC && t! < last - WRAP_NEAR_END_SEC) {
        console.log('youtube :: 끝남 없이 처음으로 되감김 — 다음 영상으로 (videoId :' + currentVideoId + ')');
        last = -1;
        handleEndRef.current();
        return;
      }
      last = t!;
    }, WRAP_CHECK_MS);
    return () => clearInterval(id);
  }, [currentVideoId]);

  useEffect(() => () => onPlayerChange?.(null), []);

  // 신고 후 목록을 다시 받으면 이 영상의 자리로 옮긴다 (handleErr 참고)
  const resumeVideoIdRef = useRef<string | null>(null);

  const handleErr = (e: YouTubeEvent) => {
    const errCode = e.data;
    const videoId = youtubes[safeIndex]?.videoId;
    if (EMBED_BLOCKED_ERROR_CODES.includes(errCode)) {
      console.log('youtube err :: ' + errCode + ' error (videoId :' + videoId + ')');
      if (videoId && !reportedBlocked.has(videoId)) {
        reportedBlocked.add(videoId);
        // 아래 handleEnd 가 다음 영상으로 넘긴다. 신고 응답으로 목록이 바뀌면 에러 영상이
        // 빠지면서 순번이 한 칸씩 당겨지므로, 인덱스가 아니라 영상으로 자리를 기억해 둔다.
        const isLast = safeIndex === youtubes.length - 1;
        resumeVideoIdRef.current = isLast ? null : youtubes[safeIndex + 1]?.videoId ?? null;
        updateErrMutation.mutate(videoId);
      }
    } else {
      console.log('youtube err :: other error (error:', errCode + ')');
    }
    // 재생 불가 영상에서 멈추지 않도록 즉시 다음 순서로 넘긴다.
    // (VideoSche / VideoVms 와 동일한 동작. 이전에는 버퍼링 10초 타임아웃이
    //  우연히 걸릴 때만 빠져나올 수 있었고, 버퍼 이벤트가 없으면 영구 정지했다.)
    handleEnd();
  };

  const handleEnd = () => {
    if (safeIndex === youtubes.length - 1) {
      setActiveIndex(0);
      if      (videos.length > 0)    setActiveVideo(SOCIAL_VIDEO_MENU.VIDEO);
      else if (vmsVideos.length > 0) setActiveVideo(SOCIAL_VIDEO_MENU.VMS_VIDEO);
    } else {
      setActiveIndex(safeIndex + 1);
    }
  };

  handleEndRef.current = handleEnd;

  const handleBuffer = (e: YouTubeEvent) => {
    if (e.data === 3) setIsBuffer(true);
  };

  const updateErrMutation = useMutation(updateYoutubeErr, {
    onSuccess: (data) => {
      if (!data) return;
      const list = data.data ?? [];

      // 넘어가 있던 영상이 새 목록에도 있으면 그 자리에서 이어간다.
      // (예전에는 인덱스를 그대로 둬서, 당겨진 목록에서 영상 하나를 건너뛰었다)
      const resumeId = resumeVideoIdRef.current;
      resumeVideoIdRef.current = null;
      const idx = resumeId ? list.findIndex((v) => v.videoId === resumeId) : -1;

      // 목록(스토어)과 인덱스를 한 번의 렌더로 바꾼다. 따로 렌더되면 그 사이 엉뚱한 영상으로
      // 한 번 바뀌어 플레이어가 두 번 재생성된다.
      flushSync(() => {
        setYoutubes(list);
        if (idx >= 0) setActiveIndex(idx);
      });
    },
  });

  // 150 에러로 목록이 모두 빠지면 렌더 중 undefined 참조로 화면이 깨진다.
  if (youtubes.length === 0) return null;

  return (
    <StyledYoutube>
      <StyledYoutubeBox>
        <YouTube
          videoId={youtubes[safeIndex].videoId}
          opts={opts}
          onReady={(e: YouTubeEvent) => { playerRef.current = e.target; onPlayerChange?.(e.target); }}
          onEnd={handleEnd}
          onError={handleErr}
          onStateChange={handleBuffer}
          onPlay={() => setIsBuffer(false)}
        />
      </StyledYoutubeBox>
    </StyledYoutube>
  );
};

export default VideoYoutube;

const StyledYoutube = styled.div`
  width: 100%;
  height: 100%;
`;

const StyledYoutubeBox = styled.div`
  background-color: #000;
`;
