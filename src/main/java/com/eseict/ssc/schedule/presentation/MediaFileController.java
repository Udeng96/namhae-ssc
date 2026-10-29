package com.eseict.ssc.schedule.presentation;

import com.eseict.ssc.schedule.application.service.MediaFileService;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.context.request.ServletWebRequest;
import org.springframework.web.server.ResponseStatusException;
import org.apache.commons.io.FilenameUtils;

/** Separate controller: the legacy FileController declares JSON produces. */
@RestController
@RequiredArgsConstructor
@RequestMapping("/newfile/media")
public class MediaFileController {
    private final MediaFileService files;
    @GetMapping("/{fileId}")
    public ResponseEntity<Resource> get(@PathVariable String fileId, @RequestParam String v, ServletWebRequest request) {
        String safeId = FilenameUtils.getName(fileId);
        if (!safeId.equals(fileId) || !safeId.matches("[A-Za-z0-9_-]{1,128}")) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Media not found");
        }
        MediaFileService.Descriptor file = files.describe(safeId);
        if (!file.getVersion().equals(v)) return ResponseEntity.status(HttpStatus.CONFLICT).cacheControl(CacheControl.noStore()).build();
        if (request.checkNotModified(file.getEtag(), file.getModified())) {
            return ResponseEntity.status(HttpStatus.NOT_MODIFIED).header(HttpHeaders.CACHE_CONTROL, "private, max-age=86400").eTag(file.getEtag()).lastModified(file.getModified()).build();
        }
        return ResponseEntity.ok().contentType(file.getType()).contentLength(file.getSizeBytes())
                .header(HttpHeaders.CACHE_CONTROL, "private, max-age=86400")
                .eTag(file.getEtag()).lastModified(file.getModified()).body(file.getResource());
    }
}
