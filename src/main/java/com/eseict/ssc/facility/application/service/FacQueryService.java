package com.eseict.ssc.facility.application.service;

import com.eseict.ssc.config.ApiConstants;
import com.eseict.ssc.facility.application.dto.FacCctv;
import com.eseict.ssc.facility.domain.entity.ErfFacInfo;
import com.eseict.ssc.facility.domain.entity.ErfPosCrdnt;
import com.eseict.ssc.facility.domain.entity.ScFacInfo;
import com.eseict.ssc.facility.domain.vo.FacSortType;
import com.eseict.ssc.repository.fac.FacAreaRepository;
import com.eseict.ssc.repository.fac.FacPosRepository;
import com.eseict.ssc.repository.fac.FacRepository;
import com.eseict.ssc.repository.fac.FacViewRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * FacQueryService — 시설물 조회 전담 서비스
 *
 * 기존 FacService(읽기·쓰기 혼재) 에서 읽기 연산만 분리.
 * FacUtil @Component → private static 헬퍼로 인라인.
 */
@Service
@RequiredArgsConstructor
public class FacQueryService {

    private final FacViewRepository facViewRepository;
    private final FacAreaRepository facAreaRepository;
    private final FacRepository     facRepository;
    private final FacPosRepository  facPosRepository;

    /** 전체 지역 조회 코드 */
    private static final String ALL_AREA_CODE = "400";

    // ── 경로당 시설물 목록 ────────────────────────────────────────────────────

    /**
     * 지역 코드 / 이름 / 정렬 기준으로 경로당 시설물 목록을 조회한다.
     *
     * <p>정렬: FacSortType enum의 priority()에 위임 → 서비스 내 if/else 분기 제거
     */
    public List<ScFacInfo> getFacs(List<String> areaCds, String scName, String sortType) {
        List<ScFacInfo> facList = queryFacs(areaCds, scName);

        FacSortType sort = FacSortType.of(sortType);
        if (sort != FacSortType.NONE) {
            facList.sort(Comparator
                    .comparingInt((ScFacInfo f) -> sort.priority(f.getSc()))
                    .thenComparing(ScFacInfo::getTopAreaName));
        }
        return facList;
    }

    /**
     * 전체 경로당 시설물 목록을 반환한다.
     */
    public List<ErfFacInfo> getAllScList() {
        return facRepository.findByFacClfyId(ApiConstants.FAC_SC_CENTER);
    }

    // ── CCTV ─────────────────────────────────────────────────────────────────

    public List<FacCctv> getCrimeCctvs() {
        return getCctvsByTypes(Arrays.asList(
                ApiConstants.FAC_CCTV_LIFE,
                ApiConstants.FAC_CCTV_PARK));
    }

    public List<FacCctv> getScCctvs() {
        return getCctvsByTypes(Arrays.asList(
                ApiConstants.FAC_SC_CCTV_3,
                ApiConstants.FAC_SC_CCTV_B,
                ApiConstants.FAC_SC_CCTV_K,
                ApiConstants.FAC_SC_CCTV_L));
    }

    // ── private helpers ───────────────────────────────────────────────────────

    /**
     * 지역·이름 조건으로 ScFacInfo 를 조회한다.
     *
     * <p>기존: isAllArea 분기가 getFacs() 안에 인라인되어 있어 가독성 저하
     * <p>개선: 별도 메서드로 추출 후 nameLike 변수를 미리 계산
     */
    private List<ScFacInfo> queryFacs(List<String> areaCds, String scName) {
        boolean isAllArea = areaCds.isEmpty() || ALL_AREA_CODE.equals(areaCds.get(0));
        String  nameLike  = scName.isEmpty() ? null : "%" + scName + "%";

        if (isAllArea) {
            return nameLike == null
                    ? facViewRepository.findAll().stream().distinct().collect(Collectors.toList())
                    : facViewRepository.findDistinctByFacNmLikeAndFacClfyId(nameLike, ApiConstants.FAC_SC_CENTER);
        }

        List<String> areas = facAreaRepository.findByZnCds(areaCds);
        return nameLike == null
                ? facViewRepository.findDistinctByTopAreaIdIn(areas)
                : facViewRepository.findDistinctByTopAreaIdInAndFacNmLike(areas, nameLike);
    }

    /**
     * 분류 ID 목록에 해당하는 CCTV를 조회한다.
     *
     * <p>기존: getCrimeCctvs() / getScCctvs() 가 동일한 for-loop 구조를 중복하고,
     *          각 CCTV 마다 findByFacId() 를 호출해 N+1 쿼리 발생
     * <p>개선: findByFacIdIn() 으로 좌표를 한 번에 일괄 조회 후 Map 으로 O(1) 매핑
     *          → CCTV 100개 기준 101회 쿼리 → 2회로 감소
     */
    private List<FacCctv> getCctvsByTypes(List<String> clfyIds) {
        List<ErfFacInfo> cctvs = facRepository.findByFacClfyIdInAndUseYn(clfyIds, true);
        if (cctvs.isEmpty()) {
            return java.util.Collections.emptyList();
        }

        // 좌표 일괄 조회 후 facId → 첫 번째 좌표로 매핑 (1 쿼리)
        List<String> facIds = cctvs.stream()
                .map(ErfFacInfo::getFacId)
                .collect(Collectors.toList());
        Map<String, ErfPosCrdnt> posMap = facPosRepository.findByFacIdIn(facIds).stream()
                .collect(Collectors.toMap(
                        ErfPosCrdnt::getFacId,
                        p -> p,
                        (existing, duplicate) -> existing)); // 동일 facId 중복 시 첫 번째 유지

        // 좌표가 없는 CCTV 는 제외
        return cctvs.stream()
                .filter(cctv -> posMap.containsKey(cctv.getFacId()))
                .map(cctv -> toFacCctv(cctv, posMap.get(cctv.getFacId())))
                .collect(Collectors.toList());
    }

    /**
     * ErfFacInfo + ErfPosCrdnt → FacCctv DTO 변환
     *
     * <p>기존: FacUtil.buildFacCctv() — 7인자 positional constructor
     * <p>개선: @Builder 사용으로 의미가 명확한 매핑
     */
    private static FacCctv toFacCctv(ErfFacInfo info, ErfPosCrdnt pos) {
        return FacCctv.builder()
                .cctvId(info.getFacId())
                .cctvNm(info.getFacNm())
                .clfyId(info.getFacClfyId())
                .lat(pos.getYCrdnt())
                .lng(pos.getXCrdnt())
                .mgtNo(info.getMgtNo())
                .area(info.getArea())
                .build();
    }
}
