package com.eseict.ssc.scheduler;

import com.eseict.ssc.open.application.service.YoutubeService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
public class YoutubePolling {

    private final Logger logger = LoggerFactory.getLogger(YoutubePolling.class);

    @Autowired
    YoutubeService youtubeService;

    /**
     * 매일 자정(KST) YouTube 영상 갱신.
     *
     * <p>zone 을 명시하지 않으면 서버 timezone 에 의존하게 되어, 서버가 UTC 인 경우
     * 한국 시각 오전 9시에 동작하는 등 의도와 다른 시점에 실행될 수 있다.
     */
    @Scheduled(cron = "0 0 0 * * *", zone = "Asia/Seoul")
    public void youtubeUpdatePolling() {
        logger.info("============================YOUTUBE UPDATE START===================================");
        youtubeService.scheduleYoutube();
        logger.info("============================YOUTUBE UPDATE END=====================================");
    }
}
