package com.eseict.ssc.open.application.service;

import com.eseict.common.net.http.HttpConnection;
import com.eseict.common.net.http.HttpConnectionException;
import com.eseict.ssc.open.application.dto.AddrResponse;
import com.google.gson.Gson;
import com.google.gson.JsonElement;
import com.google.gson.JsonParser;
import com.google.gson.reflect.TypeToken;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * AddrService (refac) — VWorld 주소 검색
 *
 * 기존(service/newOpen/AddrService) 개선:
 *   - if/else if/else JSON 분기 → 삼항식으로 단순화
 *   - List<AddrResponse> 선언 시 raw 타입 제거 (다이아몬드 연산자 적용)
 *   - 빈 결과 반환 시 Collections.emptyList() 통일
 *   - 패키지 변경 (service.newOpen → refac.open.application.service)
 */
@RequiredArgsConstructor
@Service
@Slf4j
public class AddrService {

    private final Gson gson = new Gson();

    @Value("${public.common.apis.vworld.params.key}")
    private String key;
    @Value("${public.common.apis.vworld.url}")
    private String url;
    @Value("${public.common.apis.vworld.subUrls.searchPos}")
    private String contextPath;
    @Value("${public.common.apis.vworld.params.serviceSearch}")
    private String serviceSearch;
    @Value("${public.common.apis.vworld.params.requestSearch}")
    private String requestSearch;
    @Value("${public.common.apis.vworld.params.version}")
    private String version;
    @Value("${public.common.apis.vworld.params.crs}")
    private String crs;
    @Value("${public.common.apis.vworld.params.page}")
    private String page;
    @Value("${public.common.apis.vworld.params.size}")
    private String size;
    @Value("${public.common.apis.vworld.params.typeSearch}")
    private String typeSearch;
    @Value("${public.common.apis.vworld.params.format}")
    private String format;

    public List<AddrResponse> getAddrList(String keyword) {
        if (keyword == null || keyword.isEmpty()) {
            log.info("no keyword");
            return Collections.emptyList();
        }
        log.info("addr keyword : {}", keyword);

        Map<String, Object> header = new HashMap<>();
        header.put("Content-Type", "application/json");

        Map<String, String> params = new HashMap<>();
        params.put("key",     key);
        params.put("version", version);
        params.put("crs",     crs);
        params.put("page",    page);
        params.put("size",    size);
        params.put("type",    typeSearch);
        params.put("format",  format);
        params.put("query",   keyword);
        params.put("service", serviceSearch);
        params.put("request", requestSearch);

        try {
            String response = (String) new HttpConnection().doGet(url + contextPath, header, params);
            log.info("response : {}", response);

            JsonElement jsonElement = JsonParser.parseString(response);

            // Object이면 단건, Array이면 목록 — 삼항식으로 단순화
            List<AddrResponse> result = jsonElement.isJsonArray()
                    ? gson.fromJson(response, new TypeToken<List<AddrResponse>>() {}.getType())
                    : Collections.singletonList(gson.fromJson(response, AddrResponse.class));

            log.info("search addr result size : {}", result.size());
            return result;

        } catch (HttpConnectionException e) {
            log.error("Error on get addrs : {}", e.getMessage());
            throw new RuntimeException(e);
        }
    }
}
