package com.eseict.ssc.conf.application.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

/**
 * AxisService (refac) — Axis 비상벨 마이크 제어
 *
 * 기존(service/newConf/AxisService):
 *   - 패키지만 변경 (service.newConf → refac.conf.application.service)
 *   - 로직 동일 유지
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class AxisService {

    @Value("${axis.device.url}")
    private String axisApiUrl;

    private final RestTemplate restTemplate = new RestTemplate();

    /**
     * 파라미터에 따라 Axis 비상벨 마이크 mute/unmute를 제어합니다.
     */
    public boolean controlMicroPhone(boolean isMute, String centerId) {
        log.info("isMute:{}, centerId:{}", isMute, centerId);
        try {
            Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("isMute", isMute);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);
            String url = axisApiUrl.replace("{center-id}", centerId);
            log.info("axis url:{}", url);

            ResponseEntity<String> response = restTemplate.postForEntity(url, entity, String.class);
            log.info("[Axis API] centerId={}, Mute={}, status={}, response={}",
                    centerId, isMute, response.getStatusCode(), response.getBody());

            return response.getStatusCode().is2xxSuccessful();
        } catch (Exception e) {
            log.error("[Axis API] Error while setting mute: {}", e.getMessage(), e);
            return false;
        }
    }
}
