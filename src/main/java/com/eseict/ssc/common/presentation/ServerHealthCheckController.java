package com.eseict.ssc.common.presentation;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * ServerHealthCheckController (refac) — 서버 헬스체크 엔드포인트
 *
 * 기존(controller/ServerHealthCheckController):
 *   - 패키지만 변경, 로직 동일
 *   - URL 동일 유지 (/server/health-check)
 */
@RequestMapping("/server/health-check")
@RestController
public class ServerHealthCheckController {

    @GetMapping
    public boolean healthCheck() {
        return true;
    }
}
