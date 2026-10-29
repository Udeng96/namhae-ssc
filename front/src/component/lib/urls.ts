export const BASE_URL = import.meta.env.VITE_SSC_API_BASE || 'http://127.0.0.1:18080/ssc';
export const BASE_URL_EXTERNAL = import.meta.env.VITE_EXTERNAL_API_BASE || 'http://127.0.0.1:18080';
export const BASE_URL_MODULE = import.meta.env.VITE_MODULE_API_BASE || 'http://127.0.0.1:18080/scmModule';
export const BASE_WS_URL = import.meta.env.VITE_SSC_WS_BASE || 'ws://127.0.0.1:18080/ssc';
export const WS_URL = BASE_WS_URL;
export const BASE_WS_URL_EXTERNAL = 'ws://127.0.0.1:18080';
export const VWORLD_URL = 'http://127.0.0.1:18080/maps';
export const API = {
  HEALTH: {
    CHECK: `/server/health-check`,
  },

  USER: {
    INFO: `/user/info`,
    ROLE: `/user/role`,
    TOKEN_ALIVE: `/user/tokenAlive`,
    LOGOUT: `/logout`,
  },

  PLATFORM: {
    OMS_SYS_VIEW: `/oms/login/goSysSelView`,
  },

  EVENT: {
    LIST: `/event`,
    TODAY_STATUS: (mgtNo: string) => `/event/today/${mgtNo}`,
    SHARE: `/event/share`,
    HEATMAP: `/event/heatmap`,
    SMS: {
      TARGET_PHONE: `/sms/target`,
      TARGET_DEVICE: `/broadcast/device`,
      SEND: `/share/send`,
    },
    CONF: {
      CREATE: (sscMgtNo: string) => `/conf/create/${sscMgtNo}`,
      CLOSE: `/conf/close`,
      INFO: `/conf`,
      SSO: (userId: string) => `/conf/sso/login/${userId}`,
    },
  },

  // EXTERNAL (BASE_URL_EXTERNAL 사용)
  AXIS: {
    MUTE: `/axis/api/sound`,
    SIGNAL_ON: `/axis/signalLight/on`,
    SIGNAL_OFF: `/axis/signalLight/off`,
    SSO_LOGIN_URL: `http://127.0.0.1:80/ssoLogin.jsp`,
  },

  FAC: {
    LIST: `/fac`,
    CCTV: {
      CRIME: `/fac/cctv/crime`,
      SC: `/fac/cctv/sc`,
    },
    // MODULE (BASE_URL_MODULE 사용)
    STATE: (scId: string) => `/api/${scId}`,
  },

  SCHE: {
    LIST: `/sche`,
    SAVE: `/sche`,
    EDIT: `/sche`,
    DELETE: (grpId: string) => `/sche/${grpId}`,
  },

  FILE: {
    LIST:   `/newfile`,
    UPLOAD: `/newfile`,
    DELETE: (fileId: string) => `/newfile/${fileId}`,
  },

  STAT: {
    EVENT: `/stat/event`,
    FAC:   `/stat/fac`,
    OPER:  `/stat/oper`,
    USAGE: `/stat/usage`,
  },

  FIRE: {
    EVENT_LIST: `/fire/events`,
    CONF_INFO: (seqn: string, userId: string) => `/newconf/hm/pcScheme/${seqn}/${userId}`,
  },

  NOTI: {
    LIST: (scMgtNo: string) => `/notiSche/${scMgtNo}`,
    TV:   (scMgtNo: string) => `/notiSche/tv/${scMgtNo}`,
  },

  SOCIAL: {
    WEATHER:   `/openapi/forecast`,
    REPORT:    `/openapi/report`,
    SCHEDULES: (scMgtNo: string) => `/seniorSche/${scMgtNo}`,
    VMS:       `/newfile/vms`,
    MEDIA: (fileId: string, version: string) => `/newfile/media/${encodeURIComponent(fileId)}?v=${encodeURIComponent(version)}`,
    VMS_FILE:  (seqn: string) => `/newfile/vms/${seqn}`,
    FILE:      (fileNm: string, ext: string, contentType: string) =>
      `/newfile/${fileNm}/${ext}/${contentType}`,
    YOUTUBE: {
      LIST: `/openapi/youtube`,
      // 서버는 @PostMapping("/youtube/err/{videoId}") 로 PathVariable 을 받는다.
      // 쿼리/바디로 보내면 404 → error_yn 이 갱신되지 않아 재생 불가 영상이 계속 active 로 남는다.
      ERR:  (videoId: string) => `/openapi/youtube/err/${encodeURIComponent(videoId)}`,
    },
  },
} as const;

// ─── WebSocket 경로 ───────────────────────────────────
export const WS = {
  EVENT:      `${WS_URL}/rino/event`,
  FAC:        `${WS_URL}/rino/facility`,
  SOCIAL:     `${WS_URL}/rino/social/content`,
  NOTI:       `${WS_URL}/rino/tv/notice`,
  STREAM_URL: 'ws://127.0.0.1:18080/xeus-gate/stream',
} as const;
