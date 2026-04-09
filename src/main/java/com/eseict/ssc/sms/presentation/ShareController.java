package com.eseict.ssc.sms.presentation;

import com.eseict.ssc.common.dto.CommonResponse;
import com.eseict.ssc.sms.application.dto.SendContent;
import com.eseict.ssc.sms.application.service.ShareService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

import static com.eseict.ssc.config.ApiConstants.Common.API_PRODUCES;

/**
 * ShareController (refac) — SMS/방송 통합 발송
 *
 * 기존: /share/send → service/newSms/ShareService
 * 개선: /refac/share/send → refac/sms/application/service/ShareService
 */
@RequiredArgsConstructor
@Slf4j
@RestController
@RequestMapping(value = "/share", produces = API_PRODUCES)
public class ShareController {

    private final ShareService shareService;

    @PostMapping("/send")
    public ResponseEntity<CommonResponse> sendSharing(@RequestBody List<SendContent> shareContents) {
        log.info("sendSharing : {}", shareContents);
        return ResponseEntity.ok(shareService.sendShare(shareContents));
    }
}
