import { NavType } from '../types/common';

// ─── Nav 아이콘 import (Vite는 /src/assets 직접 URL 접근 불가) ──
import HomeNormal  from '@/assets/images/dark/common/btn/LNB_Menu/btn_lnb_menu_0home_normal.svg';
import HomeHover   from '@/assets/images/dark/common/btn/LNB_Menu/btn_lnb_menu_0home_hover.svg';
import HomeActive  from '@/assets/images/dark/common/btn/LNB_Menu/btn_lnb_menu_0home_active.svg';

import EventNormal from '@/assets/images/dark/common/btn/LNB_Menu/btn_lnb_menu_1event_normal.svg';
import EventHover  from '@/assets/images/dark/common/btn/LNB_Menu/btn_lnb_menu_1event_hover.svg';
import EventActive from '@/assets/images/dark/common/btn/LNB_Menu/btn_lnb_menu_1event_active.svg';

import FacNormal   from '@/assets/images/dark/common/btn/LNB_Menu/btn_lnb_menu_2sensor_normal.svg';
import FacHover    from '@/assets/images/dark/common/btn/LNB_Menu/btn_lnb_menu_2sensor_hover.svg';
import FacActive   from '@/assets/images/dark/common/btn/LNB_Menu/btn_lnb_menu_2sensor_active.svg';

import ScheNormal  from '@/assets/images/dark/common/btn/LNB_Menu/btn_lnb_menu_3schedule_normal.svg';
import ScheHover   from '@/assets/images/dark/common/btn/LNB_Menu/btn_lnb_menu_3schedule_hover.svg';
import ScheActive  from '@/assets/images/dark/common/btn/LNB_Menu/btn_lnb_menu_3schedule_active.svg';

import StatNormal  from '@/assets/images/dark/common/btn/LNB_Menu/btn_lnb_menu_4statistics_normal.svg';
import StatHover   from '@/assets/images/dark/common/btn/LNB_Menu/btn_lnb_menu_4statistics_hover.svg';
import StatActive  from '@/assets/images/dark/common/btn/LNB_Menu/btn_lnb_menu_4statistics_active.svg';

export const NAV_CODE = {
  HOME:  'HOME',
  EVENT: 'EVENT',
  FAC:   'FAC',
  SCHE:  'SCHE',
  STAT:  'STAT',
} as const;

export type NavCode = typeof NAV_CODE[keyof typeof NAV_CODE];

export const NAV_LIST: NavType[] = [
  { nm: '홈',       cd: NAV_CODE.HOME,  back: HomeNormal,  hover: HomeHover,  active: HomeActive  },
  { nm: '이벤트 현황', cd: NAV_CODE.EVENT, back: EventNormal, hover: EventHover, active: EventActive },
  { nm: '시설물 현황', cd: NAV_CODE.FAC,   back: FacNormal,   hover: FacHover,   active: FacActive   },
  { nm: '스케줄 관리', cd: NAV_CODE.SCHE,  back: ScheNormal,  hover: ScheHover,  active: ScheActive  },
  { nm: '통계 현황', cd: NAV_CODE.STAT,  back: StatNormal,  hover: StatHover,  active: StatActive  },
];

export const NAV_MAP: Record<NavCode, NavType> = Object.fromEntries(
  NAV_LIST.map((nav) => [nav.cd, nav]),
) as Record<NavCode, NavType>;
