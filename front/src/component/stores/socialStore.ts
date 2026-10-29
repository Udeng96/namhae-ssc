import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import {
  WeatherType, ReportType,
  ScheduleType, SocialFileType, MediaCachePolicy,
  VmsType, YoutubeType, SocketScheType,
} from '@/component/types/social';
import { SOCIAL_PHOTO_MENU, SOCIAL_VIDEO_MENU } from '@/component/constants/socialConst';

interface SocialState {
  mediaCache: MediaCachePolicy | null;
  mediaRefresh: number;
  scheSocketData:  SocketScheType | null;
  eventSocketData: SocketScheType | null;

  weather: WeatherType | null;
  report:  ReportType  | null;

  activeVideo: string;
  activePhoto: string;

  /**
   * 영상 조회(유튜브 + 스케줄)가 한 번이라도 끝났는지.
   * activeVideo 가 NONE 인 상태는 "아직 불러오는 중"과 "표출할 영상이 없음"
   * 둘 다이므로, 로딩 표시를 이 값으로 구분한다.
   */
  videoLoaded: boolean;

  photos:   SocialFileType[];
  videos:   SocialFileType[];
  norms:    ScheduleType[];
  emers:    ScheduleType[];
  youtubes: YoutubeType[];

  vmsVideos: VmsType[];
  vmsPhotos: VmsType[];
}

interface SocialActions {
  setMediaCache: (policy: MediaCachePolicy | null) => void;
  requestMediaRefresh: () => void;
  setScheSocketData:  (data: SocketScheType | null) => void;
  setEventSocketData: (data: SocketScheType | null) => void;
  setWeather:         (data: WeatherType | null)    => void;
  setReport:          (data: ReportType  | null)    => void;
  setActiveVideo:     (type: string)                => void;
  setVideoLoaded:     (loaded: boolean)             => void;
  setActivePhoto:     (type: string)                => void;
  setPhotos:          (data: SocialFileType[])      => void;
  setVideos:          (data: SocialFileType[])      => void;
  setNorms:           (data: ScheduleType[])        => void;
  setEmers:           (data: ScheduleType[])        => void;
  setYoutubes:        (data: YoutubeType[])         => void;
  setVmsVideos:       (data: VmsType[])             => void;
  setVmsPhotos:       (data: VmsType[])             => void;
}

export const useSocialStore = create<SocialState & { actions: SocialActions }>()(
  immer((set) => ({
    mediaCache: null,
    mediaRefresh: 0,
    scheSocketData:  null,
    eventSocketData: null,

    weather: null,
    report:  null,

    activeVideo: SOCIAL_VIDEO_MENU.NONE,
    activePhoto: SOCIAL_PHOTO_MENU.NONE,

    videoLoaded: false,

    photos:   [],
    videos:   [],
    norms:    [],
    emers:    [],
    youtubes: [],

    vmsVideos: [],
    vmsPhotos: [],

    actions: {
      setMediaCache: (policy) => set((s) => { s.mediaCache = policy; }),
      requestMediaRefresh: () => set((s) => { s.mediaRefresh += 1; }),
      setScheSocketData:  (data) => set((s) => { s.scheSocketData  = data; }),
      setEventSocketData: (data) => set((s) => { s.eventSocketData = data; }),
      setWeather:         (data) => set((s) => { s.weather         = data; }),
      setReport:          (data) => set((s) => { s.report          = data; }),
      setActiveVideo:     (type) => set((s) => { s.activeVideo     = type; }),
      setVideoLoaded:     (v)    => set((s) => { s.videoLoaded     = v; }),
      setActivePhoto:     (type) => set((s) => { s.activePhoto     = type; }),
      setPhotos:          (data) => set((s) => { s.photos          = data; }),
      setVideos:          (data) => set((s) => { s.videos          = data; }),
      setNorms:           (data) => set((s) => { s.norms           = data; }),
      setEmers:           (data) => set((s) => { s.emers           = data; }),
      setYoutubes:        (data) => set((s) => { s.youtubes        = data; }),
      setVmsVideos:       (data) => set((s) => { s.vmsVideos       = data; }),
      setVmsPhotos:       (data) => set((s) => { s.vmsPhotos       = data; }),
    },
  })),
);
