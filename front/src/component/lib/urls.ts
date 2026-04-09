const domain = window.location.host;

export const BASE_URL =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:22510/ssc'
    : `http://${domain}/ssc`;

// 외부 서버 (axis, scmModule 등) — /ssc prefix 없음
export const BASE_URL_EXTERNAL = BASE_URL.replace('/ssc', '');

// 시설 모듈 전용 서버
export const BASE_URL_MODULE = BASE_URL.replace('/ssc', '/scmModule');

export const WS_URL =
  process.env.NODE_ENV === 'development'
    ? `ws://localhost:22510/ssc`
    : `ws://${domain}/ssc`;

export const VWORLD_URL = `http://${BASE_URL.replace('http://', '')}:8080/xdworld.vworld.kr:8080`;

// ─── REST API 경로 ────────────────────────────────────
export const API = {
  HEALTH: {
    CHECK: `/server/health-check`,
  },

  USER: {
    INFO: `/user/info`,
    ROLE: `/user/role`,
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
    SSO_LOGIN_URL: `http://172.16.9.11:80/ssoLogin.jsp`,
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
    VMS_FILE:  (seqn: string) => `/newfile/vms/${seqn}`,
    FILE:      (fileNm: string, ext: string, contentType: string) =>
      `/newfile/${fileNm}/${ext}/${contentType}`,
    YOUTUBE: {
      LIST: `/openapi/youtube`,
      ERR:  `/openapi/youtube/err`,
    },
  },
} as const;

// ─── WebSocket 경로 ───────────────────────────────────
export const WS = {
  EVENT:      `${WS_URL}/rino/event`,
  FAC:        `${WS_URL}/rino/facility`,
  SOCIAL:     `${WS_URL}/rino/social/content`,
  NOTI:       `${WS_URL}/rino/tv/notice`,
  STREAM_URL: `ws://${domain}/xeus-gate/stream`,
} as const;
