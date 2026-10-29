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
            DustResult d = dust.get(0);

            // 미세먼지 API 는 간헐적으로 SERVICETIMEOUT_ERROR 를 낸다(2026-09-17 실측 성공률 40%).
            // 이번 조회가 실패했다고 직전 정상값을 "정보없음" 으로 덮으면 화면이 계속 깜빡인다.
            // 미세먼지는 급변하는 값이 아니므로 실패 시에는 직전 값을 그대로 유지한다.
            f.setPm10Grade(keepPreviousIfUnknown(d.getDust(),      lastGrade(true)));
            f.setPm25Grade(keepPreviousIfUnknown(d.getUltraDust(), lastGrade(false)));

            forecastRepository.save(f);
            log.info("Weather sync success : {} (pm10={}, pm25={})",
                    f.getUpdateDtm(), f.getPm10Grade(), f.getPm25Grade());
        }
    }

    /** 이번 값이 "정보없음" 이면 직전 값으로 대체한다. 직전 값도 없으면 "정보없음" 그대로. */
    private String keepPreviousIfUnknown(String current, String previous) {
        if (!DUST_UNKNOWN.equals(current)) return current;
        if (previous == null || previous.trim().isEmpty() || DUST_UNKNOWN.equals(previous)) {
            return DUST_UNKNOWN;
        }
        log.info("Dust : 이번 조회 실패 → 직전 값 유지 ({})", previous);
        return previous;
    }

    /** 가장 최근 저장된 등급. 조회 실패 시 null. */
    private String lastGrade(boolean pm10) {
        try {
            List<Forecast> recent = forecastRepository.findFirstByOrderByRegDtmDesc();
            if (recent == null || recent.isEmpty()) return null;
            Forecast last = recent.get(0);
            return pm10 ? last.getPm10Grade() : last.getPm25Grade();
        } catch (Exception e) {
            log.warn("직전 미세먼지 값 조회 실패", e);
            return null;
        }
    }

    // ── 미세먼지 API ──────────────────────────────────────

    /** 남해군 관할 측정소. 이 측정소 값이 없으면 경남 전체 평균으로 대체한다. */
    private static final String TARGET_STATION = "남해읍";

    /**
     * 미세먼지 API 재시도 횟수.
     *
     * <p>이 API 는 간헐적으로 {@code SERVICETIMEOUT_ERROR}(서비스 연결실패)를 반환한다.
     * 2026-09-17 운영서버에서 10회 연속 호출한 결과 성공 4 / 실패 6 이었다.
     * 갱신은 매시 정각 1회뿐이라 한 번 실패하면 그 시간대는 통째로 "정보없음" 이 된다.
     * 같은 조건에서 3회 시도하면 모두 실패할 확률이 약 0.6^3 ≈ 22% 로 떨어진다.
     */
    private static final int DUST_RETRY = 3;
    /** 값을 얻지 못했을 때 화면에 쓰는 문자열 (프론트 applyDust 의 기본 분기와 동일) */
    private static final String DUST_UNKNOWN = "정보없음";
    private static final long DUST_RETRY_DELAY_MS = 2000L;

    /**
     * 미세먼지 조회.
     *
     * <p>주의 1 — 파라미터 인코딩:
     * {@code HttpConnection.doGet()} 은 {@code URIBuilder.addParameter()} 로 값을 넣고,
     * 이 메서드가 URL 인코딩을 직접 수행한다. 따라서 여기에는 원문(한글)을 그대로 넣어야
     * 한다. 기존에는 이미 인코딩된 {@code "%EA%B2%BD%EB%82%A8"} 을 넣어 '%' 가 '%25' 로
     * 한 번 더 인코딩됐고, API 는 오류가 아니라 {@code resultCode=00 / totalCount=0 /
     * items=[]} 를 돌려줬다. 예외가 나지 않아 로그에도 남지 않은 채
     * 2025-09-02 이후 계속 "정보없음" 이 저장됐다.
     *
     * <p>주의 2 — 어느 측정소인가:
     * 기존에는 {@code items[0]} 을 썼는데 응답 순서상 창원(삼진로)이 잡혔다.
     * 남해군 경로당에 표출하는 값이므로 {@link #TARGET_STATION} 을 우선 사용한다.
     *
     * <p>주의 3 — 등급:
     * 화면(applyDust)은 "1"~"4" 등급만 해석한다. API 의 {@code pm10Grade} 는 측정소에
     * 따라 null 로 오는 경우가 있어(경화동·남해읍 등 실측 확인) 농도값으로 직접 계산한다.
     */
    public List<DustResult> getDustInfoFromApi() {
        Map<String, String> params = new HashMap<>();
        params.put("serviceKey", dustKey);
        params.put("pageNo", "1");
        params.put("numOfRows", "100");
        params.put("returnType", "JSON");
        params.put("sidoName", "경남");
        params.put("ver", "1.0");

        DustResult dr = new DustResult(DUST_UNKNOWN, DUST_UNKNOWN);

        for (int attempt = 1; attempt <= DUST_RETRY; attempt++) {
            try {
                String res = callApi(dustUrl, new HashMap<>(), params);

                // SERVICETIMEOUT_ERROR 등은 OpenAPI_ServiceResponse 로 내려온다(JSON/XML 둘 다).
                if (res == null || res.startsWith("<?xml") || res.contains("OpenAPI_ServiceResponse")) {
                    log.warn("Dust API 응답 실패 ({}/{}회)", attempt, DUST_RETRY);
                    sleepBeforeRetry(attempt);
                    continue;
                }

                JsonArray items = gson.fromJson(res, JsonObject.class)
                        .getAsJsonObject("response")
                        .getAsJsonObject("body")
                        .getAsJsonArray("items");

                if (items == null || items.size() == 0) {
                    // 조용한 실패 방지 — 응답은 정상인데 결과가 비는 경우를 드러낸다.
                    log.warn("Dust API returned no items ({}/{}회, sidoName 파라미터 확인 필요)", attempt, DUST_RETRY);
                    sleepBeforeRetry(attempt);
                    continue;
                }

                Double pm10 = pickValue(items, "pm10Value");
                Double pm25 = pickValue(items, "pm25Value");

                if (pm10 != null) dr.setDust(toGrade(pm10, PM10_BREAKS));
                if (pm25 != null) dr.setUltraDust(toGrade(pm25, PM25_BREAKS));

                log.info("Dust sync : pm10={} pm25={} (grade {}/{}, {}회 시도)",
                        pm10, pm25, dr.getDust(), dr.getUltraDust(), attempt);
                return Collections.singletonList(dr);

            } catch (Exception e) {
                log.error("Dust API error ({}/{}회)", attempt, DUST_RETRY, e);
                sleepBeforeRetry(attempt);
            }
        }

        log.warn("Dust API {}회 모두 실패 → 정보없음 유지", DUST_RETRY);
        return Collections.singletonList(dr);
    }

    private void sleepBeforeRetry(int attempt) {
        if (attempt >= DUST_RETRY) return;
        try {
            Thread.sleep(DUST_RETRY_DELAY_MS);
        } catch (InterruptedException ie) {
            Thread.currentThread().interrupt();
        }
    }

    /**
     * 대상 측정소 값을 우선 사용하고, 없으면 경남 전체 평균을 쓴다.
     * 측정소가 점검 중이면 값이 "-" 또는 null 로 오므로 숫자만 추린다.
     */
    private Double pickValue(JsonArray items, String field) {
        Double target = null;
        double sum = 0;
        int cnt = 0;

        for (JsonElement el : items) {
            JsonObject o = el.getAsJsonObject();
            Double v = asNumber(o, field);
            if (v == null) continue;

            sum += v;
            cnt++;
            if (target == null && TARGET_STATION.equals(asText(o, "stationName"))) {
                target = v;
            }
        }

        if (target != null) return target;
        if (cnt > 0) {
            log.info("Dust : {} 측정소 {} 값 없음 → 경남 {}개 측정소 평균 사용", TARGET_STATION, field, cnt);
            return sum / cnt;
        }
        return null;
    }

    private Double asNumber(JsonObject o, String field) {
        try {
            JsonElement e = o.get(field);
            if (e == null || e.isJsonNull()) return null;
            String v = e.getAsString();
            if (v == null || v.trim().isEmpty() || "-".equals(v.trim())) return null;
            return Double.parseDouble(v.trim());
        } catch (Exception e) {
            return null;
        }
    }

    private String asText(JsonObject o, String field) {
        JsonElement e = o.get(field);
        return (e == null || e.isJsonNull()) ? null : e.getAsString();
    }

    /** 환경부 통합대기환경지수 기준 경계값 (좋음/보통/나쁨 상한) */
    private static final int[] PM10_BREAKS = {30, 80, 150};
    private static final int[] PM25_BREAKS = {15, 35, 75};

    /** 농도 → 화면이 해석하는 등급 문자열("1"~"4") */
    private String toGrade(double value, int[] breaks) {
        if (value <= breaks[0]) return "1";
        if (value <= breaks[1]) return "2";
        if (value <= breaks[2]) return "3";
        return "4";
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
