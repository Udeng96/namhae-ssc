package com.eseict.ssc.config.props;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;
import java.util.ArrayList;
import java.util.List;

/** Opt-in per center. Missing configuration always preserves direct playback. */
@Data
@Component
@ConfigurationProperties(prefix = "ssc.media-cache")
public class MediaCacheProperties {
    private boolean enabled = false;
    private List<String> centers = new ArrayList<>();
    private List<String> clientIds = new ArrayList<>();
    private long maxBytes = 256L * 1024 * 1024;
    private long downloadTimeoutMs = 90000;
    private long noProgressTimeoutMs = 15000;

    public Policy forCenter(String center) {
        return forClient(center, null);
    }

    public Policy forClient(String center, String clientId) {
        return new Policy(enabled && centers.contains(center) &&
                (clientIds.isEmpty() || clientIds.contains(clientId)), Math.max(0, maxBytes),
                Math.max(1000, downloadTimeoutMs), Math.max(1000, noProgressTimeoutMs));
    }
    @Data
    @lombok.AllArgsConstructor
    public static class Policy {
        private boolean enabled;
        private long maxBytes;
        private long downloadTimeoutMs;
        private long noProgressTimeoutMs;
    }
}
