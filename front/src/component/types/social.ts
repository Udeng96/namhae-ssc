// ─── 날씨 / 보도자료 ──────────────────────────────────
export interface WeatherType {
  regDtm:     string;
  skyCd:      string; // 1=맑음 3=구름조금 4=구름많음
  updateDtm:  string;
  nowTemp:    string;
  ptyCd:      string; // 0=없음 1=비 2=진눈깨비 3=눈
  ptyNm:      string;
  skyNm:      string;
  pm10Grade:  string; // 1=좋음 2=보통 3=나쁨 4=매우나쁨
  pm25Grade:  string;
}

export interface ReportType {
  resultCode:    string;
  resultType:    string; // 01~10 | 'NONE'
  resultTime:    string;
  resultTitle:   string;
  resultMessage: string;
}

// ─── 스케줄 ───────────────────────────────────────────
export interface ScheduleResType {
  videos: ScheduleType[];
  norms:  ScheduleType[];
  emers:  ScheduleType[];
}

export interface ScheduleType {
  contentId:    string;
  contentTitle: string;
  contentCntn:  string;
  contentType:  string;
  contentArea:  string;
  startDtm:     string;
  endDtm:       string;
  expireDtm:    string;
  expireTime:   string;
  fileList:     SocialFileType[];
}

export interface SocialFileType {
  fileId:   string;
  fileNm:   string;
  fileType: string;
  noti:     boolean;
}

// ─── VMS ──────────────────────────────────────────────
export interface VmsResType {
  vmsImages: VmsType[];
  vmsVideos: VmsType[];
}

export interface VmsType {
  seqn:     string;
  fileNm:   string;
  startDtm: string;
  endDtm:   string;
  useYn:    string;
  fileType: string;
}

// ─── YouTube ──────────────────────────────────────────
export interface YoutubeType {
  videoId:    string;
  etag:       string;
  publishDtm: string;
  errorYn:    boolean;
  activeYn:   boolean;
}

// ─── WebSocket ────────────────────────────────────────
export interface SocketScheType {
  postType: string;
  message:  SocketMsgType;
}

export interface SocketMsgType {
  backImage:    string;
  colorType:    string;
  contentArea:  string;
  contentCntn:  string;
  contentFile:  string;
  contentGrpId: string;
  contentId:    string;
  contentTitle: string;
  contentType:  string;
  endDtm:       string;
  endTime:      string;
  expireDtm:    string | null;
  expireTime:   string | null;
  outbDtm:      string;
  repeatDate:   string | null;
  startDtm:     string;
  startTime:    string;
}
