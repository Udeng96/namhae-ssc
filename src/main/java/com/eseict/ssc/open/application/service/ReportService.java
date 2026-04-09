package com.eseict.ssc.open.application.service;

import com.eseict.common.net.http.HttpConnection;
import com.eseict.common.net.http.HttpConnectionException;
import com.eseict.ssc.config.ApiConstants;
import com.eseict.ssc.open.application.dto.ReportResponse;
import com.eseict.ssc.open.application.dto.ReportResult;
import com.eseict.ssc.open.application.util.OpenUtil;
import com.eseict.ssc.common.util.DateTimeUtil;
import com.google.gson.Gson;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * ReportService (refac) — 기상특보 조회
 *
 * 기존(service/newOpen/ReportService) 개선:
 *   - 동일한 실패 응답 반환 패턴(4~5회 중복) → failResult() 헬퍼로 통합
 *   - service.newOpen.OpenUtil → refac.open.application.util.OpenUtil 참조 변경
 *   - getResultTime(): resultTime 파싱에서 "/시", "/분" split 오류 수정
 *     ("시 분" 형식 치환이 "/" 포함 오류로 적용 안 됨 → 올바른 문자열 처리)
 */
@RequiredArgsConstructor
@Service
@Slf4j
public class ReportService {

    private final Gson gson = new Gson();
    private final OpenUtil openUtil;   // refac.open.application.util.OpenUtil 참조

    @Value("${api.weather.report.url}")
    private String reportUrl;
    @Value("${api.weather.report.key}")
    private String reportKey;
    @Value("${api.weather.report.stnId}")
    private String reportStnId;

    public ReportResult getReportInfoFromApi() {
        Map<String, String> params = new HashMap<>();
        String todayDate = DateTimeUtil.getNowLocalDateTimeFormat8();
        params.put("serviceKey", reportKey);
        params.put("stnId", reportStnId);
        params.put("fromTmFc", todayDate);
        params.put("toTmFc", todayDate);
        params.put("dataType", "JSON");
        params.put("numOfRows", "10");
        params.put("pageNo", "1");

        String response;
        try {
            response = (String) new HttpConnection().doGet(reportUrl, new HashMap<>(), params);
        } catch (HttpConnectionException e) {
            throw new RuntimeException(e);
        }

        // 응답 없거나 오류 XML 반환 시
        if (response == null || response.trim().startsWith("<OpenAPI_ServiceResponse>")) {
            return failResult();
        }

        ReportResponse reportResult = gson.fromJson(response, ReportResponse.class);
        String resultCode = reportResult.getResponse().getHeader().getResultCode();

        // 정상 데이터 없음(00: 데이터 없음, 03: 노데이터)
        if ("00".equals(resultCode) || "03".equals(resultCode)) {
            return failResult();
        }

        List<ReportResponse.Item> reportItems = reportResult.getReportItems();
        if (reportItems.isEmpty()) {
            return failResult();
        }

        ReportResponse.Item item = reportItems.get(0);

        // 특보 해제
        if (item.getT1().contains("해제")) {
            return ReportResult.builder()
                    .resultCode(ApiConstants.REPORT_RESULT.SUCCESS_CODE)
                    .resultMessage(ApiConstants.REPORT_MESSAGE.NONE)
                    .resultTitle(item.getT1())
                    .resultType("NONE")
                    .build();
        }

        // 기상특보 활성
        List<String> typeAndMsg = openUtil.setReportType(item.getT1());
        return ReportResult.builder()
                .resultCode(ApiConstants.REPORT_RESULT.SUCCESS_CODE)
                .resultTitle(item.getT1())
                .resultType(typeAndMsg.get(0))
                .resultMessage(typeAndMsg.get(1))
                .resultTime(parseResultTime(item.getT3()))
                .build();
    }

    // ── private ──────────────────────────────────────────

    /**
     * 실패 응답 반환 헬퍼 — 기존 동일한 Builder 호출 4~5회 중복 제거
     */
    private ReportResult failResult() {
        return ReportResult.builder()
                .resultCode(ApiConstants.REPORT_RESULT.FAIL_CODE)
                .resultMessage(ApiConstants.REPORT_MESSAGE.NONE)
                .resultTitle(ApiConstants.REPORT_MESSAGE.NONE)
                .resultType("NONE")
                .build();
    }

    /**
     * 특보 시각 파싱
     * 기존: resultTime.contains("/시") → "/시"는 존재하지 않는 문자열 (버그)
     * 수정: "시 " → ":" , "분" → "" 로 올바르게 치환
     */
    private String parseResultTime(String t3) {
        String time = t3.split(":")[1]
                .replace("/r", "")
                .replace("/n", "")
                .replace("시 ", ":")
                .replace("분", "")
                .trim();
        return time;
    }
}
