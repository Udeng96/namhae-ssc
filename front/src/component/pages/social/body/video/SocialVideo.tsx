import styled from 'styled-components';
import { useSocialStore } from '@/component/stores/socialStore';
import { SOCIAL_VIDEO_MENU } from '@/component/constants/socialConst';
import VideoYoutube from './VideoYoutube';
import VideoSche from './VideoSche';
import VideoVms from './VideoVms';

const SocialVideo = () => {
  const activeVideo = useSocialStore((s) => s.activeVideo);

  return (
    <StyledVideo>
      {activeVideo === SOCIAL_VIDEO_MENU.YOUTUBE    && <VideoYoutube />}
      {activeVideo === SOCIAL_VIDEO_MENU.VIDEO      && <VideoSche />}
      {activeVideo === SOCIAL_VIDEO_MENU.VMS_VIDEO  && <VideoVms />}
    </StyledVideo>
  );
};

export default SocialVideo;

const StyledVideo = styled.div`
  width: 100%;
  height: 481px;
`;
