package com.eseict.ssc.sms.application.service;

import com.eseict.ssc.common.dto.CommonResponse;
import com.eseict.ssc.sms.application.dto.DeptMemTarget;
import com.eseict.ssc.sms.application.dto.DeptTarget;
import com.eseict.ssc.user.domain.entity.DepartmentInfo;
import com.eseict.ssc.user.domain.entity.DepartmentMemberInfo;
import com.eseict.ssc.sms.domain.entity.ShareSendHistory;
import com.eseict.ssc.sms.domain.entity.KumsMsg;
import com.eseict.ssc.repository.share.common.DeptMemRepository;
import com.eseict.ssc.repository.share.common.DeptRepository;
import com.eseict.ssc.repository.share.common.ShareHistRepository;
import com.eseict.ssc.repository.share.sms.SmsRepository;
import com.eseict.ssc.util.CryptUtil;
import com.google.common.base.Strings;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

import static com.eseict.ssc.config.ApiConstants.Result.SUCCESS_CODE;

/**
 * SmsService (refac) — SMS 발송 및 수신 대상 조회
 *
 * 기존(service/newSms/SmsService):
 *   - 패키지만 변경 (service.newSms → refac.sms.application.service)
 *   - 로직 동일 유지
 * 개선:
 *   - @Service qualifier "SmsService" 유지 (ShareService Bean 주입 호환)
 *   - DDD 레이어 구조 적용
 */
@RequiredArgsConstructor
@Service("SmsService")
@Slf4j
public class SmsService {

    private final DeptRepository deptRepository;
    private final DeptMemRepository deptMemRepository;
    private final ShareHistRepository shareHistRepository;
    private final SmsRepository smsRepository;
    private final CryptUtil cryptUtil;

    @Value("${sms.sender}")
    private String sender;

    @Transactional
    public CommonResponse sendMessage(ShareSendHistory shareSendHistory, List<Map<String, String>> sndTarget) {
        saveKumsMsg(shareSendHistory, sndTarget);
        ShareSendHistory insertResult = shareHistRepository.save(shareSendHistory);
        log.info("send SMS result : {}", insertResult.getMsgSeqn());
        return new CommonResponse(SUCCESS_CODE);
    }

    /**
     * KUMS_MSG Table에 SAVE시 업체에서 MSG를 발송
     */
    private void saveKumsMsg(ShareSendHistory shareSendHistory, List<Map<String, String>> sndTarget) {
        for (Map<String, String> stringStringMap : sndTarget) {
            for (Map.Entry<String, String> stringStringEntry : stringStringMap.entrySet()) {
                KumsMsg msg = new KumsMsg(shareSendHistory.getMsgType(), shareSendHistory.getMsgContent(), stringStringEntry.getValue(), sender);
                smsRepository.save(msg);
                log.info("msg saved to KUMS :: {}, {}, {}, {}, {}", msg.getSmsType(), msg.getMsg(), msg.getMobileNo(), msg.getCallbackNo(), msg.getInsertDate());
            }
        }
    }

    private static String norm(Object o) {
        return o == null ? "" : o.toString().trim();
    }

    public List<DeptTarget> getTarget() {
        Map<String, String> cryptMap = new HashMap<>();

        // 1) 부서 전체 조회
        List<DepartmentInfo> list = deptRepository.findAll();

        // 상위(SEQ=2)
        Map<String, DeptTarget> firstByCd = new LinkedHashMap<>();
        // 하위(SEQ=3) (중복 방지)
        Map<String, DeptTarget.SecondDeptTarget> secondByCd = new LinkedHashMap<>();
        // 상위부서코드 → 2차 부서 리스트
        Map<String, List<DeptTarget.SecondDeptTarget>> secondsOfFirst = new HashMap<>();

        for (DepartmentInfo d : list) {
            String seq    = norm(d.getDepartmentSeq());
            String deptCd = norm(d.getDepartmentCd());
            String uprCd  = norm(d.getUprDepartmentCd());

            if ("2".equals(seq)) {
                firstByCd.putIfAbsent(deptCd,
                        DeptTarget.builder()
                                .departmentCd(deptCd)
                                .departmentCdNm(norm(d.getDepartmentCdNm()))
                                .departmentSe(norm(d.getDepartmentSe()))
                                .uprDepartmentCd(uprCd)
                                .departmentSeq(seq)
                                .departmentRank(norm(d.getDepartmentRank()))
                                .departmentFullNm(norm(d.getDepartmentFullNm()))
                                .build()
                );
            } else if ("3".equals(seq)) {
                // 동일 deptCd 중복 차단
                secondByCd.computeIfAbsent(deptCd, k ->
                        DeptTarget.SecondDeptTarget.builder()
                                .departmentCd(deptCd)
                                .departmentCdNm(norm(d.getDepartmentCdNm()))
                                .departmentSe(norm(d.getDepartmentSe()))
                                .uprDepartmentCd(uprCd)
                                .departmentSeq(seq)
                                .departmentRank(norm(d.getDepartmentRank()))
                                .departmentFullNm(norm(d.getDepartmentFullNm()))
                                .build()
                );
                // 상위부서 버킷 준비
                secondsOfFirst.computeIfAbsent(uprCd, k -> new ArrayList<>());
            }
        }

        // 2) 2차 부서별 멤버 세팅 (전화번호 중복 제거)
        for (DeptTarget.SecondDeptTarget second : secondByCd.values()) {
            String cd = norm(second.getDepartmentCd());
            List<DepartmentMemberInfo> mems = deptMemRepository.findByDepartmentCd(cd);

            Set<String> hpNoSet = new HashSet<>();
            List<DeptMemTarget> memTargets = new ArrayList<>();

            for (DepartmentMemberInfo mem : mems) {
                if (!Strings.isNullOrEmpty(mem.getHpNo())) {
                    cryptMap.put("userName", mem.getUsrNm());
                    cryptMap.put("phoneNo", mem.getHpNo());

                    Map<String, String> res = cryptUtil.decrypt(cryptMap, mem.getKey());
                    String userName = res.get("userName");
                    String phoneNo  = res.get("phoneNo");

                    if (hpNoSet.add(phoneNo)) {
                        memTargets.add(DeptMemTarget.builder()
                                .hpNo(phoneNo)
                                .usrNm(userName)
                                .departmentCd(norm(mem.getDepartmentCd()))
                                .departmentCdNm(norm(mem.getDepartmentCdNm()))
                                .build()
                        );
                    }
                }
            }
            second.setChildren(memTargets);

            // 정규화된 uprCd로 상위에 귀속
            String parent = norm(second.getUprDepartmentCd());
            secondsOfFirst.computeIfAbsent(parent, k -> new ArrayList<>()).add(second);
        }

        // 3) 최종 조립: 상위부서별로 2차부서 정렬+중복제거
        List<DeptTarget> result = new ArrayList<>(firstByCd.values());
        for (DeptTarget first : result) {
            String firstCd = norm(first.getDepartmentCd());
            List<DeptTarget.SecondDeptTarget> seconds = secondsOfFirst.getOrDefault(firstCd, new ArrayList<>());

            Set<String> seen = new HashSet<>();
            List<DeptTarget.SecondDeptTarget> dedupSorted = new ArrayList<>();
            seconds.stream()
                    .sorted(Comparator.comparing(s -> norm(s.getDepartmentCd())))
                    .forEach(s -> { if (seen.add(norm(s.getDepartmentCd()))) dedupSorted.add(s); });

            first.setSecondDeptTargetList(dedupSorted);
        }

        result.sort(Comparator.comparing(d -> norm(d.getDepartmentCd())));
        return result;
    }
}
