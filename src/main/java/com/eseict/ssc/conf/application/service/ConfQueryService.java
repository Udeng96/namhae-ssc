package com.eseict.ssc.conf.application.service;

import com.eseict.common.net.http.HttpConnection;
import com.eseict.common.net.http.HttpConnectionException;
import com.eseict.ssc.conf.domain.entity.BellConfInfo;
import com.eseict.ssc.repository.conf.BellConfRepository;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * ConfQueryService (refac) — 화상회의 조회 (CQRS 쿼리 측)
 *
 * 기존(service/newConf/ConfService): getConf, requestConferenceAutoEnter 분리
 * 개선:
 *   - CQRS: 조회/입장 관련 메서드만 담당
 *   - ConfCommandService: 생성/종료 명령 측 담당
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class ConfQueryService {

    private final BellConfRepository bellConfRepository;
    private final ObjectMapper objectMapper;

    @Value("${event.conf.url.base}")
    private String baseUrl;
    @Value("${event.conf.url.autoEnter}")
    private String autoEnterUrl;
    @Value("${event.conf.customerId}")
    private String customerId;

    private final HttpConnection<String> httpConnection = new HttpConnection();
    private final Map<String, Object> header = new HashMap<>();

    // ── 회의 정보 조회 ────────────────────────────────────

    public List<BellConfInfo> getConf(String seqn) {
        return bellConfRepository.findByStatEvetOutbSeqn(seqn);
    }

    // ── 혜윰 Auto Enter (pcScheme 반환) ──────────────────

    public String requestConferenceAutoEnter(String seqn, String memberId) {
        log.info("[AutoEnter] received seqn :: {}, id :: {}", seqn, memberId);
        String extId = bellConfRepository.findExtIdByStatEvetOutbSeqn(seqn);
        Map<String, Object> requestBody = createConfAutoEnterRequestBody(extId, memberId);
        log.info("[AutoEnter] requestBody :: {}, url :: {}", requestBody, getAutoEnterUrl());
        return fetchAutoEnter(getAutoEnterUrl(), requestBody);
    }

    // ── private ──────────────────────────────────────────

    private Map<String, Object> createConfAutoEnterRequestBody(String extId, String memberId) {
        Map<String, Object> map = new HashMap<>();
        map.put("customerID", customerId);
        map.put("memberID", memberId);
        map.put("memberName", getMemberName(memberId));
        map.put("extSessionID", extId);
        return map;
    }

    private String getMemberName(String memberId) {
        if ("fire00".equals(memberId)) {
            return "소방서";
        }
        return "알수없는사용자";
    }

    private String getAutoEnterUrl() {
        return baseUrl + autoEnterUrl;
    }

    private String fetchAutoEnter(String url, Map<String, Object> requestBody) {
        try {
            header.put("Content-Type", "application/json");
            String body = objectMapper.writeValueAsString(requestBody);
            log.info("[AutoEnter] requestBody Json :: {}", body);
            String fetchResponse = httpConnection.doPost(url, header, body);
            log.info("[AutoEnter] fetchAutoEnter Response :: {}", fetchResponse);
            return responseAutoEnterPcScheme(fetchResponse);
        } catch (HttpConnectionException | JsonProcessingException e) {
            throw new RuntimeException(e);
        }
    }

    private String responseAutoEnterPcScheme(String fetchResponse) {
        try {
            Map<String, Object> responseMap = objectMapper.readValue(fetchResponse, Map.class);
            log.info("[AutoEnter] responseMap:{}", responseMap);
            return (String) responseMap.get("pcScheme");
        } catch (JsonProcessingException e) {
            throw new RuntimeException("응답 파싱 실패", e);
        }
    }
}
