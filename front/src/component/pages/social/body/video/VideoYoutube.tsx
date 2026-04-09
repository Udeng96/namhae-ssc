import styled from 'styled-components';
import { useSocialStore } from '@/component/stores/socialStore';
import { useShallow } from 'zustand/react/shallow';
import YouTube, { YouTubeEvent } from 'react-youtube';
import { useEffect, useState } from 'react';
import { SOCIAL_VIDEO_MENU } from '@/component/constants/socialConst';
import { useMutation } from '@tanstack/react-query';
import { updateYoutubeErr } from '@/component/api/socialApi';

const VideoYoutube = () => {
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
      loop:     1,
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

  const handleErr = (e: YouTubeEvent) => {
    const errCode = e.data;
    const videoId = youtubes[activeIndex].videoId;
    if (errCode === 150) {
      console.log('youtube err :: 150 error (videoId :' + videoId + ')');
      updateErrMutation.mutate(videoId);
    } else {
      console.log('youtube err :: other error (error:', errCode + ')');
    }
  };

  const handleEnd = () => {
    if (activeIndex === youtubes.length - 1) {
      setActiveIndex(0);
      if      (videos.length > 0)    setActiveVideo(SOCIAL_VIDEO_MENU.VIDEO);
      else if (vmsVideos.length > 0) setActiveVideo(SOCIAL_VIDEO_MENU.VMS_VIDEO);
    } else {
      setActiveIndex(activeIndex + 1);
    }
  };

  const handleBuffer = (e: YouTubeEvent) => {
    if (e.data === 3) setIsBuffer(true);
  };

  const updateErrMutation = useMutation(updateYoutubeErr, {
    onSuccess: (data) => {
      if (data) setYoutubes(data.data);
    },
  });

  return (
    <StyledYoutube>
      <StyledYoutubeBox>
        <YouTube
          videoId={youtubes[activeIndex].videoId}
          opts={opts}
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
