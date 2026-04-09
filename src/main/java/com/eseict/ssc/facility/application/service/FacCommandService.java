package com.eseict.ssc.facility.application.service;

import com.eseict.ssc.config.ApiConstants;
import com.eseict.ssc.facility.application.dto.FacExcelItem;
import com.eseict.ssc.facility.domain.entity.*;
import com.eseict.ssc.monitoring.domain.entity.IocStatEvetOutbHist;
import com.eseict.ssc.repository.event.EventRepository;
import com.eseict.ssc.repository.fac.*;
import com.eseict.ssc.util.IdGenerator;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

/**
 * FacCommandService — 시설물 상태 변경 / 일괄 등록 전담 서비스
 *
 * 기존 FacService(읽기·쓰기 혼재) 에서 쓰기 연산만 분리.
 * FacExceptionUtils @Component → private static 검증 메서드로 인라인.
 * FacUtil.buildFacInfo/buildPosInfo positional 생성자 → @Builder 로 교체.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class FacCommandService {

    private final FacRepository       facRepository;
    private final FacPosRepository    facPosRepository;
    private final FacAreaRepository   facAreaRepository;
    private final FacClfyRepository   facClfyRepository;
    private final FacCoInfoRepository facCoInfoRepository;
    private final EventRepository     eventRepository;

    /** 경로당 계열 분류 ID 목록 (isScFacility 판별용) */
    private static final List<String> SC_CLFY_IDS = Arrays.asList(
            ApiConstants.FAC_SC_GAS,     ApiConstants.FAC_SC_CENTER,
            ApiConstants.FAC_SC_SETTOP2, ApiConstants.FAC_SC_SETTOP1,
            ApiConstants.FAC_SC_CCTV_B,  ApiConstants.FAC_SC_CCTV_3,
            ApiConstants.FAC_SC_BELL,    ApiConstants.FAC_SC_FIRE,
            ApiConstants.FAC_SC_CCTV_K,  ApiConstants.FAC_SC_CCTV_L);

    // ── 시설물 이벤트 상태 업데이트 ──────────────────────────────────────────

    /**
     * facEventId(시설물관리번호-이벤트ID) 와 status("00"|"01") 를 받아
     * 해당 이벤트의 등급 코드를 업데이트한다.
     *
     * <p>기존: FacExceptionUtils @Component 검증 + FacService 로직 혼재
     * <p>개선: validateUpdateParams() private static 으로 인라인
     */
    public String updateFacStatus(String facEventId, String status) {
        validateUpdateParams(facEventId, status);

        List<String> parts     = Arrays.asList(facEventId.split("-"));
        String       facMgtNo  = parts.get(0);
        String       statEvetId = parts.get(1);

        String facNm  = facRepository.findByMgtNo(facMgtNo).get(0).getFacNm();
        String scNm   = facNm.contains("_") ? facNm.split("_")[0] : facNm.split(" ")[0];
        String scMgtNo = facRepository.findByFacNm(scNm).get(0).getMgtNo();

        String znCd       = statEvetId.substring(0, 3);
        String statEvetCd = statEvetId.substring(statEvetId.length() - 2);

        List<IocStatEvetOutbHist> statusEvents =
                eventRepository.findStatusEvent(scMgtNo, znCd, statEvetCd);

        if (statusEvents.isEmpty()) {
            throw new IllegalArgumentException(
                    "이벤트를 찾지 못했습니다. 상태를 업데이트 할 수 없습니다. :: " + facMgtNo);
        }

        int updated = eventRepository.updateStatusEventGdCd(
                status, statusEvents.get(0).getStatEvetOutbSeqn());

        return updated > 0
                ? ApiConstants.Result.SUCCESS_CODE
                : ApiConstants.Result.FAIL_CODE;
    }

    // ── 엑셀 일괄 등록 ────────────────────────────────────────────────────────

    /**
     * FMS 엑셀 양식 데이터를 일괄 저장한다.
     *
     * <p>실패한 항목은 저장 중단 없이 계속 진행하고, 실패 사유를 반환한다.
     * 전부 성공하면 "SUCCESS" 단일 리스트를 반환한다.
     */
    public List<String> saveFacsFromExcel(List<FacExcelItem> excelDatas) {
        log.info("----start to save fac infos----");

        List<List<String>> errorResults = new ArrayList<>();
        int successCount = 0;

        for (int i = 0; i < excelDatas.size(); i++) {
            FacExcelItem item   = excelDatas.get(i);
            List<String> errors = validateExcelItem(item, i);

            if (errors.size() == 1) {   // 인덱스만 있으면 유효
                saveFacility(item);
                successCount++;
            } else {
                errorResults.add(errors);
            }
        }

        logBatchResult(successCount, errorResults.size(), excelDatas.size());

        return errorResults.isEmpty()
                ? Collections.singletonList("SUCCESS")
                : errorResults.stream()
                        .map(msgs -> String.join(" , ", msgs))
                        .collect(Collectors.toList());
    }

    // ── private — 유효성 검사 ─────────────────────────────────────────────────

    /**
     * updateFacStatus 파라미터 검증
     *
     * <p>기존: FacExceptionUtils (불필요한 @Component)
     * <p>개선: private static — 빈 관리 대상에서 제외
     */
    private static void validateUpdateParams(String facEventId, String status) {
        if (facEventId == null || facEventId.isEmpty()) {
            throw new IllegalArgumentException("시설물 이벤트 아이디가 필요합니다.");
        }
        if (status == null || status.isEmpty()) {
            throw new IllegalArgumentException("변경하고자하는 시설물 상태가 필요합니다.");
        }
        if (!"00".equals(status) && !"01".equals(status)) {
            throw new IllegalArgumentException("유효한 시설물 상태가 아닙니다.");
        }
    }

    private List<String> validateExcelItem(FacExcelItem item, int index) {
        List<String> errors = new ArrayList<>();
        errors.add(String.valueOf(index + 5)); // 엑셀 행 번호 (헤더 4줄 스킵)

        if (!facRepository.findByMgtNo(item.getMgtNo()).isEmpty()) {
            errors.add("중복 관리번호(mgtNo)");
        }

        ErfFacClfy clfyInfo = facClfyRepository
                .findByFacClfyNmAndUseYnAndFacClfyGb(item.getFacClfyNm(), true, true)
                .stream().findFirst().orElse(null);
        if (clfyInfo == null) {
            errors.add("잘못된 분류(clfyNm)");
        }

        ErfCoInfo coInfo = facCoInfoRepository.findByCoNm(item.getCoNm())
                .stream().findFirst().orElse(null);
        if (coInfo == null) {
            errors.add("없는 업체정보(coNm)");
        }

        boolean isScFac = clfyInfo != null
                && ApiConstants.FAC_SC_CENTER.equals(clfyInfo.getTopFacClfyId());
        String areaCd = resolveAreaCd(item.getAddrShort(), isScFac);

        if (areaCd.isEmpty()) {
            errors.add("해당 주소에 관련된 데이터가 없습니다.");
        } else if (areaCd.startsWith("error_")) {
            errors.add(areaCd.substring(6));
        }

        return errors;
    }

    // ── private — 시설물 저장 ─────────────────────────────────────────────────

    private void saveFacility(FacExcelItem item) {
        boolean isScFac = facClfyRepository.findByFacClfyNm(item.getFacClfyNm())
                .stream().findFirst()
                .map(clfy -> SC_CLFY_IDS.contains(clfy.getFacClfyId()))
                .orElse(false);

        String facId  = IdGenerator.getPrefixedUUID32("FAC");
        String areaCd = resolveAreaCd(item.getAddrShort(), isScFac);
        String aprvSt = isScFac ? "003" : "001";
        String clfyId = facClfyRepository
                .findByFacClfyNmAndUseYnAndFacClfyGb(item.getFacClfyNm(), true, true)
                .get(0).getFacClfyId();
        String coId = facCoInfoRepository.findByCoNm(item.getCoNm()).get(0).getCoId();

        ErfPosCrdnt pos = buildPosInfo(facId, item.getXcrdnt(), item.getYcrdnt());
        ErfFacInfo  fac = buildFacInfo(facId, item, pos.getPosCrdntId(), clfyId, coId, areaCd, aprvSt);

        ErfFacInfo saved = facRepository.save(fac);
        log.info("save {} fac", saved.getFacNm());
        facPosRepository.save(pos);
        log.info("save {} pos", saved.getFacNm());
        log.info("------------------------------------------");
    }

    // ── private — 주소 → 지역코드 변환 ──────────────────────────────────────

    /**
     * 도로명 주소에서 지역코드를 추출한다.
     *
     * <p>기존: setAreaCd / areaLi / areaMyeon 변수를 분리해서 Stream 두 번 실행
     * <p>개선: extractToken() 으로 통합 → Stream 1회 실행, 호출부 단순화
     */
    private String resolveAreaCd(String shortAddr, boolean isScFac) {
        String keyword = isScFac
                ? extractToken(shortAddr, "리")
                : extractToken(shortAddr, "면", "읍");

        if (keyword.isEmpty()) {
            return "error_해당 주소에 필요한 지역 정보가 포함되어있지 않습니다.";
        }
        return resolveAreaId(keyword);
    }

    /**
     * 공백으로 분리된 주소 토큰 중 지정한 접미사를 포함하는 첫 번째 토큰을 반환한다.
     */
    private static String extractToken(String addr, String... suffixes) {
        return Arrays.stream(addr.split(" "))
                .filter(tok -> Arrays.stream(suffixes).anyMatch(tok::contains))
                .findFirst()
                .orElse("");
    }

    private String resolveAreaId(String areaNm) {
        List<TblAreaInfo> areas = facAreaRepository.findByAreaName(areaNm);
        return areas.isEmpty() ? "" : areas.get(0).getAreaId();
    }

    // ── private — 엔티티 빌더 헬퍼 ───────────────────────────────────────────

    /**
     * 위치 정보 엔티티 생성
     *
     * <p>기존: FacUtil.buildPosInfo — 7인자 positional constructor
     * <p>개선: @Builder 사용으로 필드 의미 명확화
     */
    private static ErfPosCrdnt buildPosInfo(String facId, String xCrdnt, String yCrdnt) {
        String posId = IdGenerator.getPrefixedUUID32("POS");
        return ErfPosCrdnt.builder()
                .posCrdntId(posId)
                .facId(facId)
                .posGrupId(posId)
                .sortOrd("0")
                .useYn(true)
                .xCrdnt(xCrdnt)
                .yCrdnt(yCrdnt)
                .build();
    }

    /**
     * 시설물 정보 엔티티 생성
     *
     * <p>기존: FacUtil.buildFacInfo — 32인자 positional constructor (ErfFacInfo @AllArgsConstructor)
     * <p>개선: @Builder 사용 → 누락·순서 오류 컴파일 단계에서 방지
     */
    private static ErfFacInfo buildFacInfo(String facId, FacExcelItem item,
                                           String posId, String clfyId,
                                           String coId, String areaCd, String aprvSt) {
        return ErfFacInfo.builder()
                .facId(facId)
                .addrLong("")
                .addrShort(item.getAddrShort())
                .aprvSt(aprvSt)
                .coId(coId)
                .evetRcvYn(true)
                .facAddInfo("")
                .facClfyId(clfyId)
                .facDesc(item.getFacDesc())
                .facNm(item.getFacNm())
                .facTyp("001")
                .getoFtrCd("false")
                .mgtNo(item.getMgtNo())
                .posGrupId(posId)
                .posNm(item.getPosNm())
                .psstPeriod(0)
                .regDtm(item.getRegDtm())
                .regrt(item.getRegrt())
                .setuDtm(item.getSetuDtm())
                .useYn(true)
                .mobileYn(false)
                .area(areaCd)
                .build();
    }

    // ── private — 로그 ────────────────────────────────────────────────────────

    private static void logBatchResult(int success, int fail, int total) {
        log.info("-------엑셀 일괄등록 결과-------");
        log.info("1. 성공 수 : {}", success);
        log.info("2. 실패 수 : {}", fail);
        log.info("3. 전체 데이터 수 : {}", total);
        log.info("4. 전체 데이터 진행 여부 : {}", success + fail == total);
        log.info("-------엑셀 일괄등록 종료-------");
    }
}
