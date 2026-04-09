// statEvetCd 기반 이벤트 코드
export const EVENT_CODE = {
  BELL: '01',   // 비상벨
  FIRE: '02',   // 화재
  GAS: '03',    // 가스 (현재 기능 제거됨)
} as const;

export type EventCode = typeof EVENT_CODE[keyof typeof EVENT_CODE];

// 이벤트 처리 상태
export const PROC_ST = {
  OPEN: 'OPEN',
  CLOSE: 'CLOSE',
} as const;

export type ProcSt = typeof PROC_ST[keyof typeof PROC_ST];

// 지역 전체 선택 값 (기존 "전체/all" 하드코딩 대체)
export const WHOLE_OPTION = '전체/all' as const;

// ─── 토스트 타입 ──────────────────────────────────────
export const EVENT_TOAST_TYPE = {
  NONE: 'NONE',
  SEARCH: {
    NO_TYPE_OPT: 'NO_TYPE_OPT',
    NO_AREA_OPT: 'NO_AREA_OPT',
  },
  SHARE: {
    SUCCESS: 'SHARE_SUCCESS',
    FAILURE: 'SHARE_FAILURE',
  },
  SMS: {
    NO_OPT: {
      SHARE: { CONTENT: 'NO_SMS_CONTENT', TITLE: 'NO_SMS_TITLE', TARGET: 'NO_SMS_TARGET' },
      BROAD: { CONTENT: 'NO_BROAD_CONTENT', TITLE: 'NO_BROAD_TITLE', TARGET: 'NO_BROAD_TARGET' },
    },
    SEND: { FAILED: 'SEND_MSG_FAILED', SUCCESS: 'SEND_MSG_SUCCESS' },
  },
  CONF: {
    CREATE:      { SUCCESS: 'CONF_CREATE_SUCCESS', FAILURE: 'CONF_CREATE_FAILURE', ALREADY: 'CONF_CREATE_ALREADY' },
    CLOSE:       { SUCCESS: 'CONF_CLOSE_SUCCESS',  FAILURE: 'CONF_CLOSE_FAILURE' },
    PARTICIPANT: { SUCCESS: 'CONF_PARTICIPANT_SUCCESS', FAILURE: 'CONF_PARTICIPANT_FAILURE' },
    BELL:        { FAILURE: 'CONF_BELL_FAILURE' },
    FIRE: {
      ON:  { SUCCESS: 'CONF_FIRE_ON_SUCCESS',  FAILURE: 'CONF_FIRE_ON_FAILURE' },
      OFF: { SUCCESS: 'CONF_FIRE_OFF_SUCCESS', FAILURE: 'CONF_FIRE_OFF_FAILURE' },
    },
  },
  SOCKET: { ON: 'SOCKET_ON', OFF: 'SOCKET_OFF' },
};

// ─── 모달 타입 ────────────────────────────────────────
export const EVENT_MODAL_TYPE = {
  NONE: 'NONE',
  MAIN: { LAST: 'MAIN_LAST', CONF: 'MAIN_CONF', SMS: 'MAIN_SMS' },
  FIRE: { LAST: 'FIRE_LAST', CONF: { PARTICIPANT: 'FIRE_CONF_PARTICIPANT' } },
  SMS: {
    PRESET_SMS_OK:   'SMS_PRESET_OK',
    PRESET_SMS:      'SMS_PRESET',
    PRESET_BROAD_OK: 'BROAD_PRESET_OK',
    PRESET_BROAD:    'BROAD_PRESET',
    PRESET:          'SMS_PRESET',
    CONTENT:         'SMS_CONTENT',
    CONFIRM:         'SMS_CONFIRM',
    TARGET:          'SMS_TARGET',
    BROAD_TARGET:    'SMS_BROAD_TARGET',
  },
  CONF: { PARTICIPANT: 'CONF_PARTICIPANT' },
};

// ─── 기간 타입 ────────────────────────────────────────
import moment from 'moment';

export const EVENT_PERIOD_TYPE = {
  WHOLE:       { nm: '전체',  cd: 'whole',  endDtm: '',                                   startDtm: '' },
  TODAY:       { nm: '오늘',  cd: 'today',  endDtm: moment().format('YYYYMMDD'),           startDtm: moment().format('YYYYMMDD') },
  WEEK:        { nm: '일주일', cd: 'aWeek', endDtm: moment().format('YYYYMMDD'),           startDtm: moment().subtract(7, 'days').format('YYYYMMDD') },
  ONE_MONTH:   { nm: '당월',  cd: 'aMonth', endDtm: moment().format('YYYYMMDD'),           startDtm: moment().subtract(1, 'months').format('YYYYMMDD') },
  THREE_MONTH: { nm: '3개월', cd: 'tMonth', endDtm: moment().format('YYYYMMDD'),           startDtm: moment().subtract(3, 'months').format('YYYYMMDD') },
  SIX_MONTH:   { nm: '6개월', cd: 'sMonth', endDtm: moment().format('YYYYMMDD'),           startDtm: moment().subtract(6, 'months').format('YYYYMMDD') },
};

export const EVENT_HEATMAP_PERIOD_LIST = [
  EVENT_PERIOD_TYPE.WHOLE, EVENT_PERIOD_TYPE.TODAY, EVENT_PERIOD_TYPE.ONE_MONTH, EVENT_PERIOD_TYPE.THREE_MONTH,
];
export const EVENT_PERIOD_LIST = [
  EVENT_PERIOD_TYPE.TODAY, EVENT_PERIOD_TYPE.WEEK, EVENT_PERIOD_TYPE.ONE_MONTH, EVENT_PERIOD_TYPE.THREE_MONTH, EVENT_PERIOD_TYPE.SIX_MONTH,
];

// ─── SMS / 방송 프리셋 ─────────────────────────────────
export const SMS_PRESET: { cd: string; nm: string; msg: string }[] = [
  { cd: 'NONE', nm: '직접입력', msg: '' },
  {
    cd: 'FIRE',
    nm: '#화재',
    msg: '화재 경보가 감지되었습니다.\n연기와 불길에 주의하시어 즉시 안전한 곳으로 대피해 주세요.',
  },
  {
    cd: 'BELL',
    nm: '#비상벨',
    msg: '현재 비상 상황이 접수되었습니다.\n곧 도움을 드릴 담당자 또는 구급대가 도착할 예정입니다.\n경로당 내 모든 분들은 당황하지 마시고,\n접수처에서 안내해드린 지시에 따라 주시기 바랍니다.\n필요시 비상 출입문 또는 대피 경로를 이용해 주세요.',
  },
];
