/**
 * 홈 화면(Dashboard) 이미지 모음
 * - 기존 homeImage.ts에서 이전, assets 경로 그대로 유지
 */
import AllMapImg from '@/assets/images/dark/page/Management_Dashboard/img/home_map/img_homeBg_0whole_sea.png';
import AllMapBack from '@/assets/images/dark/page/Management_Dashboard/img/whole/img_homeBg_0whole_island.png';

import EventIcon from '@/assets/images/dark/page/Management_Dashboard/icon/main_gis/icon_home_infoWindow_event.svg';
import FacIcon from '@/assets/images/dark/page/Management_Dashboard/icon/main_gis/icon_home_infoWindow_facility.svg';

import IdongBack from '@/assets/images/dark/page/Management_Dashboard/img/whole/img_homeBg_focus_idong.png';
import SangjuBack from '@/assets/images/dark/page/Management_Dashboard/img/whole/img_homeBg_focus_sangju.png';
import SamdongBack from '@/assets/images/dark/page/Management_Dashboard/img/whole/img_homeBg_focus_samdong.png';
import MijoBack from '@/assets/images/dark/page/Management_Dashboard/img/whole/img_homeBg_focus_mijo.png';
import ChangseonBack from '@/assets/images/dark/page/Management_Dashboard/img/whole/img_homeBg_focus_changseon.png';
import SeoBack from '@/assets/images/dark/page/Management_Dashboard/img/whole/img_homeBg_focus_seo.png';
import NamBack from '@/assets/images/dark/page/Management_Dashboard/img/whole/img_homeBg_focus_nam.png';
import SeolBack from '@/assets/images/dark/page/Management_Dashboard/img/whole/img_homeBg_focus_seolcheon.png';
import GohyeonBack from '@/assets/images/dark/page/Management_Dashboard/img/whole/img_homeBg_focus_gohyeon.png';
import NamhaeBack from '@/assets/images/dark/page/Management_Dashboard/img/whole/img_homeBg_focus_namhae.png';

import NAMHAE_SUB_AREA from '@/assets/images/dark/page/Management_Dashboard/img/home_map/img_homeBg_8_namhae.png';
import IDONG_SUB_AREA from '@/assets/images/dark/page/Management_Dashboard/img/home_map/img_homeBg_1_idong.png';
import SANGJU_SUB_AREA from '@/assets/images/dark/page/Management_Dashboard/img/home_map/img_homeBg_3_sangju.png';
import SAMDONG_SUB_AREA from '@/assets/images/dark/page/Management_Dashboard/img/home_map/img_homeBg_2_samdong.png';
import MIJO_SUB_AREA from '@/assets/images/dark/page/Management_Dashboard/img/home_map/img_homeBg_4_mijo.png';
import SEO_SUB_AREA from '@/assets/images/dark/page/Management_Dashboard/img/home_map/img_homeBg_6_seo.png';
import NAM_SUB_AREA from '@/assets/images/dark/page/Management_Dashboard/img/home_map/img_homeBg_10_nam.png';
import SEOL_SUB_AREA from '@/assets/images/dark/page/Management_Dashboard/img/home_map/img_homeBg_9_seolcheon.png';
import GOHYEON_SUB_AREA from '@/assets/images/dark/page/Management_Dashboard/img/home_map/img_homeBg_7_gohyeon.png';
import CHANGSON_SUB_AREA from '@/assets/images/dark/page/Management_Dashboard/img/home_map/img_homeBg_5_changseon.png';

import normScIcon from '@/assets/images/dark/page/Management_Dashboard/icon/main_gis/icon_home_Poi_seniorCenter_normality_normal.svg';
import errorScIcon from '@/assets/images/dark/page/Management_Dashboard/icon/main_gis/icon_home_Poi_seniorCenter_event.svg';

import ClsBtn from '@/assets/images/dark/page/Management_Dashboard/btn/btn_close_normal.png';
import ClsBtnHover from '@/assets/images/dark/page/Management_Dashboard/btn/btn_close_hover.png';

import NormalIcon from '@/assets/images/dark/page/Management_Dashboard/icon/icon_gisFacility_sensor_good.svg';
import ErrorIcon from '@/assets/images/dark/page/Management_Dashboard/icon/icon_gisFacility_sensor_error.svg';

import CctvIcon from '@/assets/images/dark/page/Management_Dashboard/icon/icon_gisFaility_sensor_cctv.svg';
import FireIcon from '@/assets/images/dark/page/Management_Dashboard/icon/icon_gisFaility_sensor_fire.svg';
import SettopIcon from '@/assets/images/dark/page/Management_Dashboard/icon/icon_gisFaility_sensor_set-topBox.svg';
import BellIcon from '@/assets/images/dark/page/Management_Dashboard/icon/icon_gisFaility_sensor_emergencyBell.svg';

import EventBellIcon from '@/assets/images/dark/page/Management_Dashboard/icon/main_gis/icon_home_infoWindow_event_emergencyBell.svg';
import EventFireIcon from '@/assets/images/dark/page/Management_Dashboard/icon/main_gis/icon_home_infoWindow_event_fire.svg';

export const HOME_MAP = {
  ALL: {
    BACK: AllMapImg,
    MAP: AllMapBack,
  },
  PANEL: {
    EVENT: EventIcon,
    FAC: FacIcon,
    BACK: {
      NAMHAE: NamhaeBack,
      IDONG: IdongBack,
      SANGJU: SangjuBack,
      SAMDONG: SamdongBack,
      MIJO: MijoBack,
      NAM: NamBack,
      CHANGSON: ChangseonBack,
      SEO: SeoBack,
      SEOL: SeolBack,
      GOHYEON: GohyeonBack,
    },
  },
  SUB: {
    BACK: {
      NAMHAE: NAMHAE_SUB_AREA,
      IDONG: IDONG_SUB_AREA,
      SANGJU: SANGJU_SUB_AREA,
      SAMDONG: SAMDONG_SUB_AREA,
      MIJO: MIJO_SUB_AREA,
      SEO: SEO_SUB_AREA,
      NAM: NAM_SUB_AREA,
      SEOL: SEOL_SUB_AREA,
      GOHYEON: GOHYEON_SUB_AREA,
      CHANGSON: CHANGSON_SUB_AREA,
    },
    ICON: {
      NORMAL: normScIcon,
      ERROR: errorScIcon,
    },
    PANEL: {
      CLOSE_BTN: {
        BASE: ClsBtn,
        HOVER: ClsBtnHover,
      },
      STATE: {
        NORMAL: NormalIcon,
        ERROR: ErrorIcon,
      },
      SENSOR: {
        CCTV: CctvIcon,
        FIRE: FireIcon,
        SETTOP: SettopIcon,
        BELL: BellIcon,
      },
      EVENT: {
        BELL: EventBellIcon,
        FIRE: EventFireIcon,
      },
    },
  },
};
