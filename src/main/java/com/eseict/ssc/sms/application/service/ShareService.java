package com.eseict.ssc.sms.application.service;

import com.eseict.ssc.config.ApiConstants;
import com.eseict.ssc.common.dto.CommonResponse;
import com.eseict.ssc.sms.application.dto.SendContent;
import com.eseict.ssc.sms.application.dto.BroadContent;
import com.eseict.ssc.sms.application.dto.BroadContentSc;
import com.eseict.ssc.sms.application.dto.BroadSendTarget;
import com.eseict.ssc.sms.domain.entity.ShareSendHistory;
import com.eseict.ssc.common.util.DateTimeUtil;
import com.eseict.ssc.util.IdGenerator;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static com.eseict.ssc.config.ApiConstants.Result.SUCCESS_CODE;

/**
 * ShareService (refac) — SMS/방송 통합 발송 라우터
 *
 * 기존(service/newSms/ShareService):
 *   - SmsService, BroadcastService → refac.sms.application.service 패키지로 변경
 *   - 로직 동일 유지
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class ShareService {

    private final SmsService smsService;
    private final BroadcastService broadcastService;

    public CommonResponse sendShare(List<SendContent> sendContents) {
        String sendTime = DateTimeUtil.getNowLocalDateTimeFreeFormat(ApiConstants.DATE.FORMAT_17);
        String shareId  = IdGenerator.getUUID64();

        for (SendContent sendContent : sendContents) {
            if (sendContent.getType().equals(ApiConstants.SHARE.SMS)) {
                List<Map<String, String>> sndTarget = new ArrayList<>();
                for (String s : sendContent.getSndTarget()) {
                    Map<String, String> targets = new HashMap<>();
                    String[] target = s.split("/");
                    targets.put(target[0], target[1].replaceAll("-", ""));
                    sndTarget.add(targets);
                }

                StringBuilder targetsStr = new StringBuilder();
                for (Map<String, String> target : sndTarget) {
                    for (Map.Entry<String, String> entry : target.entrySet()) {
                        targetsStr.append(entry.getKey()).append("(").append(entry.getValue()).append("),");
                    }
                }
                if (targetsStr.length() > 0) {
                    targetsStr.deleteCharAt(targetsStr.length() - 1);
                }

                String sendMessageSeqn = IdGenerator.getPrefixedUUID64("MSG");
                ShareSendHistory shareSendHistory = ShareSendHistory.builder()
                        .msgSeqn(sendMessageSeqn)
                        .msgType(ApiConstants.SHARE.SMS)
                        .msgTitle(sendContent.getTitle())
                        .msgContent(sendContent.getContent())
                        .targetList(targetsStr.toString())
                        .sendTime(sendTime)
                        .oriEventSeqn(sendContent.getEventSeq())
                        .broadcastId(shareId)
                        .ttsKey(0).build();

                return smsService.sendMessage(shareSendHistory, sndTarget);
            } else {
                List<BroadContentSc> sndScTargets = new ArrayList<>();
                for (String s : sendContent.getSndTarget()) {
                    String[] target = s.split("/");
                    BroadSendTarget broadSendTarget = new BroadSendTarget(target[0], target[1]);
                    String[] split = broadSendTarget.getTargetInfo().split(",");
                    BroadContentSc scTarget = new BroadContentSc(split[1], split[2], split[0]);
                    sndScTargets.add(scTarget);
                }

                BroadContent broadContent = new BroadContent(sendContent.getEventSeq(), sendContent.getTitle(), sendContent.getContent(), sendTime, shareId, sndScTargets);
                return broadcastService.sendBroad(broadContent, shareId);
            }
        }

        return new CommonResponse(SUCCESS_CODE);
    }
}
