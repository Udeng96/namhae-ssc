import SortBtn from "@/assets/images/dark/page/Management_Dashboard/btn/btn_table_header_sort.svg"
import WarnIcon from "@/assets/images/dark/page/Management_Dashboard/icon/icon_list_facility_error.svg"

import StateReload from "@/assets/images/dark/common/icon/icon_btn_reload_normal.svg"
import StateReloadHover from "@/assets/images/dark/common/icon/icon_btn_reload_hover.svg"

import StateAddr from "@/assets/images/dark/common/icon/icon_rightPanel_address.svg"

import NormWideBack from "@/assets/images/dark/page/Management_Dashboard/img/img_bg_facility_sensor_wide_normality.svg";
import ErrorWideBack from "@/assets/images/dark/page/Management_Dashboard/img/img_bg_facility_sensor_wide_breakdown.svg";
import NormBack from "@/assets/images/dark/page/Management_Dashboard/img/img_bg_facility_sensor_short_normality.svg";
import ErrorBack from "@/assets/images/dark/page/Management_Dashboard/img/img_bg_facility_sensor_short_breakdown.svg";

import NormIcon from "@/assets/images/dark/page/Management_Dashboard/icon/icon_rightPanel_sensor_deteail_normality.svg";
import ErrorIcon from "@/assets/images/dark/page/Management_Dashboard/icon/icon_rightPanel_sensor_deteail_breakdown.svg";

import FireIcon from "@/assets/images/dark/page/Management_Dashboard/icon/icon_rightPanel_sensor_fire.svg";
import BellIcon from "@/assets/images/dark/page/Management_Dashboard/icon/icon_rightPanel_sensor_emergencyBell.svg";
import SettopIcon from "@/assets/images/dark/page/Management_Dashboard/icon/icon_rightPanel_sensor_set-topBox.svg";
import CCTVIcon from "@/assets/images/dark/page/Management_Dashboard/icon/icon_rightPanel_sensor_cctv.svg";
import ErrorScIconNormal from "@/assets/images/dark/common/icon/GIS_Icons/icon_gis_seniorCenter_event_normal.svg";
import ErrorScIconHover from "@/assets/images/dark/common/icon/GIS_Icons/icon_gis_seniorCenter_event_hover.svg";
import ErrorScIconActive from "@/assets/images/dark/common/icon/GIS_Icons/icon_gis_seniorCenter_event_active.svg";
import NormScIconNormal from "@/assets/images/dark/common/icon/GIS_Icons/icon_gis_seniorCenter_normality_normal.svg";
import NormScIconHover from "@/assets/images/dark/common/icon/GIS_Icons/icon_gis_seniorCenter_normality_hover.svg";
import NormScIconActive from "@/assets/images/dark/common/icon/GIS_Icons/icon_gis_seniorCenter_normality_active.svg";

export const FAC_IMAGE = {
  CONTENT: { SORT: SortBtn, WARN: WarnIcon },
  STATE: {
    RELOAD: { BASE: StateReload, HOVER: StateReloadHover },
    ADDR:   StateAddr,
    ICON:   { NORM: NormIcon, ERROR: ErrorIcon },
    BACK: {
      WIDE:   { NORM: NormWideBack,  ERROR: ErrorWideBack },
      NARROW: { NORM: NormBack,      ERROR: ErrorBack },
    },
    SENSOR: { FIRE: FireIcon, BELL: BellIcon, SETTOP: SettopIcon, CCTV: CCTVIcon },
  },
  GIS: {
    MARKER: {
      ERROR: { NORM: ErrorScIconNormal, HOVER: ErrorScIconHover, ACTIVE: ErrorScIconActive },
      NORM:  { NORM: NormScIconNormal,  HOVER: NormScIconHover,  ACTIVE: NormScIconActive },
    },
  },
};
