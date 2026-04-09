// ─── 스케줄 탭 타입 ────────────────────────────────────
export const SCHE_TYPE = {
  CONTENT: 'CONTENT',   // 영상 콘텐츠
  NORM:    'NORM',      // 공지 알림
  EMER:    'EMER',      // 긴급 알림
} as const;
export type ScheType = typeof SCHE_TYPE[keyof typeof SCHE_TYPE];

// ─── API 응답 contentType 값 ──────────────────────────
export const SCHE_RESULT_TYPE = {
  CONTENT: 'VIDEO',
  NORM:    'NOTICE_N',
  EMER:    'NOTICE_E',
} as const;

// ─── 저장/수정/삭제 결과 ──────────────────────────────
export const SCHE_SAVE_RESULT = {
  DUPLICATE:   'DUPLICATE',
  SUCCESS:     'SUCCESS',
  FAILED:      'FAILED',
  NO_SCHEDULE: 'NO_SCHEDULE',
} as const;

// ─── 캘린더 색상 클래스 ───────────────────────────────
export const SCHE_COLOR_TYPE = {
  NORM:    'notice-normal',
  EMER:    'notice-emer',
  CONTENT: 'content-color',
} as const;

// ─── 모달 타입 ────────────────────────────────────────
export const SCHE_MODAL_TYPE = {
  BOARD:     'BOARD',
  PREV_NORM: 'PREV_NORM',
  PREV_EMER: 'PREV_EMER',
  DEL:       'MODAL_DEL',
  EDIT:      'MODAL_EDIT',
  NONE:      'NONE',
} as const;
export type ScheModalType = typeof SCHE_MODAL_TYPE[keyof typeof SCHE_MODAL_TYPE];

// ─── 스케줄 토스트 ────────────────────────────────────
export const SCHE_TOAST_TYPE = {
  NONE:           'NONE',
  OVER_DURATION:  'OVER_DURATION',
  DUPLICATE:      'DUPLICATE',
  DUPLICATE_FILE: 'DUPLICATE_FILE',
  SAVE_SUCCESS:   'SAVE_SUCCESS',
  SAVE_FAILED:    'SAVE_FAILED',
  DEL_SUCCESS:    'DEL_SUCCESS',
  DEL_FAILED:     'DEL_FAILED',
  EDIT_SUCCESS:   'EDIT_SUCCESS',
  EDIT_FAILED:    'EDIT_FAILED',
  OTHER_USER:     'OTHER_USER',
} as const;
export type ScheToastType = typeof SCHE_TOAST_TYPE[keyof typeof SCHE_TOAST_TYPE];

// ─── 폼 모드 ─────────────────────────────────────────
export const SCHE_MODE = {
  DEFAULT: 'DEFAULT',
  EDIT:    'EDIT',
  READ:    'READ',
} as const;
export type ScheMode = typeof SCHE_MODE[keyof typeof SCHE_MODE];

// ─── 파일 모달 타입 ───────────────────────────────────
export const FILE_MODAL_TYPE = {
  UP:   'FILE_UP',
  DEL:  'FILE_DEL',
  NONE: 'NONE',
} as const;
export type FileModalType = typeof FILE_MODAL_TYPE[keyof typeof FILE_MODAL_TYPE];

// ─── 파일 토스트 ──────────────────────────────────────
export const FILE_TOAST_TYPE = {
  NONE:         'NONE',
  UP_SUCCESS:   'UP_SUCCESS',
  UP_FAILED:    'UP_FAILED',
  DEL_SUCCESS:  'DEL_SUCCESS',
  DEL_FAILED:   'DEL_FAILED',
  UP_LOADING:   'UP_LOADING',
  SIZE:         'SIZE',
  FILE_TYPE:    'FILE_TYPE',
  DUPLICATED:   'DUPLICATED',
  FILE_FAILURE: 'FILE_FAILURE',
  SUCCESS:      'SUCCESS',
} as const;
export type FileToastType = typeof FILE_TOAST_TYPE[keyof typeof FILE_TOAST_TYPE];

// ─── 긴급 알림 배경 목록 ─────────────────────────────
export const SCHE_EMER_BACK = [
  { cd: 'NONE',    nm: '선택없음' },
  { cd: 'FIRE',    nm: '화재·산불' },
  { cd: 'TYPHOON', nm: '태풍·침수·홍수' },
  { cd: 'SAFETY',  nm: '안전사고' },
] as const;

// ─── 긴급 알림 표시 시간 ─────────────────────────────
export const SCHE_EMER_SHOW_TIME = [
  { cd: `${30}`,       nm: '30초' },
  { cd: `${60}`,       nm: '1분' },
  { cd: `${60 * 5}`,   nm: '5분' },
  { cd: `${60 * 10}`,  nm: '10분' },
  { cd: `${60 * 15}`,  nm: '15분' },
  { cd: `${60 * 20}`,  nm: '20분' },
  { cd: `${60 * 60}`,  nm: '1시간' },
] as const;
