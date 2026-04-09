export const FAC_SORT = {
  NONE: 'none',
  NORM: 'default',
  ERROR: 'error',
} as const;

export type FacSort = typeof FAC_SORT[keyof typeof FAC_SORT];

export const FAC_TOAST = {
  NONE: '',
  NO_AREA: 'fac_no_area',
  RELOAD_SUCCESS: 'fac_reload_success',
  RELOAD_FAILURE: 'fac_reload_failure',
} as const;

// 전체 지역 코드
export const WHOLE_AREA_CODE = '400';
