package com.eseict.ssc.schedule.presentation;

import com.eseict.ssc.config.ApiConstants;
import com.eseict.ssc.open.application.dto.VmsFileResult;
import com.eseict.ssc.schedule.application.service.FileService;
import com.eseict.ssc.schedule.domain.entity.ScheUploadFileInfo;
import io.swagger.annotations.ApiOperation;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartHttpServletRequest;

import java.util.List;

/**
 * 파일 관리 컨트롤러
 * 기존: /newfile (controller/newSche/FileController) → /newfile 유지 (프론트 호환)
 */
@Slf4j
@RequiredArgsConstructor
@RestController
@RequestMapping(value = "/newfile", produces = ApiConstants.Common.API_PRODUCES)
public class FileController {

    private final FileService fileService;

    @ApiOperation(value = "운영 대시보드에 등록된 모든 스케줄 첨부파일 조회")
    @GetMapping("")
    public ResponseEntity<List<ScheUploadFileInfo>> getAllFileList() {
        return ResponseEntity.ok(fileService.getAllFiles());
    }

    @ApiOperation(value = "컨텐츠 타입별 스케줄 첨부파일 조회")
    @GetMapping("/{type}")
    public ResponseEntity<List<ScheUploadFileInfo>> getFileListByType(
            @PathVariable String type) {
        return ResponseEntity.ok(fileService.getFileInfosByType(type));
    }

    @ApiOperation(value = "운영 대시보드 스케줄 첨부파일 추가")
    @PostMapping("")
    public ResponseEntity<String> uploadFile(
            @RequestParam(value = "fileId",       required = false, defaultValue = "") String fileId,
            @RequestParam(value = "fileNm")       String fileNm,
            @RequestParam(value = "fileType")     String fileType,
            @RequestParam(value = "uploadDtm")    String uploadDtm,
            @RequestParam(value = "fileDuration") String fileDuration,
            @RequestParam(value = "normalYn")     String normalYn,
            @RequestParam(value = "width")        String width,
            @RequestParam(value = "height")       String height,
            MultipartHttpServletRequest multipart) {

        ScheUploadFileInfo fileInfo = ScheUploadFileInfo.builder()
                .fileId(fileId)
                .fileNm(fileNm)
                .fileType(fileType)
                .uploadDtm(uploadDtm)
                .fileDuration(fileDuration)
                .normalYn(normalYn)
                .width(Integer.parseInt(width))
                .height(Integer.parseInt(height))
                .build();

        return ResponseEntity.ok(fileService.saveFileInfo(fileInfo, multipart));
    }

    @ApiOperation(value = "운영 대시보드 스케줄 첨부파일 삭제")
    @DeleteMapping("/{fileId}")
    public ResponseEntity<String> deleteFile(
            @PathVariable String fileId) {
        String result = fileService.deleteFile(fileId) ? "SUCCESS" : "FAILURE";
        return ResponseEntity.ok(result);
    }

    // ── 파일 바이너리 서빙 ────────────────────────────────────────────────────

    @ApiOperation(value = "스케줄 첨부파일 바이너리 서빙 (이미지/영상)")
    @GetMapping("/{fileNm}/{ext}/{contentType}")
    public ResponseEntity<byte[]> serveFile(
            @PathVariable String fileNm,
            @PathVariable String ext,
            @PathVariable String contentType) {
        return fileService.serveFile(fileNm, ext, contentType);
    }

    @ApiOperation(value = "현재 유효한 VMS 파일 목록 조회")
    @GetMapping("/vms")
    public ResponseEntity<VmsFileResult> getVmsFiles() {
        return ResponseEntity.ok(fileService.getVmsFiles());
    }

    @ApiOperation(value = "VMS 파일 바이너리 서빙")
    @GetMapping("/vms/{seqn}")
    public ResponseEntity<byte[]> serveVmsFile(
            @PathVariable String seqn) {
        return fileService.serveVmsFile(seqn);
    }
}
