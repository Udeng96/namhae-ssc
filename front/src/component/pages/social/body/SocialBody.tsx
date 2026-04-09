import styled from 'styled-components';
import SocialVideo from './video/SocialVideo';
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

  // ─── 날씨 (staleTime Infinity)
  const { data: weather } = useQuery(
    ['weatherInfo'],
    () => fetchWeather(),
    { staleTime: Infinity },
  );

  // ─── 스케줄 — WS 수신 시 refetch + 1시간마다 자동 갱신
  const { data: schedules, refetch: refetchSchedules } = useQuery(
    ['socialSchedules', lastPath],
    () => fetchSchedules(lastPath),
    {
      enabled:         !!lastPath,
      refetchInterval: ONE_HOUR,
    },
  );

  // ─── VMS — 1시간마다 자동 갱신
  const { data: vms } = useQuery(
    ['socialVms'],
    () => fetchVms(),
    { refetchInterval: ONE_HOUR },
  );

  // ─── YouTube (staleTime Infinity)
  const { data: youtube } = useQuery(
    ['youtube'],
    () => fetchYoutube(),
    { staleTime: Infinity },
  );

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
      }
    } else {
      if (videoFiles.length > 0 && activeVideoRef.current !== SOCIAL_VIDEO_MENU.YOUTUBE) {
        setActiveVideo(SOCIAL_VIDEO_MENU.VIDEO);
      }
    }
  }, [schedules]);

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
