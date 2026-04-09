package com.eseict.ssc.schedule.application.util;

import com.eseict.ssc.config.ApiConstants;
import com.google.common.base.Strings;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.io.File;
import java.security.SecureRandom;
import java.util.Base64;

@Slf4j
@Component
public class FileUtil {

    public String makeId() {
        SecureRandom secureRandom = new SecureRandom();
        byte[] randomBytes = new byte[16];
        secureRandom.nextBytes(randomBytes);
        return Base64.getUrlEncoder().withoutPadding().encodeToString(randomBytes);
    }

    public String setVideoFileExt(String fileType) {
        if (Strings.isNullOrEmpty(fileType)) return "";
        switch (fileType) {
            case "video/quicktime":  return "mov";
            case "video/mp4":        return "mp4";
            case "video/x-ms-wmv":   return "wmv";
            default:                 return "flv";
        }
    }

    public String setImageFileExt(String fileNm, String fileType) {
        return fileNm.contains("jpg") ? "jpg" : fileType.split("/")[1];
    }

    public String setFileFolder(boolean isNorm) {
        String folderPath = ApiConstants.HOME_PATH + File.separator + "file";
        if (isNorm) {
            folderPath = folderPath + File.separator + "notice";
        }
        File folder = new File(folderPath);
        while (!folder.exists()) {
            folder.mkdirs();
        }
        return folderPath;
    }

    public boolean chkFileSize(File file, long maxBytes) {
        return file.length() > maxBytes;
    }

    public boolean chkFileType(String fileType, boolean isNorm) {
        return isNorm
                ? ApiConstants.FILE_IMAGE_TYPES.contains(fileType)
                : ApiConstants.FILE_IMAGE_TYPES.contains(fileType) || ApiConstants.FILE_VIDEO_TYPES.contains(fileType);
    }

    public boolean chkRealFileExist(String fileNm, String fileType, boolean isNorm) {
        String folderPath = ApiConstants.HOME_PATH + File.separator + "file";
        if (isNorm) {
            folderPath = folderPath + File.separator + "notice";
        }
        String fileExt = fileType.contains("video") ? setVideoFileExt(fileType) : setImageFileExt(fileNm, fileType);
        String filePath = folderPath + File.separator + fileNm.toLowerCase();
        if (!filePath.contains(fileExt)) {
            filePath = filePath + "." + fileExt;
        }
        File realFile = new File(filePath);
        log.debug("filePath:{}, exists:{}", filePath, realFile.exists());
        return realFile.exists();
    }
}
