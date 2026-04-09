package com.eseict.ssc.schedule.application.service;

import com.eseict.ssc.config.ApiConstants;
import com.eseict.ssc.common.util.DateTimeUtil;
import com.eseict.ssc.open.application.dto.VmsFileResult;
import com.eseict.ssc.open.domain.entity.VmsContent;
import com.eseict.ssc.schedule.application.util.FileUtil;
import com.eseict.ssc.schedule.domain.entity.ScheContentScheduleInfo;
import com.eseict.ssc.schedule.domain.entity.ScheUploadFileInfo;
import com.eseict.ssc.repository.sche.FileRepository;
import com.eseict.ssc.repository.sche.ScheRepository;
import com.eseict.ssc.repository.social.VmsRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * 파일 업로드/다운로드/삭제 서비스
 * 기존: service/newSche/FileService → refac 패키지로 이전
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class FileService {

    private final FileRepository fileRepository;
    private final ScheRepository scheRepository;
    private final FileUtil        fileUtil;
    private final VmsRepository   vmsRepository;

    // ── 조회 ─────────────────────────────────────────────────────────────────

    public List<ScheUploadFileInfo> getAllFiles() {
        return fileRepository.findAll().stream()
                .filter(f -> fileUtil.chkRealFileExist(f.getFileNm(), f.getFileType(), "1".equals(f.getNormalYn())))
                .collect(Collectors.toList());
    }

    public List<ScheUploadFileInfo> getFileInfosByType(String type) {
        String normalYn = ApiConstants.CONTENT_TYPE.VIDEO.equals(type) ? "0" : "1";
        return fileRepository.findByNormalYn(normalYn).stream()
                .filter(f -> fileUtil.chkRealFileExist(f.getFileNm(), f.getFileType(), "1".equals(f.getNormalYn())))
                .collect(Collectors.toList());
    }

    // ── 저장 ─────────────────────────────────────────────────────────────────

    public String saveFileInfo(ScheUploadFileInfo fileInfo, MultipartHttpServletRequest multipart) {
        Map<String, MultipartFile> fileMap = multipart.getFileMap();
        Map.Entry<String, MultipartFile> entry = fileMap.entrySet().iterator().next();
        MultipartFile uploadFile = entry.getValue();

        String fileId     = fileUtil.makeId();
        String folderPath = fileUtil.setFileFolder("1".equals(fileInfo.getNormalYn()));
        String fileNm     = setSaveFileNm(uploadFile);
        String filePath   = folderPath + File.separator + fileNm;
        File   saveFile   = new File(filePath);

        String checkResult = chkFile(saveFile, fileInfo);
        if (!"NONE".equals(checkResult)) {
            return checkResult;
        }

        try {
            uploadFile.transferTo(saveFile);
        } catch (IOException e) {
            log.error("파일 저장 실패: {}", e.getMessage());
            throw new RuntimeException(e);
        }

        if (saveFile.exists()) {
            fileInfo.setFileId(fileId);
            fileRepository.save(fileInfo);
        }
        return "SUCCESS";
    }

    // ── 삭제 ─────────────────────────────────────────────────────────────────

    public boolean deleteFile(String fileId) {
        ScheUploadFileInfo target = fileRepository.findById(fileId).orElse(null);
        if (target == null) {
            log.info("삭제할 파일 정보 없음: {}", fileId);
            return false;
        }

        boolean isNorm     = "1".equals(target.getNormalYn());
        String  folderPath = ApiConstants.HOME_PATH + File.separator + "file" + File.separator;
        if (isNorm) folderPath += "notice" + File.separator;

        String filePath = folderPath + target.getFileNm();
        if (!filePath.contains(".")) {
            String ext = target.getFileType().contains("video")
                    ? fileUtil.setVideoFileExt(target.getFileType())
                    : fileUtil.setImageFileExt(target.getFileNm(), target.getFileType());
            filePath = filePath + "." + ext;
        }

        File deleteFile = new File(filePath);
        boolean deleted = !deleteFile.exists() || deleteFile.delete();
        log.info("파일 삭제 결과: {}", deleted);

        if (deleted) {
            fileRepository.deleteById(fileId);
            handleScheduleAfterDelete(fileId, isNorm);
            log.info("파일 삭제 성공: {}", fileId);
        }
        return deleted;
    }

    // ── 파일 바이너리 서빙 ────────────────────────────────────────────────────

    /**
     * contentType 에 따라 적합한 폴더에서 파일을 읽어 바이너리로 반환.
     * - NOTICE_N → {SSC_HOME}/file/notice/{fileNm}.{ext}
     * - VIDEO / 그 외 → {SSC_HOME}/file/{fileNm}.{ext}
     */
    public ResponseEntity<byte[]> serveFile(String fileNm, String ext, String contentType) {
        boolean isNorm = ApiConstants.CONTENT_TYPE.NORMAL.equals(contentType);
        String folder = ApiConstants.HOME_PATH + File.separator + "file"
                + (isNorm ? File.separator + "notice" : "");
        String filePath = folder + File.separator + fileNm;
        if (!fileNm.toLowerCase().endsWith("." + ext.toLowerCase())) {
            filePath = filePath + "." + ext;
        }
        return readFileAsResponse(filePath, resolveMediaType(ext));
    }

    /** 현재 시간 기준으로 유효한 VMS 파일 목록을 이미지/영상으로 분리하여 반환 */
    public VmsFileResult getVmsFiles() {
        String nowDtm = DateTimeUtil.getNowLocalDateTimeFreeFormat(ApiConstants.DATE.FORMAT_14);
        List<VmsContent> active = vmsRepository.findAll().stream()
                .filter(v -> "Y".equals(v.getUseYn()))
                .filter(v -> v.getStartDtm() != null && v.getEndDtm() != null
                        && v.getStartDtm().compareTo(nowDtm) <= 0
                        && v.getEndDtm().compareTo(nowDtm) >= 0)
                .collect(Collectors.toList());
        List<VmsContent> images = active.stream()
                .filter(v -> v.getFileType() != null && v.getFileType().contains("image"))
                .collect(Collectors.toList());
        List<VmsContent> videos = active.stream()
                .filter(v -> v.getFileType() == null || !v.getFileType().contains("image"))
                .collect(Collectors.toList());
        return new VmsFileResult(images, videos);
    }

    /** VMS 파일을 seqn 으로 조회해 {SSC_HOME}/crosswalk/{fileNm} 에서 서빙 */
    public ResponseEntity<byte[]> serveVmsFile(String seqn) {
        Optional<VmsContent> opt = vmsRepository.findById(seqn);
        if (!opt.isPresent()) {
            return ResponseEntity.notFound().build();
        }
        VmsContent vms = opt.get();
        String filePath = ApiConstants.HOME_PATH + File.separator + "crosswalk"
                + File.separator + vms.getFileNm();
        String mediaTypeStr = vms.getFileType() != null ? vms.getFileType() : "application/octet-stream";
        return readFileAsResponse(filePath, MediaType.parseMediaType(mediaTypeStr));
    }

    // ── private helpers ───────────────────────────────────────────────────────

    private void handleScheduleAfterDelete(String fileId, boolean isNorm) {
        if (!isNorm) {
            // 비디오: contentFile에서 해당 fileId 제거
            List<ScheContentScheduleInfo> targets = scheRepository.findByContentType(ApiConstants.CONTENT_TYPE.VIDEO)
                    .stream()
                    .filter(s -> s.getContentFile() != null && s.getContentFile().contains(fileId))
                    .collect(Collectors.toList());
            for (ScheContentScheduleInfo s : targets) {
                String updated = Arrays.stream(s.getContentFile().split(","))
                        .filter(id -> !id.equals(fileId))
                        .collect(Collectors.joining(","));
                scheRepository.updateScheduleFiles(updated, s.getContentId());
            }
        } else {
            // 이미지: backImage의 해당 fileId → "none" 으로 대체
            List<ScheContentScheduleInfo> targets = scheRepository.findByContentType(ApiConstants.CONTENT_TYPE.NORMAL)
                    .stream()
                    .filter(s -> s.getBackImage() != null && s.getBackImage().contains(fileId))
                    .collect(Collectors.toList());
            for (ScheContentScheduleInfo s : targets) {
                String updated = Arrays.stream(s.getBackImage().split(","))
                        .map(id -> id.equals(fileId) ? "none" : id)
                        .collect(Collectors.joining(","));
                scheRepository.updateScheduleFiles(updated, s.getContentId());
            }
        }
    }

    private String setSaveFileNm(MultipartFile file) {
        String originNm   = Objects.requireNonNull(file.getOriginalFilename());
        int    dotIndex   = originNm.lastIndexOf(".");
        String nm         = originNm.substring(0, dotIndex);
        String ext        = originNm.substring(dotIndex).toLowerCase();
        return nm + ext;
    }

    private ResponseEntity<byte[]> readFileAsResponse(String filePath, MediaType mediaType) {
        File file = new File(filePath);
        if (!file.exists()) {
            log.warn("파일 없음: {}", filePath);
            return ResponseEntity.notFound().build();
        }
        try {
            byte[] bytes = Files.readAllBytes(file.toPath());
            return ResponseEntity.ok().contentType(mediaType).body(bytes);
        } catch (IOException e) {
            log.error("파일 서빙 실패: {}", filePath, e);
            return ResponseEntity.status(500).build();
        }
    }

    private static MediaType resolveMediaType(String ext) {
        switch (ext.toLowerCase()) {
            case "mp4":  return MediaType.parseMediaType("video/mp4");
            case "mov":  return MediaType.parseMediaType("video/quicktime");
            case "wmv":  return MediaType.parseMediaType("video/x-ms-wmv");
            case "png":  return MediaType.IMAGE_PNG;
            case "jpeg": return MediaType.IMAGE_JPEG;
            default:     return MediaType.IMAGE_JPEG;  // jpg 포함 기본값
        }
    }

    private String chkFile(File file, ScheUploadFileInfo fileInfo) {
        boolean isNorm      = "1".equals(fileInfo.getNormalYn());
        long    maxBytes    = isNorm ? 1024L * 1024 * 1024 : 200L * 1024 * 1024;
        boolean overSize    = fileUtil.chkFileSize(file, maxBytes);
        boolean wrongType   = !fileUtil.chkFileType(fileInfo.getFileType(), isNorm);
        boolean duplicated  = !fileRepository
                .findAllByFileNmAndFileTypeAndNormalYn(fileInfo.getFileNm(), fileInfo.getFileType(), fileInfo.getNormalYn())
                .isEmpty();

        if (overSize)   return "SIZE";
        if (wrongType)  return "FILE_TYPE";
        if (duplicated) return "DUPLICATED";
        return "NONE";
    }
}
