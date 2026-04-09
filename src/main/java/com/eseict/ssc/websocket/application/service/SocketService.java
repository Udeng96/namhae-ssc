package com.eseict.ssc.websocket.application.service;

import com.eseict.common.net.http.HttpConnection;
import com.eseict.common.net.http.HttpConnectionException;
import com.eseict.ssc.facility.domain.entity.ErfFacInfo;
import com.eseict.ssc.facility.domain.entity.ErfPosCrdnt;
import com.eseict.ssc.repository.event.EventZnInfoRepository;
import com.eseict.ssc.repository.fac.FacPosRepository;
import com.eseict.ssc.repository.fac.FacRepository;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.text.SimpleDateFormat;
import java.util.*;

/**
 * SocketService (refac) — MRS 테스트 이벤트 전송 서비스
 *
 * 기존(service/socket/SocketService) 개선:
 *   - sendEventSituation() / sendEventStatus() 의 헤더 조립·HTTP 전송 중복 제거
 *     → buildMrsHeaders() / sendToMrs() private 헬퍼로 추출
 *   - setEventNm() if/else 체인 → EVENT_NAME_MAP O(1) 조회
 *   - FacPosRepository 필드명 대문자 오류 수정 (FacPosRepository → facPosRepository)
 *   - 미사용 변수 bodyLen 제거
 */
@Service
@Slf4j
@RequiredArgsConstructor
public class SocketService {

    private static final String MRS_API_URL = "http://172.16.8.19:8080/mrs/api/event/headerTypeCode/K1";

    /** eventCd → 이벤트 이름 매핑 (기존 if/else 체인 대체) */
    private static final Map<String, String> EVENT_NAME_MAP;
    static {
        Map<String, String> m = new HashMap<>();
        m.put("01", "비상벨");
        m.put("02", "화재");
        m.put("03", "가스");
        m.put("04", "CCTV");
        EVENT_NAME_MAP = Collections.unmodifiableMap(m);
    }

    private final FacRepository        facRepository;
    private final FacPosRepository     facPosRepository;
    private final EventZnInfoRepository eventZnInfoRepository;

    // ── 공개 API ────────────────────────────────────────────────────────────

    /**
     * 상황 이벤트를 MRS로 전송한다. (화재·가스·비상벨)
     *
     * @param mgtNo   경로당 관리번호
     * @param eventCd 01(비상벨) 02(화재) 03(가스)
     */
    public void sendEventSituation(String mgtNo, String eventCd) {
        List<ErfFacInfo> facInfos = facRepository.findByMgtNo(mgtNo);
        if (facInfos.isEmpty()) {
            log.info("관리번호에 해당하는 경로당이 존재하지 않습니다: {}", mgtNo);
            return;
        }

        ErfFacInfo fac = facInfos.get(0);
        List<ErfPosCrdnt> positions = facPosRepository.findByFacId(fac.getFacId());
        if (positions.isEmpty()) {
            log.info("해당 경로당의 좌표 정보를 가져올 수 없습니다: {}", fac.getFacNm());
            return;
        }

        String sndDtm = nowDtm();
        String trceId = "ESE_" + sndDtm;
        String znCd   = eventZnInfoRepository.findZnCdByAreaId(fac.getArea().substring(0, 7) + "000");
        String eventNm = resolveEventName(eventCd);

        ErfPosCrdnt pos = positions.get(0);
        Map<String, Object> statEvet = new LinkedHashMap<>();
        statEvet.put("uSvcOutbId",        trceId);
        statEvet.put("statEvetId",        znCd + "SSC" + "001" + "E" + eventCd);
        statEvet.put("statEvetNm",        "상황이벤트 - " + eventNm + "이벤트");
        statEvet.put("statEvetGdCd",      "00");
        statEvet.put("procSt",            "1");
        statEvet.put("statEvetCntn",      "상황이벤트 - 비상벨" + fac.getFacNm() + " " + eventNm + "이벤트 발생");
        statEvet.put("statEvetOutbDtm",   sndDtm);
        statEvet.put("outbPosCnt",        1);
        statEvet.put("outbPos",           Collections.singletonList(buildPosMap(pos)));
        statEvet.put("outbPosNm",         fac.getMgtNo());
        statEvet.put("statEvetItemCnt",   1);
        statEvet.put("statEvetItem",      Collections.singletonList(buildItem("plcId", fac.getMgtNo())));
        putEmptyActionFields(statEvet);

        Map<String, Object> body = Collections.singletonMap("StatEvet", statEvet);
        sendToMrs(body, buildMrsHeaders(sndDtm, trceId));
    }

    /**
     * 상태 이벤트를 MRS로 전송한다. (시설물 정상/고장)
     *
     * @param mgtNo 시설물 관리번호
     * @param gdCd  00(정상) 그 외(고장)
     */
    public void sendEventStatus(String mgtNo, String gdCd) {
        List<ErfFacInfo> facInfos = facRepository.findByMgtNo(mgtNo);
        if (facInfos.isEmpty()) {
            log.info("관리번호에 해당하는 시설물이 존재하지 않습니다: {}", mgtNo);
            return;
        }

        ErfFacInfo fac = facInfos.get(0);
        String scNm = !mgtNo.contains("_")
                ? fac.getFacNm().split("_")[0]
                : fac.getFacNm().split(" ")[0];

        List<ErfFacInfo> scInfos = facRepository.findByFacNm(scNm);
        if (scInfos.isEmpty()) {
            log.info("관리번호에 해당하는 경로당이 존재하지 않습니다: {}", mgtNo);
            return;
        }

        ErfFacInfo sc = scInfos.get(0);
        List<ErfPosCrdnt> positions = facPosRepository.findByFacId(fac.getFacId());
        if (positions.isEmpty()) {
            log.info("해당 시설물의 좌표 정보를 가져올 수 없습니다: {}", fac.getFacNm());
            return;
        }

        String sndDtm  = nowDtm();
        String trceId  = "ESE_" + sndDtm;
        String eventCd = resolveEventCode(mgtNo);
        String znCd    = eventZnInfoRepository.findZnCdByAreaId(sc.getArea().substring(0, 7) + "000");
        String status  = "00".equals(gdCd) ? "정상" : "고장";

        ErfPosCrdnt pos = positions.get(0);
        Map<String, Object> statEvet = new LinkedHashMap<>();
        statEvet.put("uSvcOutbId",      trceId);
        statEvet.put("statEvetId",      znCd + "SSC" + "002" + "E" + eventCd);
        statEvet.put("statEvetNm",      "상태이벤트 - " + resolveEventName(eventCd) + "이벤트");
        statEvet.put("statEvetGdCd",    gdCd);
        statEvet.put("procSt",          "1");
        statEvet.put("statEvetCntn",    fac.getFacNm() + " " + status + "이벤트 발생");
        statEvet.put("statEvetOutbDtm", sndDtm);
        statEvet.put("outbPosCnt",      1);
        statEvet.put("outbPos",         Collections.singletonList(buildPosMap(pos)));
        statEvet.put("outbPosNm",       sc.getMgtNo());
        statEvet.put("statEvetItemCnt", 2);
        statEvet.put("statEvetItem",    Arrays.asList(
                buildItem("plcId", sc.getMgtNo()),
                buildItem("dvcId", fac.getMgtNo())));
        putEmptyActionFields(statEvet);

        Map<String, Object> body = Collections.singletonMap("StatEvet", statEvet);
        sendToMrs(body, buildMrsHeaders(sndDtm, trceId));
        log.info("상태 이벤트 :: {}, {}", resolveEventName(eventCd), status);
    }

    // ── private — 헬퍼 ───────────────────────────────────────────────────────

    /** 현재 시각을 "yyyyMMddHHmmssSSS" 포맷 문자열로 반환 */
    private String nowDtm() {
        return new SimpleDateFormat("yyyyMMddHHmmssSSS").format(new Date());
    }

    /**
     * MRS 공통 요청 헤더 조립
     * (기존: sendEventSituation / sendEventStatus 양쪽에 동일 코드 중복)
     */
    private Map<String, Object> buildMrsHeaders(String sndDtm, String trceId) {
        Map<String, Object> headers = new HashMap<>();
        headers.put("BODY_LEN",       1211);
        headers.put("HEADER_TYP_CD",  "K1");
        headers.put("SND_SYS_CD",     "ESE");
        headers.put("MSG_EXCH_PTRN",  "2");
        headers.put("MSG_TYP_CD",     "001");
        headers.put("SND_DTM",        sndDtm);
        headers.put("TRCE_ID",        trceId);
        headers.put("Content-Type",   "application/json");
        return headers;
    }

    /**
     * MRS HTTP POST 전송
     * (기존: sendEventSituation / sendEventStatus 양쪽에 동일 try-catch 중복)
     */
    @SuppressWarnings("unchecked")
    private void sendToMrs(Map<String, Object> body, Map<String, Object> headers) {
        try {
            String reqBody = new ObjectMapper().writeValueAsString(body);
            new HttpConnection().doPost(MRS_API_URL, headers, reqBody);
            log.info("MRS로 전송했습니다. BODY::{}", body);
        } catch (JsonProcessingException e) {
            log.error("BODY문 변환 중 에러가 발생했습니다: {}", e.getMessage());
        } catch (HttpConnectionException e) {
            log.error("MRS 송신 중 에러가 발생했습니다: {}", e.getMessage());
        }
    }

    /** 위치 좌표 맵 생성 */
    private Map<String, String> buildPosMap(ErfPosCrdnt pos) {
        Map<String, String> map = new HashMap<>();
        map.put("x", pos.getXCrdnt());
        map.put("y", pos.getYCrdnt());
        map.put("z", "0");
        return map;
    }

    /** statEvetItem 단건 생성 */
    private Map<String, String> buildItem(String key, String value) {
        Map<String, String> item = new HashMap<>();
        item.put("key",   key);
        item.put("value", value);
        return item;
    }

    /** 조치·복잡이벤트 관련 빈 필드 일괄 세팅 */
    private void putEmptyActionFields(Map<String, Object> statEvet) {
        statEvet.put("statEvetActnCntn",        "");
        statEvet.put("statEvetActnMn",          "");
        statEvet.put("statEvetActnDtm",         "");
        statEvet.put("statEvetActnRslt",        "");
        statEvet.put("statEvetClrDtm",          "");
        statEvet.put("outbScopRads",            "");
        statEvet.put("cpxRelEvetOutbSeqnCnt",   0);
        statEvet.put("cpxRelEvetOutbSeqn",      new ArrayList<>());
        statEvet.put("outbMainGb",              "P");
    }

    /**
     * eventCd → 이벤트 이름 변환
     * (기존 if/else 체인 → Map O(1) 조회)
     */
    public String resolveEventName(String eventCd) {
        return EVENT_NAME_MAP.getOrDefault(eventCd, "셋톱박스");
    }

    /**
     * mgtNo 파싱 → eventCd 추출
     * (기존 setEventCd() 동일 로직 유지, 메서드명만 명확화)
     */
    public String resolveEventCode(String mgtNo) {
        if (!mgtNo.contains("_")) return "04";
        String[] parts = mgtNo.split("_");
        if (parts.length < 3) return "05";
        switch (parts[2]) {
            case "Bell": return "01";
            case "Fire": return "02";
            case "Gas":  return "03";
            default:     return "05";
        }
    }
}
