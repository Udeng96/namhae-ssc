package com.eseict.ssc.scheduler;


import com.eseict.ssc.open.application.service.WeatherService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
@Slf4j
public class WeatherPolling {


    @Autowired
    WeatherService weatherService;

    /**
     * 서버 기동 직후 1회 실행.
     * - @Scheduled(cron) 은 다음 정각까지 대기하므로, 기동 후 최대 ~1시간 동안 날씨 데이터가 비어있을 수 있다.
     * - ApplicationReadyEvent 는 컨텍스트가 완전히 준비된 뒤에 발행되어 DB/외부 API 호출에 안전.
     */
    @EventListener(ApplicationReadyEvent.class)
    public void weatherPollingOnStartup() {
        log.info("====================== WEATHER POLLING (STARTUP) ======================");
        try {
            weatherService.updateWeather();
        } catch (Exception e) {
            // 외부 API 실패가 애플리케이션 기동을 막지 않도록 swallow
            log.error("Startup weather polling failed", e);
        }
        log.info("====================== WEATHER POLLING (STARTUP) DONE ======================");
    }

    @Scheduled(cron = "0 0 */1 * * ?")
    public void weatherPolling(){
        log.info("======================WEATHER POLLING START======================");
        weatherService.updateWeather();
        log.info("======================WEATHER POLLING END  ======================");
    }
}
