package com.eseict.ssc.open.application.service;

import com.eseict.common.net.http.HttpConnection;
import com.eseict.common.net.http.HttpConnectionException;
import com.eseict.ssc.open.application.dto.DustResult;
import com.eseict.ssc.open.domain.entity.Forecast;
import com.eseict.ssc.repository.social.ForecastRepository;
import com.eseict.ssc.util.XMLParser;
import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

/**
 * WeatherService (refac) — 날씨/미세먼지 조회 및 DB 업데이트
 *
 * 기존(service/newOpen/WeatherService) 개선:
 *   - updateWeather(): 동일한 save 분기 중복 제거 (findById 결과 무관하게 save)
 *   - getWeatherFromApi(): 내부 HttpConnection 직접 생성 → 공통 callApi() 헬퍼로 통일
 *   - getWeatherResponse(): 미사용 private 메서드 제거
 *   - getSpecialReportInfo(): WeatherService 범위 아님 → ReportService 전담으로 제거
 *   - getToday() / checkInvalidWeatherResponse() / setReportType() / setReportMsg():
 *     ReportService 전용 로직 제거 (WeatherService에서 사용 안 함)
 */
@RequiredArgsConstructor
@Service
@Slf4j
public class WeatherService {

    private final ForecastRepository forecastRepository;
    private final Gson gson = new Gson();

    @Value("${api.weather.info.key}")
    private String key;
    @Value("${api.weather.dust.key}")
    private String dustKey;
    @Value("${api.weather.info.ultra-url}")
    private String ultraUrl;
    @Value("${api.weather.dust.url}")
    private String dustUrl;
    @Value("${api.weather.info.grid.x}")
    private String gridX;
    @Value("${api.weather.info.grid.y}")
    private String gridY;

    // ── DB 조회 ───────────────────────────────────────────

    public Forecast getForecast() {
        return forecastRepository.findFirstByOrderByRegDtmDesc().get(0);
    }

    /**
     * 날씨 + 미세먼지 API → DB 동기화
     * 기존: findById 결과에 따라 if/else로 분기했지만 양쪽 모두 save() 호출 → 통합
     */
    public void updateWeather() {
        List<Forecast> weather = getWeatherFromApi();
        List<DustResult> dust   = getDustInfoFromApi();

        if (!weather.isEmpty() && !dust.isEmpty()) {
            Forecast f = weather.get(0);
            f.setPm10Grade(dust.get(0).getDust());
            f.setPm25Grade(dust.get(0).getUltraDust());
            forecastRepository.save(f);
            log.info("Weather sync success : {}", f.getUpdateDtm());
        }
    }

    // ── 미세먼지 API ──────────────────────────────────────

    public List<DustResult> getDustInfoFromApi() {
        Map<String, String> params = new HashMap<>();
        params.put("serviceKey", dustKey);
        params.put("pageNo", "1");
        params.put("numOfRows", "100");
        params.put("returnType", "JSON");
        params.put("sidoName", "%EA%B2%BD%EB%82%A8");
        params.put("ver", "1.0");

        DustResult dr = new DustResult("정보없음", "정보없음");
        try {
            String res = callApi(dustUrl, new HashMap<>(), params);
            if (res == null || res.startsWith("<?xml")) {
                return Collections.singletonList(dr);
            }

            JsonArray items = gson.fromJson(res, JsonObject.class)
                    .getAsJsonObject("response")
                    .getAsJsonObject("body")
                    .getAsJsonArray("items");

            if (items.size() > 0) {
                JsonObject o = items.get(0).getAsJsonObject();
                dr.setDust(o.get("pm10Value").getAsString());
                dr.setUltraDust(o.get("pm25Value").getAsString());
            }
        } catch (Exception e) {
            log.error("Dust API error", e);
        }
        return Collections.singletonList(dr);
    }

    // ── 초단기예보 API ────────────────────────────────────

    public List<Forecast> getWeatherFromApi() {
        Map<String, String> base = getBaseDateTimeForUltra();
        Map<String, String> params = new HashMap<>();
        params.put("serviceKey", key);
        params.put("dataType", "JSON");
        params.put("base_date", base.get("baseDate"));
        params.put("base_time", base.get("baseTime"));
        params.put("nx", gridX);
        params.put("ny", gridY);

        log.info("Weather API request base_date={}, base_time={}", base.get("baseDate"), base.get("baseTime"));

        try {
            String res = callApi(ultraUrl, new HashMap<>(), params);
            if (res == null) return Collections.emptyList();

            JsonObject json = gson.fromJson(res, JsonObject.class);
            String code = json.getAsJsonObject("response")
                    .getAsJsonObject("header")
                    .get("resultCode").getAsString();

            if (!"00".equals(code)) {
                log.info("기상청 API 오류 : {}", code);
                return Collections.emptyList();
            }

            JsonArray items = json.getAsJsonObject("response")
                    .getAsJsonObject("body")
                    .getAsJsonObject("items")
                    .getAsJsonArray("item");

            String tmp = "", sky = "", pty = "";
            for (JsonElement e : items) {
                JsonObject o = e.getAsJsonObject();
                switch (o.get("category").getAsString()) {
                    case "T1H": tmp = o.get("fcstValue").getAsString(); break;
                    case "SKY": sky = o.get("fcstValue").getAsString(); break;
                    case "PTY": pty = o.get("fcstValue").getAsString(); break;
                }
            }

            String skyNm = sky.equals("1") ? "맑음" : sky.equals("3") ? "구름 많음" : "흐림";
            String ptyNm = pty.equals("0") ? "없음" : pty.equals("1") ? "비" :
                    pty.equals("2") ? "비/눈" : pty.equals("3") ? "눈" :
                            pty.equals("4") ? "소나기" : "기타";

            return Collections.singletonList(new Forecast(
                    sky, pty, skyNm, ptyNm,
                    Integer.parseInt(tmp),
                    base.get("baseDate"),
                    base.get("baseDate") + base.get("baseTime")));

        } catch (Exception e) {
            log.error("Weather API error", e);
            return Collections.emptyList();
        }
    }

    // ── private ──────────────────────────────────────────

    /**
     * 공통 GET 호출 헬퍼 — 기존 getWeatherFromApi/getDustInfoFromApi에서 각자 HttpConnection을 생성하던 중복 제거
     * XML 오류 응답은 로그 후 null 반환
     *
     * 원본 코드 방식 유지: HttpConnection(raw) + Map(raw) — 제네릭 와일드카드 사용 시
     * doGet() 시그니처와 타입 불일치로 컴파일 오류 발생하므로 원본과 동일하게 raw 타입 사용
     */
    @SuppressWarnings("unchecked")
    private String callApi(String url, Map headers, Map params) {
        try {
            String res = (String) new HttpConnection().doGet(url, headers, params);
            if (res != null && res.trim().startsWith("<?xml")) {
                log.error("API XML error response: {}", XMLParser.parseReturnAuthMsg(res));
                return null;
            }
            return res;
        } catch (HttpConnectionException e) {
            log.error("API call failed: {}", e.getMessage());
            return null;
        }
    }

    private Map<String, String> getBaseDateTimeForUltra() {
        LocalDate date = LocalDate.now();
        LocalTime now  = LocalTime.now();

        int h = now.getHour();
        if (now.getMinute() < 45) h--;
        if (h < 0) {
            h = 23;
            date = date.minusDays(1);
        }

        Map<String, String> map = new HashMap<>();
        map.put("baseDate", date.format(DateTimeFormatter.ofPattern("yyyyMMdd")));
        map.put("baseTime", String.format("%02d00", h));
        return map;
    }
}
