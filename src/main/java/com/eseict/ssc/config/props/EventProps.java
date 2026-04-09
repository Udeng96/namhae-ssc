package com.eseict.ssc.config.props;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Component("eventProps")
@Data
@ConfigurationProperties(prefix = "event")
public class EventProps {

    String ip;
    Conf conf;
    Settop settop;

    @Data
    public static class Conf{
        Url url;
        @Data
        public static class Url{
            String base;
            String open;
            String save;
            String close;
            String bell;
        }
    }

    @Data
    public static class Settop{
        Url url;
        @Data
        public static class Url{
            String base;
            String noti;
        }
    }
}
