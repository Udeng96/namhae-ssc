import { apiClient, ApiResponse } from '@/component/lib/apiClient';
import { API } from '@/component/lib/urls';
import {
  WeatherType, ReportType,
  ScheduleResType, VmsResType, YoutubeType,
} from '@/component/types/social';

export const fetchWeather    = (): ApiResponse<WeatherType>      => apiClient.get(API.SOCIAL.WEATHER);
export const fetchReport     = (): ApiResponse<ReportType>       => apiClient.get(API.SOCIAL.REPORT);
export const fetchSchedules  = (scMgtNo: string): ApiResponse<ScheduleResType> =>
  apiClient.get(API.SOCIAL.SCHEDULES(scMgtNo));
export const fetchVms        = (): ApiResponse<VmsResType>       => apiClient.get(API.SOCIAL.VMS);
export const fetchYoutube    = (): ApiResponse<YoutubeType[]>    => apiClient.get(API.SOCIAL.YOUTUBE.LIST);
export const updateYoutubeErr = (videoId: string): ApiResponse<YoutubeType[]> =>
  apiClient.post(API.SOCIAL.YOUTUBE.ERR, { params: { videoId } });
