package com.eseict.ssc.scheduler;
import com.eseict.ssc.open.domain.entity.YtVideo;
import com.eseict.ssc.open.application.service.YoutubeService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class YoutubePolling {

    private Logger logger = LoggerFactory.getLogger(YoutubePolling.class);

    @Autowired
    YoutubeService youtubeService;

    @Scheduled(cron = "0 0 0 ? *  * ") // 매일 자정에 수행
    public void youtubeUpdatePolling(){
        logger.info("============================YOUTUBE UPDATE START===================================");
        List<YtVideo> newYtVideos = youtubeService.getYTVideos();
        youtubeService.scheduleYoutube();
        logger.info("============================YOUTUBE UPDATE END=====================================");

    }
}
