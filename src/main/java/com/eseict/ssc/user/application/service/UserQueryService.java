package com.eseict.ssc.user.application.service;

import com.eseict.common.net.http.HttpConnection;
import com.eseict.common.net.http.HttpConnectionException;
import com.eseict.ssc.config.ApiConstants;
import com.eseict.ssc.common.dto.KeyValue;
import com.eseict.ssc.user.application.dto.SysResponse;
import com.eseict.ssc.user.application.dto.UserResponse;
import com.eseict.ssc.user.application.dto.*;
import com.eseict.ssc.facility.domain.entity.ErfFacClfy;
import com.eseict.ssc.facility.domain.entity.ErfFacInfo;
import com.eseict.ssc.facility.domain.entity.TblAreaInfo;
import com.eseict.ssc.monitoring.domain.entity.IocStatEvetInfo;
import com.eseict.ssc.monitoring.domain.entity.IocUcityZnInfo;
import com.eseict.ssc.facility.domain.entity.ScFacInfo;
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

    @Value("${rino-platform.oms.url}")            private String OMS_URL;
    @Value("${rino-platform.oms.api.user.info}")  private String USER_URL;
    @Value("${rino-platform.oms.system.key}")     private String OMS_SYS_KEY;
    @Value("${rino-platform.oms.system.secret}")  private String OMS_SYS_SECRET;
    @Value("${rino-platform.oms.api.user.list}")  private String SYS_LIST;

    private final Gson gson = new Gson();

    // ── 사용자 정보 조회 ──────────────────────────────────────

    public UserResult getUser(String token) {
        UserInfo userInfo;
        List<SysInfo> sysInfos;

        if (token.equals("token")) {
            // 개발 모드
            userInfo = new UserInfo("token", "developer", "개발자", "010-1234-1234", "001", "", "", "", "nh402");
            sysInfos = Collections.singletonList(new SysInfo("통합플랫폼", "172.16.1.2:11910/oms"));
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

        return topAreas.stream().map(area -> {
            String topKey = area.getAreaId().substring(0, 7);

            List<SubZnRoleInfo> subAreasForm = subAreaMap.getOrDefault(topKey, Collections.emptyList())
                    .stream()
                    .map(sub -> new SubZnRoleInfo(area.getAreaId(), area.getAreaName(),
                            sub.getAreaId(), sub.getAreaName()))
                    .collect(Collectors.toList());

            List<ScFacInfo>  scFacInfos = scFacRepository.findByTopAreaId(area.getAreaId());
            List<ErfFacInfo> facList    = facRepository.findAreaFacListExceptSc(clfyIds, topKey + "%");

            int scStatusCnt    = scFacInfos.stream().mapToInt(ScFacInfo::getTodayStatusEvet).sum();
            int scSituationCnt = scFacInfos.stream().mapToInt(ScFacInfo::getTodaySitEvet).sum();

            IocUcityZnInfo zn = znInfoRepository.findByZnNm(area.getAreaName())
                    .stream().findFirst()
                    .orElseThrow(() -> new IllegalStateException("존 정보 없음: " + area.getAreaName()));

            return new ZnRoleInfo(
                    zn.getZnCd(), zn.getZnNm(),
                    area.getAreaId(),
                    !scFacInfos.isEmpty(),
                    scFacInfos.size(),
                    facList.size(),
                    scSituationCnt,
                    scStatusCnt,
                    subAreasForm
            );
        }).collect(Collectors.toList());
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
