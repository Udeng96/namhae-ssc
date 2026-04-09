import fileHeadIcon from "@/assets/images/dark/page/Management_Dashboard/icon/icon_contentsTab_title_list.svg";
import fileUploadIcon from "@/assets/images/dark/page/Management_Dashboard/icon/icon_btn_upload.svg";
import fileNoticeIcon from "@/assets/images/dark/page/Management_Dashboard/icon/icon_list_notification.svg";

import FileDel from "@/assets/images/dark/page/Management_Dashboard/btn/btn_scheduleContents_delete_normal.svg";
import FileDelHover from "@/assets/images/dark/page/Management_Dashboard/btn/btn_scheduleContents_delete_hover.svg";
import FilePlusBtn from "@/assets/images/dark/page/Management_Dashboard/icon/icon_btn_contents_plus.svg";

import ImageIcon from "@/assets/images/dark/page/Management_Dashboard/icon/icon_btn_image_file.svg";
import VideoIcon from "@/assets/images/dark/page/Management_Dashboard/icon/icon_btn_video_file.svg";

import MainHeadIcon from "@/assets/images/dark/page/Management_Dashboard/icon/icon_contentsTab_title_list.svg";
import UploadImg from "@/assets/images/dark/page/Management_Dashboard/img/img_fileUpload_pop.svg";

import first from "@/assets/images/dark/page/Management_Dashboard/img/onboarding/img_onboarding-tooltip01_176x34.svg";
import second from "@/assets/images/dark/page/Management_Dashboard/img/onboarding/img_onboarding-tooltip02_176x34.svg";
import third from "@/assets/images/dark/page/Management_Dashboard/img/onboarding/img_onboarding-tooltip03_176x34.svg";

import firstImage from "@/assets/images/dark/page/Management_Dashboard/img/onboarding/G-NH-02_01_05-29.png"
import secondImage from "@/assets/images/dark/page/Management_Dashboard/img/onboarding/G-NH-02_01_05-30.png"
import thirdImage from "@/assets/images/dark/page/Management_Dashboard/img/onboarding/G-NH-02_01_05-31.png"

import WideNoneImg from "@/assets/images/dark/page/SeniorCenter_Dashboard/img/img_seniorCenter_horizontal_illust_ranch.png";
import NoneImg from "@/assets/images/dark/page/SeniorCenter_Dashboard/img/img_seniorCenter_vertical_illust_ranch.png";
import FireImg from "@/assets/images/dark/page/SeniorCenter_Dashboard/img/img_content_notice_bgPresset_fire.png";
import AccidentImg from "@/assets/images/dark/page/SeniorCenter_Dashboard/img/img_content_notice_bgPresset_accident.png";
import TyphoonImg from "@/assets/images/dark/page/SeniorCenter_Dashboard/img/img_content_notice_bgPresset_typhoon.png";

import SaveIcon from "@/assets/images/dark/page/Management_Dashboard/icon/icon_btn_save.svg";
import SubmitIcon from "@/assets/images/dark/page/Management_Dashboard/icon/icon_btn_transmission.svg";
import EditIcon from "@/assets/images/dark/page/Management_Dashboard/icon/icon_btn_edit.svg";
import DelIcon from "@/assets/images/dark/page/Management_Dashboard/icon/icon_btn_delete.svg";

export const SCHE_IMAGE = {
  FILE: {
    HEAD: {
      TITLE_ICON:  fileHeadIcon,
      UPLOAD_ICON: fileUploadIcon,
      NOTICE_ICON: fileNoticeIcon,
    },
    BODY: {
      DEL_BTN:   { BASE: FileDel, HOVER: FileDelHover },
      PLUS_BTN:  { BASE: FilePlusBtn },
      FILE_ICON: { IMAGE: ImageIcon, VIDEO: VideoIcon },
    },
    MODAL: { UP: UploadImg },
  },
  MAIN: {
    HEAD: { TITLE_ICON: MainHeadIcon },
    BACK: {
      NONE:    { WIDE: WideNoneImg, NORM: NoneImg },
      FIRE:    FireImg,
      TYPHOON: TyphoonImg,
      SAFETY:  AccidentImg,
    },
  },
  BOARD: {
    IMAGE:   { FIRST: firstImage,  SECOND: secondImage,  THIRD: thirdImage },
    TOOLTIP: { FIRST: first,       SECOND: second,       THIRD: third },
    BTN:     { SAVE: SaveIcon, EDIT: EditIcon, DEL: DelIcon, SUBMIT: SubmitIcon },
  },
};
