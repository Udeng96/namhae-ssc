import styled from 'styled-components';
import { useSocialStore } from '@/component/stores/socialStore';
import { useShallow } from 'zustand/react/shallow';
import { useEffect, useState } from 'react';
import { SOCIAL_VIDEO_MENU } from '@/component/constants/socialConst';
import { API, BASE_URL } from '@/component/lib/urls';

const VideoVms = () => {
  const { vmsVideos, setActiveVideo, videos, youtubes } = useSocialStore(
    useShallow((s) => ({
      vmsVideos:     s.vmsVideos,
      setActiveVideo: s.actions.setActiveVideo,
      videos:        s.videos,
      youtubes:      s.youtubes,
    })),
  );

  const [activeIndex, setActiveIndex] = useState(0);
  const [isBuffer,    setIsBuffer]    = useState(false);
  const [timeoutId,   setTimeoutId]   = useState<NodeJS.Timeout | null>(null);

  const handleEnd = () => {
    if (activeIndex === vmsVideos.length - 1) {
      setActiveIndex(0);
      if      (youtubes.length > 0) setActiveVideo(SOCIAL_VIDEO_MENU.YOUTUBE);
      else if (videos.length > 0)   setActiveVideo(SOCIAL_VIDEO_MENU.VIDEO);
    } else {
      setActiveIndex(activeIndex + 1);
    }
  };

  const handleErr = () => {
    console.log('vms video err :: (seqn :' + vmsVideos[activeIndex]?.seqn + ')');
    handleEnd();
  };

  // 버퍼링 10초 타임아웃
  useEffect(() => {
    if (isBuffer) {
      const id = setTimeout(() => {
        console.log('vms video buffer :: (seqn : ' + vmsVideos[activeIndex]?.seqn + ')');
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

  return (
    <StyledVmsWrap>
      <video
        autoPlay
        src={`${BASE_URL}${API.SOCIAL.VMS_FILE(vmsVideos[activeIndex]?.seqn ?? '')}`}
        controls
        muted
        width="100%"
        height="100%"
        onEnded={handleEnd}
        onError={handleErr}
        onStalled={() => setIsBuffer(true)}
        onWaiting={() => setIsBuffer(true)}
        onPlay={() => setIsBuffer(false)}
        onPause={handleEnd}
      />
    </StyledVmsWrap>
  );
};

export default VideoVms;

const StyledVmsWrap = styled.div`
  width: 100%;
  height: 100%;
`;
