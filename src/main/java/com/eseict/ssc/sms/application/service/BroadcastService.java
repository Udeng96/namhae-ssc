package com.eseict.ssc.sms.application.service;

import com.eseict.ssc.cache.CacheHandler;
import com.eseict.ssc.config.ApiConstants;
import com.eseict.ssc.common.dto.CommonResponse;
import com.eseict.ssc.sms.application.dto.*;
import com.eseict.ssc.facility.domain.entity.ErfFacClfyAddInfoData;
import com.eseict.ssc.sms.domain.entity.OmsCommCdInfo;
import com.eseict.ssc.sms.domain.entity.TtsBrcastEntry;
import com.eseict.ssc.sms.domain.entity.TtsBrcastInfo;
import com.eseict.ssc.sms.domain.entity.ViewTermInfo;
import com.eseict.ssc.sms.domain.entity.ShareSendHistory;
import com.eseict.ssc.repository.fac.FacAddInfoRepository;
import com.eseict.ssc.repository.fac.FacRepository;
import com.eseict.ssc.repository.share.broadcast.BroadTermRepository;
import com.eseict.ssc.repository.share.common.ShareHistRepository;
import com.eseict.ssc.repository.share.broadcast.TtsBrcastEntryRepository;
import com.eseict.ssc.repository.share.broadcast.TtsBrcastInfoRepository;
import com.eseict.ssc.util.IdGenerator;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

import static com.eseict.ssc.config.ApiConstants.Result.FAIL_CODE;
import static com.eseict.ssc.config.ApiConstants.Result.SUCCESS_CODE;
import static com.eseict.ssc.config.ApiConstants.SSC;

/**
 * BroadcastService (refac) — 방송 송출 및 장비 트리 조회
 *
 * 기존(service/newSms/BroadcastService):
 *   - 패키지만 변경 (service.newSms → refac.sms.application.service)
 *   - 로직 동일 유지
 */
@RequiredArgsConstructor
@Service
@Slf4j
public class BroadcastService {

    private final CacheHandler cacheHandler;
    private final ShareHistRepository shareHistRepository;
    private final FacRepository facRepository;
    private final FacAddInfoRepository facAddInfoRepository;
    private final BroadTermRepository broadViewRepository;
    private final TtsBrcastInfoRepository ttsBrcastInfoRepository;
    private final TtsBrcastEntryRepository ttsBrcastEntryRepository;

    /**
     * 방송 송출(웹방송) 처리
     * 1. TTS 방송 정보/Entry 저장
     * 2. 송출 장비명/타겟명/위치명 가공
     * 3. ShareSendHistory 저장
     * 4. 성공/실패 코드 반환
     */
    public CommonResponse sendBroad(BroadContent broadContent, String broadId) {
        CommonResponse response = new CommonResponse(FAIL_CODE);
        int ttsKey = 0;
        try {
            int termsec = 10;
            for (BroadContentSc sc : broadContent.getTermKeySetList()) {
                termsec += 3;
                LocalDateTime now = LocalDateTime.now().plusSeconds(termsec);
                String orderTime = now.format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));

                TtsBrcastInfo info = new TtsBrcastInfo();
                info.setStatus(1);
                info.setOrderTime(orderTime);
                info.setOrderUser(SSC);
                info.setOrderClient("웹방송");
                info.setText(broadContent.getBroadcastDirText());
                info.setUpChime(1);
                info.setDownChime(0);
                info.setVolume(-1);
                info.setSpeed(-1);
                info.setTtsDbType(-1);
                info.setBrcastDay("");
                info.setBrcastTime("");
                info.setBrcastType(3);
                info.setResult("");
                info.setRequestKey((int) now.toEpochSecond(ZoneOffset.UTC));

                TtsBrcastInfo ttsBrcastInfo = ttsBrcastInfoRepository.save(info);
                ttsBrcastEntryRepository.save(new TtsBrcastEntry(ttsBrcastInfo.getTtsKey(), Long.parseLong(sc.getTermLocation()), Long.parseLong(sc.getTermDevKey().replaceAll("-", ""))));
                ttsKey = Math.toIntExact(ttsBrcastInfo.getTtsKey());
            }
            log.info("SAVED TO BROADCAST DB SUCCESS!");

            // 2. 송출 타겟명/장비명 가공
            List<BroadDeviceInfo> broadDeviceList = facRepository.findBroadDeviceLists(Collections.singletonList(ApiConstants.BROADCAST.BROADCAST_DEVICE_CODE));
            Map<String, BroadTargetName> dsCodeMap = new HashMap<>();
            for (BroadContentSc sc : broadContent.getTermKeySetList()) {
                for (BroadDeviceInfo deviceInfo : broadDeviceList) {
                    if (sc.getMgtNo().equals(deviceInfo.getMgtNo())) {
                        BroadTargetName targetName = dsCodeMap.putIfAbsent(deviceInfo.getAddInfoValue(), new BroadTargetName(deviceInfo.getAddInfoValue(), deviceInfo.getFacId()));
                        if (targetName != null) {
                            targetName.addDeviceName(deviceInfo.getFacId());
                        }
                    }
                }
            }
            for (OmsCommCdInfo omsCommCdInfo : cacheHandler.getDsCodeIdentifier()) {
                for (Map.Entry<String, BroadTargetName> entry : dsCodeMap.entrySet()) {
                    if (entry.getKey().equals(omsCommCdInfo.getCd())) {
                        entry.getValue().setDsNm(omsCommCdInfo.getCdNm());
                    }
                }
            }
            StringBuilder targetDeviceNm = new StringBuilder();
            for (BroadTargetName value : dsCodeMap.values()) {
                targetDeviceNm.append(value.makeTargetDeviceMessage()).append(",");
            }
            if (targetDeviceNm.length() > 0) {
                targetDeviceNm.deleteCharAt(targetDeviceNm.length() - 1);
            }
            StringBuilder targetDevice = new StringBuilder();
            for (BroadContentSc sc : broadContent.getTermKeySetList()) {
                for (BroadDeviceInfo deviceInfo : broadDeviceList) {
                    if (sc.getMgtNo().equals(deviceInfo.getMgtNo())) {
                        targetDevice.append(deviceInfo.getMgtNo()).append(",");
                    }
                }
            }
            if (targetDevice.length() > 0) {
                targetDevice.deleteCharAt(targetDevice.length() - 1);
            }
            List<BroadContentSc> broadContentScList = broadContent.getTermKeySetList();
            StringBuilder scLocationName = new StringBuilder();
            StringBuilder scKeySetResponse = new StringBuilder();
            for (BroadContentSc sc : broadContentScList) {
                scLocationName.append(sc.getTermLocation()).append(",");
                scKeySetResponse.append(sc.toString()).append("/");
            }
            if (scLocationName.length() > 0) {
                scLocationName.deleteCharAt(scLocationName.length() - 1);
            }

            // 3. ShareSendHistory 저장
            String eventSeqn = IdGenerator.getPrefixedUUID64("BRC");
            ShareSendHistory shareSendHistory = ShareSendHistory.builder()
                    .msgSeqn(eventSeqn)
                    .msgType(ApiConstants.SHARE.BROADCAST)
                    .msgTitle(broadContent.getBroadcastDirTitle())
                    .msgContent(broadContent.getBroadcastDirText())
                    .sendTime(broadContent.getSendDtm())
                    .oriEventSeqn(broadContent.getEventSeq())
                    .targetList(scKeySetResponse.toString())
                    .ttsKey(Integer.parseInt(String.valueOf(ttsKey)))
                    .broadcastId(broadId)
                    .build();
            ShareSendHistory saved = shareHistRepository.save(shareSendHistory);

            return saved != null ? new CommonResponse(SUCCESS_CODE) : new CommonResponse(FAIL_CODE);
        } catch (Exception e) {
            log.error("방송 송출 중 오류 발생", e);
            return new CommonResponse(FAIL_CODE);
        }
    }

    /**
     * 방송 장비 트리 구조 조회
     * - 지역/마을회관/장비 계층 트리 반환
     */
    public List<BroadDevice> getBroadDevices() {
        List<BroadDevice> result = new ArrayList<>();

        List<OmsCommCdInfo> dsCodeIdentifier = cacheHandler.getDsCodeIdentifier();

        List<BroadDeviceInfo> broadDeviceInfos = facRepository.findBroadDeviceLists(Collections.singletonList(ApiConstants.BROADCAST.BROADCAST_DEVICE_CODE));
        List<ErfFacClfyAddInfoData> facAddInfos = facAddInfoRepository.findById_FacIdIn(broadDeviceInfos.stream().map(BroadDeviceInfo::getFacId).collect(Collectors.toList()));

        HashMap<String, BroadInfo> map = new HashMap<>();
        List<BroadInfo> broadInfos = new ArrayList<>();

        List<ViewTermInfo> viewTermInfos = broadViewRepository.findAll();

        for (BroadDeviceInfo broadDeviceInfo : broadDeviceInfos) {
            if (map.get(broadDeviceInfo.getFacId()) == null) {
                BroadInfo broadInfo = new BroadInfo(broadDeviceInfo.getMgtNo(), broadDeviceInfo.getFacNm(), broadDeviceInfo.getAddrShort(), broadDeviceInfo.getLat(), broadDeviceInfo.getLon(), broadDeviceInfo.getStuDtm());
                map.put(broadDeviceInfo.getFacId(), broadInfo);
                broadInfos.add(broadInfo);
            }
        }

        for (ErfFacClfyAddInfoData facAddInfo : facAddInfos) {
            BroadInfo broadInfo = map.get(facAddInfo.getId().getFacId());
            broadInfo.setValueByAddInfoId(facAddInfo.getId().getAddInfoId(), facAddInfo.getAddInfoData(), dsCodeIdentifier);
        }

        for (ViewTermInfo viewTermInfo : viewTermInfos) {
            for (BroadInfo broadInfo : map.values()) {
                if (viewTermInfo.getTermLocation().equals(broadInfo.getMgtNb())) {
                    broadInfo.setTerminalKey(String.valueOf(viewTermInfo.getTerminalKey()));
                    broadInfo.setCamDevNum(String.valueOf(viewTermInfo.getCamDevNum()));
                }
            }
        }

        // 재해 지구에 맞게 방송장비 분류
        List<BroadArea> broadAreas = new ArrayList<>();
        Map<String, List<BroadInfo>> broadInfosMap = new HashMap<>();

        for (OmsCommCdInfo commonCd : dsCodeIdentifier) {
            broadInfosMap.putIfAbsent(commonCd.getCd(), new ArrayList<>());
            broadAreas.add(new BroadArea(commonCd.getCdNm()));

            for (BroadInfo broadInfo : broadInfos) {
                if (commonCd.getCd().equals(broadInfo.getDsCode())) {
                    broadInfosMap.get(commonCd.getCd()).add(broadInfo);
                }
            }
        }

        for (BroadArea broadArea : broadAreas) {
            for (OmsCommCdInfo commonCd : dsCodeIdentifier) {
                if (broadArea.getDsName().equals(commonCd.getCdNm())) {
                    broadArea.setList(broadInfosMap.get(commonCd.getCd()));
                }
            }
        }

        int id = 1;
        result.add(new BroadDevice("1", "", "", "전체 지역"));

        List<SubBroadDevice> subBroadList = new ArrayList<>();
        Map<String, String> subId = new HashMap<>();

        for (BroadArea broadArea : broadAreas) {
            id += 1;
            String disabled = broadArea.getList().isEmpty() ? "disabled" : "";
            subBroadList.add(new SubBroadDevice(String.valueOf(id), "1", disabled, broadArea.getDsName()));
            subId.put(broadArea.getDsName(), String.valueOf(id));
        }

        int idx = 0;
        for (BroadArea broadArea : broadAreas) {
            List<LastBroadDevice> lastList = new ArrayList<>();
            for (BroadInfo broadInfo : broadArea.getList()) {
                if (broadInfo.getDsName().equals(broadArea.getDsName())) {
                    lastList.add(new LastBroadDevice(
                            broadInfo.getMgtNb() + "," + broadInfo.getTerminalKey() + "," + broadInfo.getCamDevNum(),
                            subId.get(broadArea.getDsName()),
                            "",
                            broadInfo.getDeviceName(),
                            broadInfo.getLon(),
                            broadInfo.getLat()
                    ));
                }
            }
            subBroadList.get(idx).setChildBroadDeviceList(lastList);
            idx++;
        }
        result.get(0).setSubBroadDeviceList(subBroadList);

        return result;
    }
}
