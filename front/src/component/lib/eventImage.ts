import LeftOpenBtn from "@/assets/images/dark/common/btn/btn_slide_left_open_normal.svg";
import LeftOpenBtnHover from "@/assets/images/dark/common/btn/btn_slide_left_open_hover.svg";
import LeftOpenBtnClick from "@/assets/images/dark/common/btn/btn_slide_left_open_click.svg";
import LeftClsBtn from "@/assets/images/dark/common/btn/btn_slide_left_close_normal.svg";
import LeftClsBtnHover from "@/assets/images/dark/common/btn/btn_slide_left_close_hover.svg";
import LeftClsBtnClick from "@/assets/images/dark/common/btn/btn_slide_left_close_click.svg";

import RightOpenBtn from "@/assets/images/dark/common/btn/btn_slide_right_open_normal.svg";
import RightOpenBtnHover from "@/assets/images/dark/common/btn/btn_slide_right_open_hover.svg";
import RightOpenBtnClick from "@/assets/images/dark/common/btn/btn_slide_right_open_click.svg";
import RightClsBtn from "@/assets/images/dark/common/btn/btn_slide_right_close_normal.svg";
import RightClsBtnHover from "@/assets/images/dark/common/btn/btn_slide_right_close_hover.svg";
import RightClsBtnClick from "@/assets/images/dark/common/btn/btn_slide_right_close_click.svg";

import SearchIcon from "@/assets/images/dark/page/Management_Dashboard/icon/icon_eventTab_title_search.svg"

import SearchDropIcon from "@/assets/images/dark/common/btn/btn_dropdown_arrow_normal.svg";
import SearchDropIconHover from "@/assets/images/dark/common/btn/btn_dropdown_arrow_hover.svg";
import SearchBtn from "@/assets/images/dark/common/icon/icon_btn_search.svg";

import MoreBtn from "@/assets/images/dark/common/btn/btn_list_folding_goOpen_normal.svg";
import MoreBtnHover from "@/assets/images/dark/common/btn/btn_list_folding_goOpen_hover.svg";
import MoreClsBtn from "@/assets/images/dark/common/btn/btn_list_folding_goClose_normal.svg";
import MoreClsBtnHover from "@/assets/images/dark/common/btn/btn_list_folding_goClose_hover.svg";

import eventModalIcon from "@/assets/images/dark/page/Management_Dashboard/icon/icon_eventHistory_pop_header.svg"
import eventModalDetailIcon from "@/assets/images/dark/page/Management_Dashboard/icon/icon_evnetHistory_title_detailInfo.svg"

import EventIcon from "@/assets/images/dark/common/icon/GIS_Icons/icon_cctvNetwork_locating_event.svg";
import CCTV_ICON_1 from "@/assets/images/dark/common/icon/GIS_Icons/ic-gis-number1_default_fill_normal_color01_40x44.svg";
import CCTV_ICON_2 from "@/assets/images/dark/common/icon/GIS_Icons/ic-gis-number2_default_fill_normal_color01_40x44.svg";
import CCTV_ICON_3 from "@/assets/images/dark/common/icon/GIS_Icons/ic-gis-number3_default_fill_normal_color01_40x44.svg";

import GIS_LINE_1 from "@/assets/images/dark/common/img/img_connection-A_84x44.svg";
import GIS_LINE_2 from "@/assets/images/dark/common/img/img_connection-B_84x44.svg";
import GIS_LINE_3 from "@/assets/images/dark/common/img/img_connection-C_84x44.svg";
import GIS_LINE_4 from "@/assets/images/dark/common/img/img_connection-D_84x44.svg";

import EXPANSION_NORM from "@/assets/images/dark/common/btn/btn_cctv_window_expansion_normal.svg";
import EXPANSION_HOVER from "@/assets/images/dark/common/btn/btn_cctv_window_expansion_hover.svg";

import ShareModalIcon from "@/assets/images/dark/page/Management_Dashboard/icon/icon_title_pop_eventDisseminateMangement.png";

export const EVENT_IMAGE = {
  CONTENT: {
    BTN: {
      LEFT: {
        OPEN: { NORMAL: LeftOpenBtn, HOVER: LeftOpenBtnHover, ACTIVE: LeftOpenBtnClick },
        CLS:  { NORMAL: LeftClsBtn,  HOVER: LeftClsBtnHover,  ACTIVE: LeftClsBtnClick },
      },
      RIGHT: {
        OPEN: { NORMAL: RightOpenBtn, HOVER: RightOpenBtnHover, ACTIVE: RightOpenBtnClick },
        CLS:  { NORMAL: RightClsBtn,  HOVER: RightClsBtnHover,  ACTIVE: RightClsBtnClick },
      },
    },
    SEARCH: {
      ICON: SearchIcon,
      BTN:  SearchBtn,
      DROP: { BASE: SearchDropIcon, HOVER: SearchDropIconHover },
    },
    LIST: {
      ITEM: {
        MORE: {
          DOWN: { BASE: MoreBtn,    HOVER: MoreBtnHover },
          UP:   { BASE: MoreClsBtn, HOVER: MoreClsBtnHover },
        },
      },
    },
    MODAL: { ICON: eventModalIcon, DETAIL_ICON: eventModalDetailIcon },
  },
  GIS: {
    MARKER: {
      EVENT: EventIcon,
      CCTV:  { FIRST: CCTV_ICON_1, SECOND: CCTV_ICON_2, THIRD: CCTV_ICON_3 },
    },
    LINE: { FIRST: GIS_LINE_1, SECOND: GIS_LINE_2, THIRD: GIS_LINE_3, FOURTH: GIS_LINE_4 },
    BTN: {
      PLAYER: {
        EXPANSION: { NORM: EXPANSION_NORM, HOVER: EXPANSION_HOVER },
      },
    },
  },
  SMS: { ICON: ShareModalIcon },
};
