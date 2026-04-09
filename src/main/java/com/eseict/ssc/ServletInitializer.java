package com.eseict.ssc;

import com.eseict.ssc.socket.rinoEvent.rcv.RinoEventSocketServer;
import com.eseict.ssc.socket.rinoEvent.rcv.queue.event.SocketMsgQueuePolling;
import com.eseict.ssc.util.WebApplicationContextUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.web.servlet.support.SpringBootServletInitializer;
import org.springframework.stereotype.Component;
import org.springframework.web.context.WebApplicationContext;
import org.springframework.beans.factory.annotation.Value;

import javax.annotation.PostConstruct;

@Component
@Slf4j
@RequiredArgsConstructor
public class ServletInitializer extends SpringBootServletInitializer {

    @Value("${socket.port}")
    private int socketPort;

    final WebApplicationContext wac;

    @Override
    protected SpringApplicationBuilder configure(SpringApplicationBuilder application) {
        return application.sources(SscApplication.class);
    }

    @PostConstruct
    public void initialization() {
        log.info("===================================================================");
        log.info("application initialization in progress.............................");
        WebApplicationContextUtil.setServletContext(wac.getServletContext());

        SocketMsgQueuePolling msgPolling = new SocketMsgQueuePolling();
        Thread msgPollingThread = new Thread(msgPolling);
        msgPollingThread.start();
        log.info("application initialization END ! ..................................");
        log.info("===================================================================");
    }
}
