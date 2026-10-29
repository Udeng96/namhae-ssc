import { apiClient, ApiResponse } from '@/component/lib/apiClient';
import { API } from '@/component/lib/urls';
import {
  WeatherType, ReportType,
  ScheduleResType, VmsResType, YoutubeType,
} from '@/component/types/social';

/**
 * 정보표출모니터 영상 조회 전용 타임아웃.
 *
 * apiClient 는 전역 timeout 이 없다(0 = 무제한). 대량 이벤트/시설 조회가 수십초 걸리기
 * 때문인데, 그 탓에 서버가 무응답이면 요청이 영영 끝나지 않아 화면이 로딩에서 멈춘다.
 * 영상 표출에 쓰는 이 두 조회는 응답이 짧으므로 여기서만 상한을 둔다.
 * (전역 설정은 건드리지 않는다)
 */
const VIDEO_FETCH_TIMEOUT = 15000;

export const fetchWeather    = (): ApiResponse<WeatherType>      => apiClient.get(API.SOCIAL.WEATHER);
export const fetchReport     = (): ApiResponse<ReportType>       => apiClient.get(API.SOCIAL.REPORT);
export const fetchSchedules  = (scMgtNo: string): ApiResponse<ScheduleResType> =>
  apiClient.get(API.SOCIAL.SCHEDULES(scMgtNo), { timeout: VIDEO_FETCH_TIMEOUT });
export const fetchVms        = (): ApiResponse<VmsResType>       => apiClient.get(API.SOCIAL.VMS);
export const fetchYoutube    = (): ApiResponse<YoutubeType[]>    =>
  apiClient.get(API.SOCIAL.YOUTUBE.LIST, { timeout: VIDEO_FETCH_TIMEOUT });
export const updateYoutubeErr = (videoId: string): ApiResponse<YoutubeType[]> =>
  apiClient.post(API.SOCIAL.YOUTUBE.ERR(videoId));
