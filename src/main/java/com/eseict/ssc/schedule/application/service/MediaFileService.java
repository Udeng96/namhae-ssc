package com.eseict.ssc.schedule.application.service;

import com.eseict.ssc.config.ApiConstants;
import com.eseict.ssc.repository.sche.FileRepository;
import com.eseict.ssc.schedule.domain.entity.ScheUploadFileInfo;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.FileSystemResource;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import java.io.IOException;
import java.nio.file.*;
import java.nio.file.attribute.BasicFileAttributes;

/** Reads metadata only; never allocates a byte[] containing a whole video. */
@Service
public class MediaFileService {
    private final FileRepository repository;
    private final Path root;
    public MediaFileService(FileRepository repository, @Value("${ssc.media.root:}") String configuredRoot) {
        this.repository = repository;
        this.root = (configuredRoot.isEmpty() ? Paths.get(ApiConstants.HOME_PATH, "file") : Paths.get(configuredRoot)).toAbsolutePath().normalize();
    }
    public Descriptor describe(String id) {
        ScheUploadFileInfo info = repository.findById(id).orElseThrow(this::notFound);
        return describe(info.getFileId(), info.getFileNm(), info.getFileType());
    }
    public Descriptor describe(String id, String name, String type) {
        if (name == null || type == null || !type.startsWith("video/")) throw notFound();
        try {
            Path path = root.resolve(name).normalize();
            // Legacy uploads retain display-name case but normalize the physical extension.
            int dot = name.lastIndexOf('.');
            if (!Files.isRegularFile(path) && dot > 0) {
                path = root.resolve(name.substring(0, dot) + name.substring(dot).toLowerCase(java.util.Locale.ROOT)).normalize();
            }
            if (!path.startsWith(root) || !Files.isRegularFile(path)) throw notFound();
            path = path.toRealPath();
            if (!path.startsWith(root.toRealPath())) throw notFound();
            BasicFileAttributes attributes = Files.readAttributes(path, BasicFileAttributes.class);
            long length = attributes.size(), modified = attributes.lastModifiedTime().toMillis();
            String version = id + "-" + length + "-" + modified;
            return new Descriptor(new FileSystemResource(path.toFile()), length, modified, version, MediaType.parseMediaType(type));
        } catch (IOException | IllegalArgumentException ex) { throw notFound(); }
    }
    private ResponseStatusException notFound() { return new ResponseStatusException(HttpStatus.NOT_FOUND, "Media not found"); }
    @Getter
    @RequiredArgsConstructor
    public static class Descriptor {
        private final FileSystemResource resource;
        private final long sizeBytes;
        private final long modified;
        private final String version;
        private final MediaType type;
        public String getEtag() { return "W/\"" + version + "\""; }
    }
}
