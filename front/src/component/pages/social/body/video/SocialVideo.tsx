import styled from 'styled-components';
import { useRef } from 'react';
import { useSocialStore } from '@/component/stores/socialStore';
import { useShallow } from 'zustand/react/shallow';
import { SOCIAL_VIDEO_MENU } from '@/component/constants/socialConst';
import usePlaybackSelfHeal from '@/component/_hooks/usePlaybackSelfHeal';
import VideoYoutube, { YoutubePlayer } from './VideoYoutube';
import VideoSche from './VideoSche';
import VideoVms from './VideoVms';
import VideoLoading from './VideoLoading';

const SocialVideo = () => {
  const { activeVideo, videoLoaded } = useSocialStore(
    useShallow((s) => ({
      activeVideo: s.activeVideo,
      videoLoaded: s.videoLoaded,
    })),
  );

  const containerRef     = useRef<HTMLDivElement>(null);
  const youtubePlayerRef = useRef<YoutubePlayer | null>(null);

  // 멈춤 판정용 표본. 유튜브는 플레이어가, 스케줄·VMS 영상은 <video> 가 위치를 준다.
  usePlaybackSelfHeal(() => {
    const active = useSocialStore.getState().activeVideo;
    if (active === SOCIAL_VIDEO_MENU.NONE) return null;

    if (active === SOCIAL_VIDEO_MENU.YOUTUBE) {
      // 플레이어가 없으면(영상 전환 후 로드 실패 포함) 위치를 못 읽은 것으로 센다.
      const player = youtubePlayerRef.current;
      const videoId = player?.getVideoData?.()?.video_id;
      const position = player?.getCurrentTime?.();
      return {
        key: `${active}:${videoId ?? '-'}`,
        position: Number.isFinite(position) ? (position as number) : null,
      };
    }

    const video = containerRef.current?.querySelector('video');
    return {
      key: `${active}:${video?.currentSrc ?? '-'}`,
      position: video && Number.isFinite(video.currentTime) ? video.currentTime : null,
    };
  });

  return (
    <StyledVideo ref={containerRef}>
      {activeVideo === SOCIAL_VIDEO_MENU.YOUTUBE && (
        <VideoYoutube onPlayerChange={(p) => { youtubePlayerRef.current = p; }} />
      )}
      {activeVideo === SOCIAL_VIDEO_MENU.VIDEO      && <VideoSche />}
      {activeVideo === SOCIAL_VIDEO_MENU.VMS_VIDEO  && <VideoVms />}

      {/* 조회가 끝나기 전까지만. 끝난 뒤에도 표출할 영상이 없으면 기존처럼 빈 화면 */}
      {activeVideo === SOCIAL_VIDEO_MENU.NONE && !videoLoaded && <VideoLoading />}
    </StyledVideo>
  );
};

export default SocialVideo;

const StyledVideo = styled.div`
  width: 100%;
  height: 481px;
`;
