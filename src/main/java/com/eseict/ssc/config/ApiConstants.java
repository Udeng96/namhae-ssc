package com.eseict.ssc.config;

import com.eseict.common.base.SystemProperties;

import java.util.Arrays;
import java.util.List;

public class ApiConstants {
    public static final String HOME_PATH = SystemProperties.getProperty("SSC_HOME");
    public static final String IS_DEV = SystemProperties.getProperty("IS_DEV");

    public static final List<String> FILE_IMAGE_EXTS  = Arrays.asList("jpeg", "jpg", "png");
    public static final List<String> FILE_IMAGE_TYPES = Arrays.asList("image/jpeg", "image/jpg", "image/png");
    public static final List<String> FILE_VIDEO_EXTS  = Arrays.asList("mov", "mp4", "wmv", "flv");
    public static final List<String> FILE_VIDEO_TYPES = Arrays.asList("video/quicktime", "video/mp4", "video/x-ms-wmv", "video/flv");

    public static final String FAC_CCTV_LIFE = "FCC_d24fc002594b41c48ebdf42cbb2840fd";
    public static final String FAC_CCTV_PARK = "FCC_d275a7ce228342ddaf408a383c902566";

    public static final String FAC_SSC_TOP = "FCC_167ba70009574ed5a5e69abbf3e87e50";
    public static final String FAC_SC_CENTER = "FCC_d86bc6fa999b4f4b8e2ee50c58bb5715";      //경로당
    public static final String FAC_SC_BELL = "FCC_2f10d03a3afa4f97aa5457c4439acd46";
    public static final String FAC_SC_FIRE = "FCC_440a1157ed1541cd92d826e9a3348422";
    public static final String FAC_SC_GAS = "FCC_1fcb0c9ec9cd43229c364e9d6ecc0cca";
    public static final String FAC_SC_SETTOP1 = "FCC_50b234bbbd1c40efbe2519e4a7adec19";
    public static final String FAC_SC_SETTOP2 = "FCC_539e216abc34401ea9eb9ba7e025a48c";
    public static final String FAC_SC_CCTV_K = "FCC_f2e7e04e0cc14590a37e3e3ebf351fea";      //주방
    public static final String FAC_SC_CCTV_B = "FCC_dceef8ba2600418d9bb03b76c2fb03e3";      //비상벨
    public static final String FAC_SC_CCTV_L = "FCC_af38992127a1493aaadd9d867794f179";      //거실
    public static final String FAC_SC_CCTV_3 = "FCC_daf2f5810a384938ae5236630afd4bcb";      //3

    public static final String SSC = "SSC";

    // 메시지 교환 방식
    public static class MSG_EXCH_PTRN {
        public static final String ONE_WAY = "1";
        public static final String ONE_WAY_ACK = "2";

        private MSG_EXCH_PTRN() {
        }
    }

    public static class CONTENT_TYPE{
        public static final String VIDEO = "VIDEO";
        public static final String NORMAL = "NOTICE_N";
        public static final String EMERGENCY = "NOTICE_E";
        public static final String SENIOR_EVENT = "NOTICE_S";
    }

    public static class CONTENT_MESSAGE{
        public static final String FIRE = "화재 경보가 감지되었습니다.\n연기와 불길에 주의하시어\n즉시 안전한 곳으로 대피해 주세요.";
        public static final String GAS = "가스 누출이 감지되었습니다.\n최대한 몸을 숙이고 숨을 참으며\n즉시 외부로 대피해 주세요.";
    }

    public static class DbSchema {
        public static final String FMS = "fms";
        public static final String IOC = "ioc";
        public static final String SOCIAL = "social";
        public static final String SCHE = "schedule";
        public static final String CONF = "conference";
        public static final String SMS = "sms";
        public static final String SCM = "scm";
        public static final String MCS = "mcs";
        public static final String OMS = "oms";
        public static final String DEPT = "dashboard";
        public static final String SHARE = "share";

    }

    public static class Common {
        public static final String API_PRODUCES = "application/json;charset=utf8";
        public static final String TIME_ZONE = "Asia/Seoul";
    }

    public static class IsDev {
        public static final String DEV = "true";
    }

    public static class Result {
        public static final String SUCCESS_CODE = "SUCCESS";
        public static final String FAIL_CODE = "FAIL";
        public static final String OMS_SUCCESS_CODE = "OK";

    }

    public static class REPORT_RESULT {
        public static final String SUCCESS_CODE = "00";
        public static final String FAIL_CODE = "01";
    }

    public static class REPORT_MESSAGE {
        public static final String HEAT_WAVE_MSG = "논·밭·건설 현장 야외활동 자제\n 이웃 간 안부 확인\n 무더위 쉼터이용\n 물놀이 안전사고 유의";
        public static final String STRONG_WIND_MSG = "야외 활동 자제, 주변 낙하물 주의\n 해안가 높은 파도로 피해 우려\n 위험 지역 접근금지";
        public static final String STORM_MSG= "높은 파도와 해일로 침수 예상\n 해안가 접근 금지\n 저지대 주민들\n 즉시 높은 지대로 대피";
        public static final String RAIN_FALL_MSG = "산사태 및 해안가\n 위험지역 접근 금지\n 외부 활동 자제\n 빗길 안전 운전";
        public static final String HEAVY_SNOW_MSG = "야외활동과 차량 운행 자제\n 비밀하우스 등 붕괴 대비\n 보행 주의 대중교통 이용";
        public static final String DRY_MSG = "야외에서 불씨 관리 주의\n 논두렁 태우기 자제\n 산불 및 화재 발생에 유의";
        public static final String STORM_SURGE_MSG = "높은 파도와 강풍 예상\n 선박 운항 자제\n 해안가의 안전사고 대비";
        public static final String COLD_WAVE_MSG = "수도관 동파, 농작물 피해 대비\n 노약자와 어린이는 야외 활동 자제\n 외출 시 보온조치 강화";
        public static final String YELLOW_DUST_MSG = "실내 황사 유입 방지\n 어린이나 노약자 야외 활동 자제\n 외출 시 보건용 마스크 착용";
        public static final String TYPHOON_MSG = "가급적 실내에서 대비\n 외출 자제\n 이웃 및 가족 간 안부 확인\n 위험 징후 시 안전한 곳으로 대피";

        public static final String NONE = "특보 없음";
    }

    public static class REPORT_TYPE{
        public static final String HEAT_WAVE = "폭염";
        public static final String STRONG_WIND = "강풍";
        public static final String STORM = "풍랑";
        public static final String RAIN_FALL = "호우";
        public static final String HEAVY_SNOW = "대설";
        public static final String DRY = "건조";
        public static final String STORM_SURGE = "폭풍해일";
        public static final String COLD_WAVE = "한파";
        public static final String YELLOW_DUST = "황사";
        public static final String TYPHOON = "태풍";
        public static final String NONE="없음";
    }

    public static class SCHE_RESULT{
        public static final String DUPLICATE = "DUPLICATE";
        public static final String SUCCESS = "SUCCESS";
        public static final String FAILED = "FAILED";
        public static final String NO_SHCEDULE = "NO_SHCEDULE";
    }

    public static class DATE {
        public static final String FORMAT_8 = "yyyyMMdd";
        public static final String FORMAT_14 = "yyyyMMddHHmmss";
        public static final String FORMAT_17 = "yyyyMMddHHmmssSSS";
        public static final String HOUR_FORMAT = "HH";
        public static final String MIN_FORMAT = "mm";
        public static final String SEC_FORMAT = "ss";
    }

    public static class EVENT_NULL {
        public static final String PLCID_NULL = "ESEICTSSC";
    }

    public static class EVENT{
        public static class EVENT_CAT{
            public static final String EVENT_BELL = "01";
        }
    }

    public static class SHARE{
        public static final String SMS = "SMS";
        public static final String BROADCAST = "BRC";
    }

    public static class BROADCAST{
        public static final String BROADCAST_DEVICE_CODE = "FCC_e5ad89d0e76641b78618d9b0963accfb";
    }

    public static class YOUTUBE_VIDEO_DURATION_TYPE {
        public static final String SHORT = "short";
        public static final String MEDIUM = "medium";
    }

}


