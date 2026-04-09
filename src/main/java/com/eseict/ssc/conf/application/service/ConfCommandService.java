package com.eseict.ssc.conf.application.service;

import com.eseict.common.net.http.HttpConnection;
import com.eseict.common.net.http.HttpConnectionException;
import com.eseict.ssc.config.ApiConstants;
import com.eseict.ssc.conf.application.dto.ConfResponse;
import com.eseict.ssc.conf.application.dto.ConfRoomInfo;
import com.eseict.ssc.conf.application.util.ConfUtil;
import com.eseict.ssc.conf.application.dto.OpenConfResult;
import com.eseict.ssc.conf.domain.entity.BellConfInfo;
import com.eseict.ssc.facility.domain.entity.ErfFacInfo;
import com.eseict.ssc.repository.conf.BellConfRepository;
import com.eseict.ssc.repository.fac.FacRepository;
import com.eseict.ssc.common.util.DateTimeUtil;
import com.eseict.ssc.util.IdGenerator;
import com.google.common.base.Strings;
import com.google.gson.Gson;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * ConfCommandService (refac) — 화상회의 생성/종료 (CQRS 명령 측)
 *
 * 기존(service/newConf/ConfService): createConf, closeConf 분리
 * 개선:
 *   - CQRS: 생성/종료 명령 메서드만 담당
 *   - ConfQueryService: 조회/입장 쿼리 측 담당
 *   - transformToConf / transformToWeb / transformTOTV / saveConfInfo 내부 헬퍼 유지
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class ConfCommandService {

    private final Gson gson = new Gson();
    private final BellConfRepository bellConfRepository;
    private final FacRepository facRepository;
    private final ConfUtil confUtil;

    private final HttpConnection<String> httpConnection = new HttpConnection();
    private final Map<String, Object> header = new HashMap<>();

    @Value("${event.conf.url.base}")
    private String baseUrl;
    @Value("${event.conf.url.open}")
    private String openUrl;
    @Value("${event.settop.url.base}")
    private String setTopUrl;
    @Value("${event.settop.url.second}")
    private String addedSetTopUrl;
    @Value("${event.conf.customerId}")
    private String customerId;
    @Value("${event.conf.userId}")
    private String userId;
    @Value("${event.settop.url.second_param_ip}")
    private String setTopUrlSecondParam;
    @Value("${event.settop.url.noti}")
    private String notiUrl;
    @Value("${event.conf.numberOfVideo}")
    private int numberOfVideo;

    // ── 화상회의 생성 ────────────────────────────────────

    public OpenConfResult createConf(String mgtNo, String seqn) {
        if (chkConfIsOpen(mgtNo + "_SetTop1")) {
            log.info("{} conf is already open", mgtNo);
            return OpenConfResult.builder()
                    .mobileScheme("failed").pcScheme("failed")
                    .startTime("").endTime("").userId("").plcNm("").plcId(mgtNo)
                    .seqn("").confStatus("7").statEvetOutbSeqn(seqn)
                    .build();
        }

        Map<String, Object> body = setCreateConfBody(mgtNo);
        if (body == null || body.isEmpty()) {
            log.info("there is no sc info :{}", mgtNo);
            return OpenConfResult.builder()
                    .mobileScheme("failed").pcScheme("failed")
                    .startTime("").endTime("").seqn("")
                    .userId("").plcNm("").plcId(mgtNo)
                    .confStatus("2").statEvetOutbSeqn(seqn)
                    .build();
        }

        String response = requestConfOpen(baseUrl + openUrl, gson.toJson(body));

        if (Strings.isNullOrEmpty(response)) {
            log.info("conf room open fail");
            return OpenConfResult.builder()
                    .seqn(seqn).mobileScheme("failed").pcScheme("failed")
                    .startTime("").endTime("")
                    .userId(body.get("userID").toString())
                    .plcNm(body.get("title").toString()).plcId(mgtNo)
                    .confStatus("2").statEvetOutbSeqn(seqn)
                    .build();
        }

        ConfResponse confResponse = gson.fromJson(response, ConfResponse.class);
        log.info("confResponse :: {}", confResponse);

        if (!confResponse.getStatus().equals("200")) {
            log.info("request open conf fail");
            return OpenConfResult.builder()
                    .mobileScheme("failed").pcScheme("failed")
                    .startTime("").endTime("")
                    .userId(body.get("userID").toString())
                    .plcNm(body.get("title").toString()).plcId(mgtNo)
                    .confStatus("2").statEvetOutbSeqn(seqn)
                    .build();
        }

        String consSeqn = IdGenerator.getUUID64();
        OpenConfResult openConfResult = OpenConfResult.builder()
                .mobileScheme(confResponse.getSessionInfo().getMobileScheme())
                .pcScheme(confResponse.getSessionInfo().getPcScheme())
                .startTime(confUtil.convertTimeForm(confResponse.getSessionInfo().getStartTime()))
                .endTime(confUtil.convertTimeForm(confResponse.getSessionInfo().getEndTime()))
                .userId(body.get("userID").toString())
                .plcNm(body.get("title").toString()).plcId(mgtNo)
                .confStatus("1").seqn(consSeqn).statEvetOutbSeqn(seqn)
                .build();

        saveConfInfo(openConfResult, confResponse.getSessionInfo().getExtID());
        transformToConf(openConfResult);
        return openConfResult;
    }

    // ── 화상회의 종료 ────────────────────────────────────

    public BellConfInfo closeConf(String seqn) {
        List<BellConfInfo> bellList = bellConfRepository.findBellConfInfoByStatEvetOutbSeqn(seqn);
        if (bellList.isEmpty()) {
            log.info("there is no such conf : {}", seqn);
            return null;
        }

        BellConfInfo bellConfInfo = bellList.get(0);
        int closeConfResult = bellConfRepository.updateCloseConf(
                DateTimeUtil.getNowLocalDateTimeFreeFormat(ApiConstants.DATE.FORMAT_17), seqn);

        if (closeConfResult > 0) {
            log.info("success to close conf : {}", bellConfInfo.getPosNm());
            transformToWeb(bellConfInfo.getUserId());
            try {
                Thread.sleep(1000);
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            }
            transformTOTV(bellConfInfo.getUserId());
            bellConfInfo.setConfStatus(5);
            return bellConfInfo;
        }
        return null;
    }

    // ── private ──────────────────────────────────────────

    private boolean chkConfIsOpen(String confId) {
        return !bellConfRepository.chkOpenBellConf(confId).isEmpty();
    }

    private Map<String, Object> setCreateConfBody(String scMgtNo) {
        ConfRoomInfo conf = new ConfRoomInfo();
        List<ErfFacInfo> erfFacInfos = facRepository.findByMgtNo(scMgtNo);
        if (erfFacInfos.isEmpty()) {
            return null;
        }
        conf.setScNm(erfFacInfos.get(0).getFacNm());
        conf.setScId(erfFacInfos.get(0).getMgtNo());
        conf.setUserId(scMgtNo + "_SetTop1");

        LocalDateTime now = LocalDateTime.now();
        String openTime  = now.minusMinutes(10).format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));
        String closeTime = now.plusHours(1).format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));

        Map<String, Object> body = new HashMap<>();
        body.put("customerID", customerId);
        body.put("sessionID", "0");
        body.put("title", conf.getScNm());
        body.put("userID", userId);
        body.put("startTime", openTime);
        body.put("endTime", closeTime);
        body.put("timezone", "Asia/Seoul");
        body.put("numberOfVideo", numberOfVideo);
        body.put("flag", "I");
        return body;
    }

    private String requestConfOpen(String url, String body) {
        String response = "";
        int retryCnt = 0;
        while (retryCnt < 5) {
            try {
                header.put("Content-Type", "application/json");
                response = (String) httpConnection.doPost(url, header, body);
                if (!Strings.isNullOrEmpty(response)) return response;
            } catch (HttpConnectionException e) {
                log.error("FAIL TO CREATE CONF ROOM, retry attempt :: {}", retryCnt + 1);
            }
            if (retryCnt == 4) {
                log.error("FAIL TO CREATE CONF ROOM, RETRY MAX");
                break;
            }
            retryCnt++;
            try {
                Thread.sleep(1000);
            } catch (InterruptedException ie) {
                Thread.currentThread().interrupt();
                break;
            }
        }
        return response;
    }

    private BellConfInfo saveConfInfo(OpenConfResult openConfResult, String extId) {
        BellConfInfo bellConfInfo = BellConfInfo.builder()
                .seqn(openConfResult.getSeqn())
                .posNm(openConfResult.getPlcNm())
                .posId(openConfResult.getPlcId())
                .userId(openConfResult.getPlcId() + "_SetTop1")
                .outbDtm(openConfResult.getStartTime())
                .clrDtm("")
                .confStatus(Integer.parseInt(openConfResult.getConfStatus()))
                .pcScheme(openConfResult.getPcScheme())
                .mobileScheme(openConfResult.getMobileScheme())
                .statEvetOutbSeqn(openConfResult.getStatEvetOutbSeqn())
                .extId(extId)
                .build();
        return bellConfRepository.save(bellConfInfo);
    }

    private void transformToConf(OpenConfResult bellConfInfo) {
        header.put("Content-Type", "application/json");
        String slotId = bellConfInfo.getPlcId() + "_SetTop1";
        log.info("slotId:{}", slotId);
        String newMobileScheme = bellConfInfo.getMobileScheme()
                + "&portalAddress=http://" + setTopUrlSecondParam
                + "&apiAddress=http://" + setTopUrlSecondParam + ":19000"
                + "&userID=" + slotId
                + "&userName=" + bellConfInfo.getPlcNm();

        try {
            Map<String, Object> androidBody = new HashMap<>();
            androidBody.put("type", "scheme");
            androidBody.put("slotid", slotId);
            androidBody.put("description", "화상회의 App");
            androidBody.put("scheme", newMobileScheme);
            log.info("newMobileScheme:{}, androidUrl:{}", newMobileScheme, addedSetTopUrl);
            String resultAndroid = (String) new HttpConnection().doPost(addedSetTopUrl, header, gson.toJson(androidBody));
            log.info("Send Request To Android SetTop SUCCESS ? ::: {}", resultAndroid);
        } catch (HttpConnectionException e) {
            log.info("Connection to Android SetTop Failed = {}", e.getMessage());
        }
    }

    private void transformToWeb(String slotId) {
        header.put("Content-Type", "application/json");
        Map<String, Object> body = new HashMap<>();
        body.put("type", "web");
        body.put("slotid", slotId);
        body.put("description", "웹 페이지");
        body.put("url", notiUrl + slotId);
        try {
            String response = (String) httpConnection.doPost(addedSetTopUrl, header, gson.toJson(body));
            log.info("transform to web's response : {}", response);
        } catch (HttpConnectionException e) {
            log.info("fail to transform to web");
        }
    }

    private void transformTOTV(String slotId) {
        Map<String, Object> h = new HashMap<>();
        h.put("Content-Type", "application/json");
        Map<String, Object> androidBody = new HashMap<>();
        androidBody.put("type", "package");
        androidBody.put("slotid", slotId);
        androidBody.put("description", "HDMI 크라이저 App");
        androidBody.put("pack", "com.krizer.hdmi_in_module");
        try {
            String response = (String) new HttpConnection().doPost(addedSetTopUrl, h, gson.toJson(androidBody));
            log.info("turnConfToTv Response :: {}", response);
        } catch (HttpConnectionException e) {
            log.error("Fail To Turn to Tv from web");
        }
    }
}
