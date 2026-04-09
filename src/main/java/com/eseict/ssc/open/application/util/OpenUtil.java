package com.eseict.ssc.open.application.util;

import com.eseict.ssc.config.ApiConstants;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.List;

/**
 * OpenUtil (refac) — 기상특보 타입/메시지 변환 유틸
 *
 * 기존(service/newOpen/OpenUtil/OpenUtil):
 *   - 패키지 변경 (service.newOpen.OpenUtil → refac.open.application.util)
 *   - @Component 유지 (ReportService Bean 주입)
 */
@Component
public class OpenUtil {

    public List<String> setReportType(String title) {
        if (title.contains(ApiConstants.REPORT_TYPE.HEAT_WAVE)) {
            return Arrays.asList("10", ApiConstants.REPORT_MESSAGE.HEAT_WAVE_MSG);
        } else if (title.contains(ApiConstants.REPORT_TYPE.STRONG_WIND)) {
            return Arrays.asList("01", ApiConstants.REPORT_MESSAGE.STRONG_WIND_MSG);
        } else if (title.contains(ApiConstants.REPORT_TYPE.STORM)) {
            return Arrays.asList("02", ApiConstants.REPORT_MESSAGE.STORM_MSG);
        } else if (title.contains(ApiConstants.REPORT_TYPE.RAIN_FALL)) {
            return Arrays.asList("03", ApiConstants.REPORT_MESSAGE.RAIN_FALL_MSG);
        } else if (title.contains(ApiConstants.REPORT_TYPE.HEAVY_SNOW)) {
            return Arrays.asList("04", ApiConstants.REPORT_MESSAGE.HEAVY_SNOW_MSG);
        } else if (title.contains(ApiConstants.REPORT_TYPE.DRY)) {
            return Arrays.asList("05", ApiConstants.REPORT_MESSAGE.DRY_MSG);
        } else if (title.contains(ApiConstants.REPORT_TYPE.STORM_SURGE)) {
            return Arrays.asList("06", ApiConstants.REPORT_MESSAGE.STORM_SURGE_MSG);
        } else if (title.contains(ApiConstants.REPORT_TYPE.TYPHOON)) {
            return Arrays.asList("07", ApiConstants.REPORT_MESSAGE.TYPHOON_MSG);
        } else if (title.contains(ApiConstants.REPORT_TYPE.YELLOW_DUST)) {
            return Arrays.asList("08", ApiConstants.REPORT_MESSAGE.YELLOW_DUST_MSG);
        } else if (title.contains(ApiConstants.REPORT_TYPE.COLD_WAVE)) {
            return Arrays.asList("09", ApiConstants.REPORT_MESSAGE.COLD_WAVE_MSG);
        } else {
            return Arrays.asList("NONE", ApiConstants.REPORT_MESSAGE.NONE);
        }
    }
}
