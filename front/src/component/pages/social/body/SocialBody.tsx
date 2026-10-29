import styled from 'styled-components';
import SocialVideo from './video/SocialVideo';
import { configureMediaCache } from '@/component/lib/mediaCache';
import SocialPhoto from './photo/SocialPhoto';
import { useQuery } from '@tanstack/react-query';
import {
  fetchSchedules, fetchVms, fetchWeather, fetchYoutube,
} from '@/component/api/socialApi';
import { useSocialStore } from '@/component/stores/socialStore';
import { useShallow } from 'zustand/react/shallow';
import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { SOCIAL_PHOTO_MENU, SOCIAL_VIDEO_MENU } from '@/component/constants/socialConst';
import { SocialFileType } from '@/component/types/social';

/** 1시간 주기 (ms) */
const ONE_HOUR = 3600000;

/**
 * 영상 조회가 이 시간을 넘겨도 안 끝나면 화면을 한 번 재로드한다.
 * 재시도는 react-query 가 계속 하므로 보통 여기까지 오지 않는다.
 * 프론트 상태가 꼬인 경우에 대비한 안전망이며, 세션당 1회만 수행한다.
 */
const LOADING_RELOAD_MS = 60000;

/** 재로드를 이미 했는지 표시 — 서버가 계속 죽어있을 때 새로고침이 반복되지 않게 한다 */
const RELOADED_KEY = 'socialVideoReloaded';

/** 조회 실패 시 재시도 간격 — 2초부터 두 배씩, 최대 30초 */
const VIDEO_QUERY_RETRY = {
  retry: true as const,
  retryDelay: (attempt: number) => Math.min(30000, 2000 * 2 ** attempt),
};

const SocialBody = () => {
  const {
    setWeather,
    setActivePhoto,
    setActiveVideo,
    activePhoto,
    activeVideo,
    setVideos,
    setPhotos,
    setNorms,
    setEmers,
    setVmsPhotos,
    setVmsVideos,
    setYoutubes,
    scheSocketData,
    setScheSocketData,
    vmsPhotos,
    photos,
    videoLoaded,
    setVideoLoaded,
  } = useSocialStore(
    useShallow((s) => ({
      setWeather:       s.actions.setWeather,
      setActivePhoto:   s.actions.setActivePhoto,
      setActiveVideo:   s.actions.setActiveVideo,
      activePhoto:      s.activePhoto,
      activeVideo:      s.activeVideo,
      setVideos:        s.actions.setVideos,
      setPhotos:        s.actions.setPhotos,
      setNorms:         s.actions.setNorms,
      setEmers:         s.actions.setEmers,
      setVmsPhotos:     s.actions.setVmsPhotos,
      setVmsVideos:     s.actions.setVmsVideos,
      setYoutubes:      s.actions.setYoutubes,
      scheSocketData:   s.scheSocketData,
      setScheSocketData: s.actions.setScheSocketData,
      vmsPhotos:        s.vmsPhotos,
      photos:           s.photos,
      videoLoaded:      s.videoLoaded,
      setVideoLoaded:   s.actions.setVideoLoaded,
    })),
  );

  const lastPath  = useLocation().pathname.split('/').filter(Boolean).pop() ?? '';
  const vmsPhotosRef  = useRef(vmsPhotos);
  const activePhotoRef = useRef(activePhoto);
  const activeVideoRef = useRef(activeVideo);

  // ref 최신값 동기화
  useEffect(() => { vmsPhotosRef.current  = vmsPhotos;  }, [vmsPhotos]);
  useEffect(() => { activePhotoRef.current = activePhoto; }, [activePhoto]);
  useEffect(() => { activeVideoRef.current = activeVideo; }, [activeVideo]);

  const mediaRefresh = useSocialStore(s => s.mediaRefresh);
  useEffect(() => { if (mediaRefresh > 0) refetchSchedules(); }, [mediaRefresh]);

  // ─── 날씨 (staleTime Infinity)
  const { data: weather } = useQuery(
    ['weatherInfo'],
    () => fetchWeather(),
    { staleTime: Infinity },
  );

  // ─── 스케줄 — WS 수신 시 refetch + 1시간마다 자동 갱신
  const { data: schedules, refetch: refetchSchedules, isFetched: schedulesFetched } = useQuery(
    ['socialSchedules', lastPath],
    () => fetchSchedules(lastPath),
    {
      enabled:         !!lastPath,
      refetchInterval: ONE_HOUR,
      ...VIDEO_QUERY_RETRY,
    },
  );

  // ─── VMS — 1시간마다 자동 갱신
  const { data: vms } = useQuery(
    ['socialVms'],
    () => fetchVms(),
    { refetchInterval: ONE_HOUR },
  );

  // ─── YouTube (staleTime Infinity)
  const { data: youtube, isFetched: youtubeFetched } = useQuery(
    ['youtube'],
    () => fetchYoutube(),
    { staleTime: Infinity, ...VIDEO_QUERY_RETRY },
  );

  // ─── 로딩 표시 종료 판정
  //
  // activeVideo 가 NONE 인 상태는 "아직 불러오는 중"과 "표출할 영상이 없음" 둘 다라서,
  // 로딩 표시는 videoLoaded 로만 구분한다. 한 번 true 가 되면 다시 false 로 돌아가지 않는다.
  //
  // 무한 표시 방지:
  //   ① isFetched 는 성공/실패 무관하게 조회가 끝나면 true (API 가 에러를 내도 종료)
  //   ② lastPath 가 없으면 스케줄 조회는 enabled:false 라 영원히 idle → 완료로 간주
  //   ③ 조회 자체가 안 끝나는 경우(서버 무응답)는 socialApi 의 15초 timeout 이 끊는다.
  //      끊긴 뒤에는 VIDEO_QUERY_RETRY 로 계속 재시도하므로, 서버가 살아나면 자동 복구된다.
  useEffect(() => {
    if (videoLoaded) return;

    if (youtubeFetched && (!lastPath || schedulesFetched)) {
      setVideoLoaded(true);
    }
  }, [videoLoaded, youtubeFetched, schedulesFetched, lastPath]);

  // 재로드 안전망 — 1분 넘게 조회가 끝나지 않으면 화면을 한 번만 다시 로드한다.
  // 서버가 계속 죽어있는 동안 새로고침이 반복되지 않도록 세션당 1회로 제한하고,
  // 그 뒤에는 로딩 표시를 유지한 채 재시도로 복구를 기다린다.
  useEffect(() => {
    if (videoLoaded) {
      try { sessionStorage.removeItem(RELOADED_KEY); } catch { /* 저장소 차단 환경 무시 */ }
      return;
    }

    const id = setTimeout(() => {
      let reloadedBefore = false;
      try { reloadedBefore = sessionStorage.getItem(RELOADED_KEY) === '1'; } catch { /* noop */ }

      if (reloadedBefore) {
        console.log('social :: 영상 조회 지연 지속 — 재로드 생략, 재시도로 복구 대기');
        return;
      }
      try { sessionStorage.setItem(RELOADED_KEY, '1'); } catch { /* noop */ }
      console.log('social :: 영상 조회 1분 초과 — 화면 재로드');
      window.location.reload();
    }, LOADING_RELOAD_MS);

    return () => clearTimeout(id);
  }, [videoLoaded]);

  // WS 소켓 수신 → schedules 재조회
  useEffect(() => {
    if (scheSocketData !== null) {
      refetchSchedules();
    }
  }, [scheSocketData]);

  // 날씨
  useEffect(() => {
    if (weather) setWeather(weather.data);
  }, [weather]);

  // 유튜브
  useEffect(() => {
    if (!youtube?.data) return;
    const youtubeList = youtube.data ?? [];
    if (youtubeList.length > 0) {
      setYoutubes(youtubeList);
      setActiveVideo(SOCIAL_VIDEO_MENU.YOUTUBE);
    }
  }, [youtube]);

  // 스케줄
  useEffect(() => {
    if (!schedules?.data) return;

    const emers    = schedules.data.emers   ?? [];
    const norms    = schedules.data.norms   ?? [];
    const contents = schedules.data.videos  ?? [];
    const files: SocialFileType[] = contents.flatMap((c) => c.fileList ?? []);
    const imageFiles = files.filter((f) => f.fileType.includes('image'));
    const videoFiles = files.filter((f) => !f.fileType.includes('image'));

    setEmers(emers);
    setNorms(norms);
    useSocialStore.getState().actions.setMediaCache(schedules.data.mediaCache ?? null);
    configureMediaCache(videoFiles, schedules.data.mediaCache ?? null);
    setVideos(videoFiles);
    setPhotos(imageFiles);

    // PHOTO 우선순위: EMER > NORM > PHOTO > VMS_PHOTO > NONE
    if (emers.length > 0) {
      setActivePhoto(SOCIAL_PHOTO_MENU.EMER);
    } else if (norms.length > 0) {
      setActivePhoto(SOCIAL_PHOTO_MENU.NORM);
    } else if (imageFiles.length > 0) {
      // PHOTO↔VMS_PHOTO 순환 중이면 방해하지 않음 (단, WS 트리거면 PHOTO로 재시작)
      const cur = activePhotoRef.current;
      const inCycle = cur === SOCIAL_PHOTO_MENU.PHOTO || cur === SOCIAL_PHOTO_MENU.VMS_PHOTO;
      if (!inCycle || scheSocketData) {
        setActivePhoto(SOCIAL_PHOTO_MENU.PHOTO);
      }
    } else {
      if (vmsPhotosRef.current.length === 0) setActivePhoto(SOCIAL_PHOTO_MENU.NONE);
      else                                    setActivePhoto(SOCIAL_PHOTO_MENU.VMS_PHOTO);
    }

    // VIDEO — 소켓이 있으면 비디오 설정 스킵
    if (scheSocketData) {
      setScheSocketData(null);
      if (videoFiles.length === 0 && activeVideoRef.current === SOCIAL_VIDEO_MENU.VIDEO) {
        setActiveVideo(SOCIAL_VIDEO_MENU.YOUTUBE);
      } else if (
        videoFiles.length > 0 && youtubeFetched && !(youtube?.data?.length) &&
        (useSocialStore.getState().activeVideo === SOCIAL_VIDEO_MENU.YOUTUBE ||
         useSocialStore.getState().activeVideo === SOCIAL_VIDEO_MENU.NONE)
      ) {
        // A deleted/expired playlist may leave an empty YouTube turn. Resume
        // newly registered videos without interrupting a real YouTube/VMS turn.
        setActiveVideo(SOCIAL_VIDEO_MENU.VIDEO);
      }
    } else {
      // 실제 YouTube 목록이 있으면 먼저 재생한다. 목록이 비어 있으면
      // 삭제/만료 후 남은 빈 YouTube 차례에서도 스케줄 영상으로 복귀한다.
      const hasYoutube   = (youtube?.data?.length ?? 0) > 0;
      // 유튜브 조회가 아직 안 끝났으면 기다린다(유튜브가 먼저 시작해야 하므로).
      // isFetched 는 성공/실패 무관하게 완료되면 true — 유튜브 API 가 죽어도
      // 스케줄 영상까지 막히지 않는다.
      if (
        videoFiles.length > 0 &&
        youtubeFetched &&
        !hasYoutube
      ) {
        setActiveVideo(SOCIAL_VIDEO_MENU.VIDEO);
      }
    }
  }, [schedules, youtube, youtubeFetched]);

  // VMS
  useEffect(() => {
    if (!vms?.data) return;
    const vmsImages = vms.data.vmsImages ?? [];
    const vmsVids   = vms.data.vmsVideos ?? [];

    if (vmsImages.length > 0) {
      setVmsPhotos(vmsImages);
      if (activePhotoRef.current === SOCIAL_PHOTO_MENU.NONE) {
        setActivePhoto(SOCIAL_PHOTO_MENU.VMS_PHOTO);
      }
    }
    if (vmsVids.length > 0) {
      setVmsVideos(vmsVids);
      if (activeVideoRef.current === SOCIAL_VIDEO_MENU.NONE) {
        setActiveVideo(SOCIAL_VIDEO_MENU.VMS_VIDEO);
      }
    }
  }, [vms]);

  return (
    <StyledSocialBody>
      <SocialVideo />
      <SocialPhoto />
    </StyledSocialBody>
  );
};

export default SocialBody;

const StyledSocialBody = styled.div`
  margin-top: 24px;
  width: 100%;
  height: calc(1131px + 481px);
  display: flex;
  flex-direction: column;
`;
