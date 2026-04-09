package com.eseict.ssc.sms.presentation;

import com.eseict.ssc.sms.application.dto.BroadDevice;
import com.eseict.ssc.sms.application.service.BroadcastService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

import static com.eseict.ssc.config.ApiConstants.Common.API_PRODUCES;

/**
 * BroadcastController (refac) — 방송 장비 트리 조회
 *
 * 기존: /broadcast/device → service/newSms/BroadcastService
 * 개선: /refac/broadcast/device → refac/sms/application/service/BroadcastService
 */
@RequiredArgsConstructor
@Slf4j
@RestController
@RequestMapping(value = "/broadcast", produces = API_PRODUCES)
public class BroadcastController {

    private final BroadcastService broadcastService;

    @GetMapping("/device")
    public List<BroadDevice> getBroadcastDeviceList() {
        return broadcastService.getBroadDevices();
    }
}
