import Weather01Icon from "@/assets/images/dark/page/SeniorCenter_Dashboard/img/weather/icon_seniorCenter_vertical_weather_01.svg";
import Weather02Icon from "@/assets/images/dark/page/SeniorCenter_Dashboard/img/weather/icon_seniorCenter_vertical_weather_02.svg";
import Weather03Icon from "@/assets/images/dark/page/SeniorCenter_Dashboard/img/weather/icon_seniorCenter_vertical_weather_03.svg";
import Weather04Icon from "@/assets/images/dark/page/SeniorCenter_Dashboard/img/weather/icon_seniorCenter_vertical_weather_04.svg";
import Weather05Icon from "@/assets/images/dark/page/SeniorCenter_Dashboard/img/weather/icon_seniorCenter_vertical_weather_05.svg";
import Weather06Icon from "@/assets/images/dark/page/SeniorCenter_Dashboard/img/weather/icon_seniorCenter_vertical_weather_06.svg";

import Dust01Icon from "@/assets/images/dark/page/SeniorCenter_Dashboard/img/dust/ic_face-good_default_fill_normal_color01_36.svg";
import Dust02Icon from "@/assets/images/dark/page/SeniorCenter_Dashboard/img/dust/ic_face-soso_default_fill_normal_color01_36.svg";
import Dust03Icon from "@/assets/images/dark/page/SeniorCenter_Dashboard/img/dust/ic_face-bad_default_fill_normal_color01_36.svg";
import Dust04Icon from "@/assets/images/dark/page/SeniorCenter_Dashboard/img/dust/ic_face-terrible_default_fill_normal_color01_36.svg";
import Dust05Icon from "@/assets/images/dark/page/SeniorCenter_Dashboard/img/dust/ic_face-question_default_fill_normal_color01_36.svg";

import IMAGEICON from "@/assets/images/dark/social/icon_seniorCenter_vertical_noData.png";

import IMAGE  from "@/assets/images/dark/social/img_seniorCenter_vertical_illust_noData1.png";
import IMAGE2 from "@/assets/images/dark/social/img_seniorCenter_vertical_illust_noData2.png";
import IMAGE3 from "@/assets/images/dark/social/img_seniorCenter_vertical_illust_noData3.png";

import HeatBackImg    from "@/assets/images/dark/page/SeniorCenter_Dashboard/img/report/img_specialWeather_fullPop_10_heatWave.png";
import GaleBackImg    from "@/assets/images/dark/page/SeniorCenter_Dashboard/img/report/img_specialWeather_fullPop_1_gale.png";
import HighSeaBackImg from "@/assets/images/dark/page/SeniorCenter_Dashboard/img/report/img_specialWeather_fullPop_2_highSeas.png";
import RainBackImg    from "@/assets/images/dark/page/SeniorCenter_Dashboard/img/report/img_specialWeather_fullPop_3_heavyRain.png";
import SnowBackImg    from "@/assets/images/dark/page/SeniorCenter_Dashboard/img/report/img_specialWeather_fullPop_4_heavySnow.png";
import DryBackImg     from "@/assets/images/dark/page/SeniorCenter_Dashboard/img/report/img_specialWeather_fullPop_5_dry.png";
import StormBackImg   from "@/assets/images/dark/page/SeniorCenter_Dashboard/img/report/img_specialWeather_fullPop_6_stormSurge.png";
import TyphoonBackImg from "@/assets/images/dark/page/SeniorCenter_Dashboard/img/report/img_specialWeather_fullPop_7_typhoon.png";
import DustBackImg    from "@/assets/images/dark/page/SeniorCenter_Dashboard/img/report/img_specialWeather_fullPop_8_yellowDust.png";
import ColdBackImg    from "@/assets/images/dark/page/SeniorCenter_Dashboard/img/report/img_specialWeather_fullPop_9_coldWave.png";
import TITLE_ICON from "@/assets/images/dark/common/img/ic_emergency-bell-04_default_fill_normal_color01_120.png";

export const SOCIAL_IMAGE = {
  WEATHER: {
    SUN:       Weather01Icon,
    CLOUDY:    Weather02Icon,
    CLOUD:     Weather03Icon,
    RAIN:      Weather04Icon,
    SNOW:      Weather05Icon,
    SNOW_RAIN: Weather06Icon,
  },
  DUST: {
    GOOD:    Dust01Icon,
    NORM:    Dust02Icon,
    BAD:     Dust03Icon,
    TOO_BAD: Dust04Icon,
    NONE:    Dust05Icon,
  },
  REPORT: {
    HEAT:     HeatBackImg,
    GALE:     GaleBackImg,
    HIGH_SEA: HighSeaBackImg,
    RAIN:     RainBackImg,
    SNOW:     SnowBackImg,
    DRY:      DryBackImg,
    STORM:    StormBackImg,
    TYPHOON:  TyphoonBackImg,
    DUST:     DustBackImg,
    COLD:     ColdBackImg,
  },
  EVENT: { TITLE_ICON },
  CONTENT: {
    PHOTO: {
      NONE: {
        ICON: IMAGEICON,
        BACK: { ONE: IMAGE, TWO: IMAGE2, THREE: IMAGE3 },
      },
    },
  },
};
