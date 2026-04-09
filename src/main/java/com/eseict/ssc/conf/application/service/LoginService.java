package com.eseict.ssc.conf.application.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.codec.binary.Hex;
import org.springframework.stereotype.Service;

import javax.crypto.Cipher;
import javax.crypto.spec.IvParameterSpec;
import javax.crypto.spec.SecretKeySpec;
import java.io.ByteArrayOutputStream;
import java.nio.charset.StandardCharsets;
import java.security.spec.AlgorithmParameterSpec;
import java.util.Random;

/**
 * LoginService (refac) — 화상회의 SSO 로그인 토큰 생성 (AES-128)
 *
 * 기존(service/newConf/LoginService):
 *   - 패키지만 변경 (service.newConf → refac.conf.application.service)
 *   - 로직 동일 유지
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class LoginService {

    /** 사전에 약속된 IV byte array */
    public final byte[] ivBytes = {0x02, 0x02, 0x00, 0x00, 0x01, 0x01, 0x00, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x00, 0x00};

    public String createEncryptedLoginToken(String userId) {
        return encryptLoginPayload(userId);
    }

    private String encryptLoginPayload(String userId) {
        try {
            byte[] bAESKey   = getDynamicAESKey();
            byte[] fakeAESKey = getFakeAESKey();
            String sAESKey   = new String(bAESKey, StandardCharsets.UTF_8);
            String data      = userId + "&" + (System.currentTimeMillis() + 5000 * 10000); // 5초간 유효

            byte[] dataEnc = AESByteEncode(data, sAESKey, ivBytes);

            // 16 byte Key 를 4 byte 씩 특정 위치(0, 5, 11, 18)에 삽입
            System.arraycopy(bAESKey,  0, fakeAESKey,  0, 4);
            System.arraycopy(bAESKey,  4, fakeAESKey,  5, 4);
            System.arraycopy(bAESKey,  8, fakeAESKey, 11, 4);
            System.arraycopy(bAESKey, 12, fakeAESKey, 18, 4);

            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
            outputStream.write(fakeAESKey);
            outputStream.write(dataEnc);

            return Hex.encodeHexString(outputStream.toByteArray());
        } catch (Exception e) {
            log.error(e.getMessage(), e);
            return null;
        }
    }

    /** 임의의 26자리 문자열 — AES 128 Key 헤더부 */
    private byte[] getFakeAESKey() {
        try {
            Random rmd = new Random();
            StringBuilder sb = new StringBuilder();
            for (int i = 0; i < 22; i++) {
                if (rmd.nextBoolean()) {
                    sb.append((char)(rmd.nextInt(26) + 65));
                } else {
                    sb.append(rmd.nextInt(10));
                }
            }
            log.debug("getFakeAESKey : {}", sb.toString().getBytes(StandardCharsets.UTF_8));
            return sb.toString().getBytes(StandardCharsets.UTF_8);
        } catch (Exception e) {
            log.error(e.getMessage());
            return null;
        }
    }

    /** 임의의 16자리 문자열 — AES 128 실제 Key */
    private byte[] getDynamicAESKey() {
        try {
            Random rmd = new Random();
            StringBuilder sb = new StringBuilder();
            for (int i = 0; i < 16; i++) {
                if (rmd.nextBoolean()) {
                    sb.append((char)(rmd.nextInt(26) + 65));
                } else {
                    sb.append(rmd.nextInt(10));
                }
            }
            log.debug("getDynamicAESKey : {}", sb.toString());
            return sb.toString().getBytes(StandardCharsets.UTF_8);
        } catch (Exception e) {
            log.error(e.getMessage());
            return null;
        }
    }

    /** AES-128/CBC/PKCS5Padding 암호화 */
    private byte[] AESByteEncode(String str, String key, byte[] IV) {
        try {
            byte[] textBytes = str.getBytes(StandardCharsets.UTF_8);
            AlgorithmParameterSpec ivSpec = new IvParameterSpec(IV);
            SecretKeySpec newKey = new SecretKeySpec(key.getBytes(StandardCharsets.UTF_8), "AES");
            Cipher cipher = Cipher.getInstance("AES/CBC/PKCS5Padding");
            cipher.init(Cipher.ENCRYPT_MODE, newKey, ivSpec);
            log.debug("AESByteEncode {}", cipher.doFinal(textBytes));
            return cipher.doFinal(textBytes);
        } catch (Exception e) {
            log.error(e.getMessage(), e);
            return null;
        }
    }
}
