package com.eseict.ssc.config.websocket;


import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.TaskScheduler;
import org.springframework.scheduling.concurrent.ConcurrentTaskScheduler;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;

import java.util.concurrent.Executors;

@Configuration
@EnableWebSocket
@RequiredArgsConstructor
public class WebSocketConfig implements WebSocketConfigurer {

    private final RinoEventWebsocketConfig eventWebsocketHandler;
    private final RinoFacilityWebsocketConfig facilityWebsocketHandler;
    private final SocialWebSocketConfig socialWebSocketConfig;
    private final VideoWebSocketConfig videoWebSocketConfig;
    private final NoticeWebSocketConfig noticeWebSocketConfig;
    private final TVWebsocketConfig tvWebsocketConfig;

    @Override
    public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
        //new social (video, emer, norm 통합)
        registry.addHandler(socialWebSocketConfig, "/rino/social/content").setAllowedOrigins("*");
        // 이벤트 현황탭
        registry.addHandler(eventWebsocketHandler, "/rino/event").setAllowedOrigins("*");
        // 시설물 현황탭
        registry.addHandler(facilityWebsocketHandler, "/rino/facility").setAllowedOrigins("*");
        // 스케쥴링
        registry.addHandler(videoWebSocketConfig, "/rino/social/video").setAllowedOrigins("*");
        registry.addHandler(noticeWebSocketConfig, "/rino/social/notice").setAllowedOrigins("*");
        registry.addHandler(tvWebsocketConfig, "/rino/tv/notice").setAllowedOrigins("*");
    }

    // org.springframework.beans.factory.BeanNotOfRequiredTypeException: Bean named 'defaultSockJsTaskScheduler' is expected to be of type 'org.springframework.scheduling.TaskScheduler' but was actually of type 'org.springframework.beans.factory.support.NullBean'
    // 위의 에러로 인해 추가되었습니다.
    @Bean
    public TaskScheduler taskScheduler() {
        return new ConcurrentTaskScheduler(Executors.newSingleThreadScheduledExecutor());
    }
}
