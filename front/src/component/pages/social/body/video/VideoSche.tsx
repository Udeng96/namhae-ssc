import styled from 'styled-components';
import { useSocialStore } from '@/component/stores/socialStore';
import { useShallow } from 'zustand/react/shallow';
import { useLayoutEffect, useRef, useState } from 'react';
import { SOCIAL_VIDEO_MENU } from '@/component/constants/socialConst';
import { API, BASE_URL } from '@/component/lib/urls';
import { SCHE_RESULT_TYPE } from '@/component/constants/scheConst';
import { configureMediaCache, mediaKey, removeCachedMedia, warmCachedMedia, MediaVersionMismatch } from '@/component/lib/mediaCache';
import useCachedVideoSource from '@/component/_hooks/useCachedVideoSource';

const getVideoExt = (type: string) => type.includes('quicktime') ? 'mov' : type.includes('avi') ? 'avi' : type.includes('wmv') ? 'wmv' : 'mp4';

export default function VideoSche() {
  const { videos, vmsVideos, youtubes, policy, setActiveVideo } = useSocialStore(useShallow(s => ({
    videos: s.videos, vmsVideos: s.vmsVideos, youtubes: s.youtubes, policy: s.mediaCache,
    setActiveVideo: s.actions.setActiveVideo,
  })));
  const [activeIndex, setActiveIndex] = useState(0);
  const [cacheRetry, setCacheRetry] = useState(0);
  const [cycle, setCycle] = useState(0);
  const [failedCache, setFailedCache] = useState<Set<string>>(() => new Set());
  const ref = useRef<HTMLVideoElement>(null);
  const advanced = useRef('');
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const index = Math.min(activeIndex, Math.max(0, videos.length - 1));
  const file = videos[index];
  const key = file ? mediaKey(file) : '';
  const enabled = !!policy?.enabled && !failedCache.has(key);
  // Stable admission prevents videos evicting each other when a playlist exceeds capacity.
  const signature = videos.map(v => `${mediaKey(v)}:${v.sizeBytes}`).join('|');
  useLayoutEffect(() => { configureMediaCache(videos, policy); }, [signature, policy]);
  const ext = file ? getVideoExt(file.fileType) : '';
  const name = file?.fileNm.replace(new RegExp(`\\.${ext}$`, 'i'), '') ?? '';
  const direct = file ? `${BASE_URL}${API.SOCIAL.FILE(encodeURIComponent(name), ext, SCHE_RESULT_TYPE.CONTENT)}` : '';
  const token = `${index}:${direct}:${cycle}`;
  const source = useCachedVideoSource(file, direct, enabled, `${direct}:${cacheRetry}`);
  const clearTimer = () => { if (timer.current) clearTimeout(timer.current); timer.current = null; };
  useLayoutEffect(() => { clearTimer(); return clearTimer; }, [token]);
  const advance = () => {
    if (!file || advanced.current === token) return;
    // Preserve baseline single-item end/pause behavior; do not add a new auto-loop.
    if (videos.length === 1 && !vmsVideos.length && !youtubes.length) return;
    advanced.current = token; clearTimer(); setCycle(v => v + 1);
    if (index === videos.length - 1) {
      setActiveIndex(0);
      if (vmsVideos.length) setActiveVideo(SOCIAL_VIDEO_MENU.VMS_VIDEO);
      else if (youtubes.length) setActiveVideo(SOCIAL_VIDEO_MENU.YOUTUBE);
    } else setActiveIndex(index + 1);
  };
  const error = () => {
    clearTimer();
    if (source.cached && !failedCache.has(source.cacheKey)) {
      void removeCachedMedia(source.cacheKey);
      setFailedCache(previous => new Set([...Array.from(previous), source.cacheKey]));
      setCacheRetry(value => value + 1); return;
    }
    advance();
  };
  if (!file) return null;
  return <StyledContentWrap>
    <video
      ref={ref} autoPlay controls muted width="100%" height="100%"
      src={source.url || undefined} data-media-key={key} data-cycle={cycle}
      onEnded={advance} onError={error}
      onWaiting={() => { if (!timer.current) timer.current = setTimeout(advance, 10000); }}
      onStalled={() => { if (!timer.current) timer.current = setTimeout(advance, 10000); }}
      onPlaying={() => {
        clearTimer();
        if (enabled) void warmCachedMedia(file).catch(error => {
          if (error instanceof MediaVersionMismatch) useSocialStore.getState().actions.requestMediaRefresh();
        });
      }}
      onPause={event => {
        const video = event.currentTarget;
        // Ignore pause from ended, source replacement, or an unmounted player.
        queueMicrotask(() => {
          if (ref.current === video && video.isConnected && !video.ended && video.readyState >= 2 && video.currentSrc === source.url) advance();
        });
      }}
    />
  </StyledContentWrap>;
}
const StyledContentWrap = styled.div`width: 100%; height: 100%;`;
