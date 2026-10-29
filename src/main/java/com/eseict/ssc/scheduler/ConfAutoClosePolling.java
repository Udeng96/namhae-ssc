package com.eseict.ssc.scheduler;

import com.eseict.ssc.conf.application.service.ConfCommandService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
@Slf4j
public class ConfAutoClosePolling {

    @Autowired
    private ConfCommandService confCommandService;

    @Value("${event.conf.autoCloseAfterHours}")
    private int autoCloseAfterHours;

    @Scheduled(cron = "0 */10 * * * ?")
    public void autoCloseStaleConf() {
        log.info("====================== 화상회의 자동 종료 START ======================");
        confCommandService.closeStaleConfs(autoCloseAfterHours);
        log.info("====================== 화상회의 자동 종료 END ======================");
    }
}
