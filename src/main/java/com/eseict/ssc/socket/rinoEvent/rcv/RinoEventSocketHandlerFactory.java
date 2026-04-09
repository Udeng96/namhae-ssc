package com.eseict.ssc.socket.rinoEvent.rcv;
import lombok.RequiredArgsConstructor;
import org.springframework.context.ApplicationContext;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class RinoEventSocketHandlerFactory {

    private final ApplicationContext context;

    public RinoEventSocketHandler create(){
        return context.getBean(RinoEventSocketHandler.class);
    }
}
