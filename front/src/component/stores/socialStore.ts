import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import {
  WeatherType, ReportType,
  ScheduleType, SocialFileType,
  VmsType, YoutubeType, SocketScheType,
} from '@/component/types/social';
import { SOCIAL_PHOTO_MENU, SOCIAL_VIDEO_MENU } from '@/component/constants/socialConst';

interface SocialState {
  scheSocketData:  SocketScheType | null;
  eventSocketData: SocketScheType | null;

  weather: WeatherType | null;
  report:  ReportType  | null;

  activeVideo: string;
  activePhoto: string;

  photos:   SocialFileType[];
  videos:   SocialFileType[];
  norms:    ScheduleType[];
  emers:    ScheduleType[];
  youtubes: YoutubeType[];

  vmsVideos: VmsType[];
  vmsPhotos: VmsType[];
}

interface SocialActions {
  setScheSocketData:  (data: SocketScheType | null) => void;
  setEventSocketData: (data: SocketScheType | null) => void;
  setWeather:         (data: WeatherType | null)    => void;
  setReport:          (data: ReportType  | null)    => void;
  setActiveVideo:     (type: string)                => void;
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
    scheSocketData:  null,
    eventSocketData: null,

    weather: null,
    report:  null,

    activeVideo: SOCIAL_VIDEO_MENU.NONE,
    activePhoto: SOCIAL_PHOTO_MENU.NONE,

    photos:   [],
    videos:   [],
    norms:    [],
    emers:    [],
    youtubes: [],

    vmsVideos: [],
    vmsPhotos: [],

    actions: {
      setScheSocketData:  (data) => set((s) => { s.scheSocketData  = data; }),
      setEventSocketData: (data) => set((s) => { s.eventSocketData = data; }),
      setWeather:         (data) => set((s) => { s.weather         = data; }),
      setReport:          (data) => set((s) => { s.report          = data; }),
      setActiveVideo:     (type) => set((s) => { s.activeVideo     = type; }),
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
