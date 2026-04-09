package com.eseict.ssc.scheduler;


import com.eseict.ssc.open.application.service.WeatherService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
@Slf4j
public class WeatherPolling {


    @Autowired
    WeatherService weatherService;

    @Scheduled(cron = "0 0 */1 * * ?")
    public void weatherPolling(){
        log.info("======================WEATHER POLLING START======================");
        weatherService.updateWeather();
        log.info("======================WEATHER POLLING END  ======================");
    }
}
