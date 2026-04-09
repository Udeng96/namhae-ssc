package com.eseict.ssc.conf.presentation;

import com.eseict.ssc.conf.application.dto.OpenConfResult;
import com.eseict.ssc.conf.domain.entity.BellConfInfo;
import com.eseict.ssc.conf.application.service.AxisService;
import com.eseict.ssc.conf.application.service.ConfCommandService;
import com.eseict.ssc.conf.application.service.ConfQueryService;
import com.eseict.ssc.conf.application.service.LoginService;
import io.swagger.annotations.ApiOperation;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static com.eseict.ssc.config.ApiConstants.Common.API_PRODUCES;

/**
 * ConfController (refac) — 화상회의 API
 *
 * 기존: /newconf → service/newConf/{ConfService, AxisService, LoginService}
 * 개선:
 *   - /refac/conf 경로 (refac 전용)
 *   - CQRS: ConfQueryService (조회/입장) + ConfCommandService (생성/종료)
 *   - AxisService, LoginService → refac.conf.application.service 패키지
 */
@RestController
@RequestMapping(value = "/conf", produces = API_PRODUCES)
@Slf4j
@RequiredArgsConstructor
public class ConfController {

    private final ConfQueryService confQueryService;
    private final ConfCommandService confCommandService;
    private final AxisService axisService;
    private final LoginService loginService;

    @ApiOperation(value = "경로당 화상회의 생성")
    @PostMapping("/create/{sscMgtNo}")
    public ResponseEntity<OpenConfResult> createConf(
            @PathVariable String sscMgtNo,
            @RequestParam(value = "seqn") String seqn) {
        return ResponseEntity.ok(confCommandService.createConf(sscMgtNo, seqn));
    }

    @ApiOperation("경로당 화상회의 종료")
    @PutMapping("/close")
    public ResponseEntity<BellConfInfo> closeConf(@RequestParam(value = "seqn") String seqn) {
        return ResponseEntity.ok(confCommandService.closeConf(seqn));
    }

    @ApiOperation(value = "회의 정보 불러오기")
    @GetMapping("")
    public ResponseEntity<List<BellConfInfo>> getConfInfo(@RequestParam(value = "seqn") String seqn) {
        return ResponseEntity.ok(confQueryService.getConf(seqn));
    }

    @PostMapping("/axis/mute")
    public ResponseEntity<Boolean> controlMicroPhone(
            @RequestParam boolean isMute,
            @RequestParam String centerId) {
        return ResponseEntity.ok(axisService.controlMicroPhone(isMute, centerId));
    }

    @GetMapping("/sso/login/{userId}")
    public ResponseEntity<Map<String, String>> issueLoginToken(@PathVariable String userId) {
        Map<String, String> resultMap = new HashMap<>();
        resultMap.put("data", loginService.createEncryptedLoginToken(userId));
        return ResponseEntity.ok(resultMap);
    }

    @GetMapping("/hm/pcScheme/{seqn}/{id}")
    public ResponseEntity<String> getHmPcScheme(
            @PathVariable String seqn,
            @PathVariable String id) {
        return ResponseEntity.ok(confQueryService.requestConferenceAutoEnter(seqn, id));
    }
}
