package com.eseict.ssc.user.application.service;

import com.eseict.common.net.http.HttpConnection;
import com.eseict.common.net.http.HttpConnectionException;
import com.eseict.ssc.config.ApiConstants;
import com.eseict.ssc.common.dto.ChkTokenAliveResponse;
import com.eseict.ssc.common.dto.KeyValue;
import com.eseict.ssc.user.application.dto.SysResponse;
import com.eseict.ssc.user.application.dto.UserResponse;
import com.eseict.ssc.user.application.dto.*;
import com.eseict.ssc.facility.domain.entity.ErfFacClfy;
import com.eseict.ssc.facility.domain.entity.ErfFacInfo;
import com.eseict.ssc.facility.domain.entity.TblAreaInfo;
import com.eseict.ssc.monitoring.domain.entity.IocStatEvetInfo;
import com.eseict.ssc.monitoring.domain.entity.IocUcityZnInfo;
import com.eseict.ssc.repository.event.EventInfoRepository;
import com.eseict.ssc.repository.event.EventZnInfoRepository;
import com.eseict.ssc.repository.fac.FacAreaRepository;
import com.eseict.ssc.repository.fac.FacClfyRepository;
import com.eseict.ssc.repository.fac.FacRepository;
import com.eseict.ssc.repository.scm.ScFacRepository;
import com.google.gson.Gson;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

/**
 * UserQueryService (refac) — 사용자 조회
 *
 * 기존(service/newUser/UserService):
 *   - 조회(getUser, getRoleInfo)와 명령(doLogout)이 혼재
 * 개선:
 *   - CQRS 분리: 조회 → UserQueryService / 명령 → UserCommandService
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class UserQueryService {

    private final FacAreaRepository    areaRepository;
    private final EventZnInfoRepository znInfoRepository;
    private final FacRepository        facRepository;
    private final FacClfyRepository    facClfyRepository;
    private final EventInfoRepository  eventInfoRepository;
    private final ScFacRepository      scFacRepository;

    @Value("${rino-platform.oms.url}")              private String OMS_URL;
    @Value("${rino-platform.oms.api.user.info}")    private String USER_URL;
    @Value("${rino-platform.oms.system.key}")       private String OMS_SYS_KEY;
    @Value("${rino-platform.oms.system.secret}")    private String OMS_SYS_SECRET;
    @Value("${rino-platform.oms.api.user.list}")    private String SYS_LIST;
    @Value("${rino-platform.oms.api.user.tokenAlive}") private String TOKEN_ALIVE_URL;

    private final Gson gson = new Gson();

    // ── 토큰 유효성 검사 ──────────────────────────────────────

    /**
     * OMS tokenAlive API 호출.
     *
     * 주의 — "확인" 이 아니라 "확인 + 연장":
     *   OMS LoginCache 는 Guava CacheBuilder.expireAfterAccess(30분) 이므로
     *   이 호출 자체가 access 가 되어 호출 시점부터 TTL 이 30분으로 재설정된다.
     *   따라서 페이지 진입(ViewController.scMngView) 1회 + /sc/mng 상주 중
     *   프론트 훅 useTokenKeepAlive 가 15분 간격으로 호출해 세션을 유지한다.
     *
     * 로그 정책 (프론트 keep-alive 로 15분마다 호출되므로 성공 로그가 과다해짐):
     *   - 성공 → debug  (운영 log-level info 에서 안 보임)
     *   - 만료 → warn   (토큰이 끊긴 순간만 표시)
     *   - 예외 → error  (OMS 통신 실패)
     *
     * 예외 발생 시 false 반환(보안 fail-closed).
     */
    public boolean isTokenAlive(String token) {
        if (token == null || token.isEmpty()) return false;

        // 개발 모드는 OMS 호출 없이 통과
        if (ApiConstants.IS_DEV.equals(ApiConstants.IsDev.DEV)) return true;

        try {
            Map<String, Object> header = new HashMap<>();
            Map<String, Object> param  = new HashMap<>();
            header.put("systemKey", OMS_SYS_KEY);
            header.put("secret",    OMS_SYS_SECRET);
            param.put("token", token);

            String resStr = new HttpConnection<String>().doPost(OMS_URL + TOKEN_ALIVE_URL, header, param);
            ChkTokenAliveResponse res = gson.fromJson(resStr, ChkTokenAliveResponse.class);

            boolean alive = ApiConstants.Result.OMS_SUCCESS_CODE.equalsIgnoreCase(res.getResult());
            String prefix = token.length() > 8 ? token.substring(0, 8) + "..." : token;

            if (alive) {
                // 연장 성공 — 운영에서는 숨김. 디버깅 시 log-level 을 debug 로 낮추면 보임.
                log.debug("token extended | prefix={}", prefix);
            } else {
                // 토큰 만료/무효 — 이때만 로그 남김
                log.warn("token expired or invalid | result={} | prefix={}", res.getResult(), prefix);
            }
            return alive;
        } catch (Exception e) {
            log.error("tokenAlive API 호출 실패 → 접근 차단", e);
            return false;
        }
    }

    // ── 사용자 정보 조회 ──────────────────────────────────────

    public UserResult getUser(String token) {
        UserInfo userInfo;
        List<SysInfo> sysInfos;

        if (token.equals("token")) {
            // 개발 모드
            userInfo = new UserInfo("token", "developer", "개발자", "010-0000-0000", "001", "", "", "", "nh402");
            sysInfos = Collections.singletonList(new SysInfo("통합플랫폼", "127.0.0.1:11910/oms"));
        } else {
            Map<String, Object> header = new HashMap<>();
            Map<String, Object> param  = new HashMap<>();
            header.put("systemKey", OMS_SYS_KEY);
            header.put("secret",    OMS_SYS_SECRET);
            param.put("token", token);

            userInfo  = getUserInfoFromOms(token, header, param, OMS_URL + USER_URL);
            sysInfos  = getSysInfosFromOms(token, header, param, OMS_URL + SYS_LIST);
        }

        return UserResult.builder()
                .userInfo(userInfo)
                .sysInfos(sysInfos)
                .build();
    }

    // ── 권한 정보 조회 ────────────────────────────────────────

    public RoleInfo getRoleInfo() {
        List<ZnRoleInfo> areaRoles = getZnRoleInfos();
        List<IocStatEvetInfo> eventInfos = eventInfoRepository
                .findByUnitSvcCdAndSvcThemeCdAndStatEvetCdIn("001", "SSC", Arrays.asList("01", "02"));
        List<KeyValue> eventRoles = eventInfos.stream()
                .map(e -> new KeyValue(e.getStatEvetCd(), e.getStatEvetNm()))
                .distinct()
                .collect(Collectors.toList());
        return new RoleInfo(areaRoles, eventRoles);
    }

    // ── 지역별 권한 트리 ──────────────────────────────────────

    private List<ZnRoleInfo> getZnRoleInfos() {
        List<TblAreaInfo> topAreas   = areaRepository.findByAreaIdLike("%000");
        List<TblAreaInfo> subAreas   = areaRepository.findByAreaIdNotLike("%000");
        List<ErfFacClfy>  clfyList   = facClfyRepository.findByTopFacClfyIdAndFacClfyIdIsNot(
                ApiConstants.FAC_SSC_TOP, ApiConstants.FAC_SC_CENTER);
        List<String> clfyIds = clfyList.stream().map(ErfFacClfy::getFacClfyId).collect(Collectors.toList());

        Map<String, List<TblAreaInfo>> subAreaMap = subAreas.stream()
                .collect(Collectors.groupingBy(sub -> sub.getAreaId().substring(0, 7)));
        Map<String, ScRoleCount> scRoleCountMap = scFacRepository.summarizeRoleCountsByTopAreaId().stream()
                .collect(Collectors.toMap(
                        row -> (String) row[0],
                        row -> new ScRoleCount(
                                ((Number) row[1]).intValue(),
                                ((Number) row[2]).intValue(),
                                ((Number) row[3]).intValue())
                ));

        return topAreas.stream().map(area -> {
            String topKey = area.getAreaId().substring(0, 7);

            List<SubZnRoleInfo> subAreasForm = subAreaMap.getOrDefault(topKey, Collections.emptyList())
                    .stream()
                    .map(sub -> new SubZnRoleInfo(area.getAreaId(), area.getAreaName(),
                            sub.getAreaId(), sub.getAreaName()))
                    .collect(Collectors.toList());

            ScRoleCount scRoleCount = scRoleCountMap.getOrDefault(area.getAreaId(), ScRoleCount.EMPTY);
            List<ErfFacInfo> facList = facRepository.findAreaFacListExceptSc(clfyIds, topKey + "%");

            IocUcityZnInfo zn = znInfoRepository.findByZnNm(area.getAreaName())
                    .stream().findFirst()
                    .orElseThrow(() -> new IllegalStateException("존 정보 없음: " + area.getAreaName()));

            return new ZnRoleInfo(
                    zn.getZnCd(), zn.getZnNm(),
                    area.getAreaId(),
                    scRoleCount.facilityCount > 0,
                    scRoleCount.facilityCount,
                    facList.size(),
                    scRoleCount.situationCount,
                    scRoleCount.statusCount,
                    subAreasForm
            );
        }).collect(Collectors.toList());
    }

    private static class ScRoleCount {
        private static final ScRoleCount EMPTY = new ScRoleCount(0, 0, 0);

        private final int facilityCount;
        private final int situationCount;
        private final int statusCount;

        private ScRoleCount(int facilityCount, int situationCount, int statusCount) {
            this.facilityCount = facilityCount;
            this.situationCount = situationCount;
            this.statusCount = statusCount;
        }
    }

    // ── OMS API 헬퍼 ─────────────────────────────────────────

    private UserInfo getUserInfoFromOms(String token, Map<String, Object> header,
                                        Map<String, Object> param, String url) {
        if (token.equals("token") || token.isEmpty()) return null;
        try {
            String response = new HttpConnection<String>().doPost(url, header, param);
            UserResponse userResponse = gson.fromJson(response, UserResponse.class);
            if (userResponse.getResult().equals(ApiConstants.Result.OMS_SUCCESS_CODE)) {
                return userResponse.getData();
            }
        } catch (HttpConnectionException e) {
            log.error("Error getting user info: {}", e.getMessage());
            throw new RuntimeException(e);
        }
        return null;
    }

    private List<SysInfo> getSysInfosFromOms(String token, Map<String, Object> header,
                                              Map<String, Object> param, String url) {
        if (token.equals("token") || token.isEmpty()) return new ArrayList<>();
        try {
            String response = new HttpConnection<String>().doPost(url, header, param);
            SysResponse sysResponse = gson.fromJson(response, SysResponse.class);
            if (sysResponse.getResult().equals(ApiConstants.Result.OMS_SUCCESS_CODE)) {
                return sysResponse.getData();
            }
        } catch (HttpConnectionException e) {
            log.error("Error getting sys info: {}", e.getMessage());
            throw new RuntimeException(e);
        }
        return new ArrayList<>();
    }
}
