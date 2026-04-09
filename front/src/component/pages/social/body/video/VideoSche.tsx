import styled from 'styled-components';
import { useSocialStore } from '@/component/stores/socialStore';
import { useShallow } from 'zustand/react/shallow';
import { useEffect, useState } from 'react';
import { SOCIAL_VIDEO_MENU } from '@/component/constants/socialConst';
import { API, BASE_URL } from '@/component/lib/urls';
import { SCHE_RESULT_TYPE } from '@/component/constants/scheConst';

const getVideoExt = (fileType: string) => {
  if (fileType.includes('quicktime')) return 'mov';
  if (fileType.includes('avi'))       return 'avi';
  if (fileType.includes('mp4'))       return 'mp4';
  return 'mp4';
};

const VideoSche = () => {
  const { videos, vmsVideos, youtubes, setActiveVideo } = useSocialStore(
    useShallow((s) => ({
      videos:        s.videos,
      vmsVideos:     s.vmsVideos,
      youtubes:      s.youtubes,
      setActiveVideo: s.actions.setActiveVideo,
    })),
  );

  const [activeIndex, setActiveIndex] = useState(0);
  const [isBuffer,    setIsBuffer]    = useState(false);
  const [timeoutId,   setTimeoutId]   = useState<NodeJS.Timeout | null>(null);

  const handleEnd = () => {
    if (activeIndex === videos.length - 1) {
      setActiveIndex(0);
      if      (vmsVideos.length > 0) setActiveVideo(SOCIAL_VIDEO_MENU.VMS_VIDEO);
      else if (youtubes.length > 0)  setActiveVideo(SOCIAL_VIDEO_MENU.YOUTUBE);
    } else {
      setActiveIndex(activeIndex + 1);
    }
  };

  const handleErr = () => {
    console.log('video err :: (videoId :' + videos[activeIndex].fileId + ')');
    handleEnd();
  };

  // 버퍼링 10초 타임아웃
  useEffect(() => {
    if (isBuffer) {
      const id = setTimeout(() => {
        console.log('video buffer :: (videoId : ' + videos[activeIndex]?.fileId + ')');
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

  if (videos.length === 0) return null;

  const current = videos[activeIndex];
  const ext     = getVideoExt(current.fileType);
  const fileNm  = current.fileNm.includes(ext)
    ? current.fileNm.replace('.' + ext, '')
    : current.fileNm;

  return (
    <StyledContentWrap>
      <video
        autoPlay
        src={`${BASE_URL}${API.SOCIAL.FILE(fileNm, ext, SCHE_RESULT_TYPE.CONTENT)}`}
        controls
        muted
        width="100%"
        height="100%"
        onEnded={handleEnd}
        onError={handleErr}
        onWaiting={() => setIsBuffer(true)}
        onStalled={() => setIsBuffer(true)}
        onPlay={() => setIsBuffer(false)}
        onPause={handleEnd}
      />
    </StyledContentWrap>
  );
};

export default VideoSche;

const StyledContentWrap = styled.div`
  width: 100%;
  height: 100%;
`;
