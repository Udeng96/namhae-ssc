package com.eseict.ssc.schedule.presentation;

import com.eseict.ssc.config.props.MediaCacheProperties;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

/** Optional per-browser rollout marker; not an authentication credential. */
@RestController
@RequiredArgsConstructor
@RequestMapping("/newfile/media-cache/client")
public class MediaCacheClientController {
    private final MediaCacheProperties properties;

    @GetMapping("/{clientId}/{center}")
    public void enroll(@PathVariable String clientId, @PathVariable String center,
                       HttpServletRequest request, HttpServletResponse response) throws IOException {
        if (!clientId.matches("[A-Za-z0-9_-]{1,80}") || !center.matches("[A-Za-z0-9_-]{1,80}") ||
                !properties.getClientIds().contains(clientId) ||
                !properties.forClient(center, clientId).isEnabled()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND);
        }
        Cookie marker = new Cookie("ssc-media-cache-client", clientId);
        marker.setHttpOnly(true);
        marker.setSecure(request.isSecure());
        marker.setPath(request.getContextPath().isEmpty() ? "/" : request.getContextPath());
        marker.setMaxAge(86400);
        response.addCookie(marker);
        response.setHeader("Cache-Control", "no-store");
        response.sendRedirect(request.getContextPath() + "/sc/social/" + center);
    }
}
