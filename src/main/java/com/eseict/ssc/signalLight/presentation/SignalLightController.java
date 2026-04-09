package com.eseict.ssc.signalLight.presentation;

import com.eseict.ssc.config.ApiConstants;
import com.eseict.ssc.signalLight.application.service.SignalLightService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * SignalLightController (refac) — 경광봉 제어 API
 *
 * 기존(controller/signalLight/SignalLightController):
 *   - 패키지 변경 및 refac SignalLightService 사용
 *   - URL 동일 유지 (/signal-light/on, /signal-light/off)
 */
@Slf4j
@RestController
@CrossOrigin("*")
@RequestMapping(value = "/signal-light", produces = ApiConstants.Common.API_PRODUCES)
@RequiredArgsConstructor
public class SignalLightController {

    private final SignalLightService signalLightService;

    @PostMapping("/on")
    public void turnOnSignalLight() {
        signalLightService.sendSignalLightCommand(true);
    }

    @PostMapping("/off")
    public void turnOffSignalLight() {
        signalLightService.sendSignalLightCommand(false);
    }
}
