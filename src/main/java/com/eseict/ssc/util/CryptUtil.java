package com.eseict.ssc.util;

import com.eseict.common.net.http.HttpConnection;
import com.eseict.common.net.http.HttpConnectionException;
import com.eseict.common.net.http.responseHandler.JsonToMapHandler;
import com.google.common.base.Strings;
import com.google.common.collect.Maps;
import com.google.gson.Gson;
import com.google.gson.JsonSyntaxException;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.util.Map;

@Component
@RequiredArgsConstructor
public class CryptUtil {
    static final Logger logger = LoggerFactory.getLogger(CryptUtil.class);
    static final JsonToMapHandler handler = new JsonToMapHandler();
    static final HttpConnection<Map<String, Object>> httpConn = new HttpConnection<Map<String, Object>>(handler);
    private final Gson gson;

    @Value("${rino-platform.crypt.api.address}")
    private String CRYPT_ADDRESS;
    @Value("${rino-platform.crypt.decrypt}")
    private String DECRYPT_PATH;
    @Value("${rino-platform.crypt.crypt.type}")
    private String ENC_TYPE;
    @Value("${rino-platform.crypt.system.key}")
    private String CRYPT_KEY;
    @Value("${rino-platform.crypt.system.secret}")
    private String CRYPT_SECRET;

    /**
     * 복호화
     * @param paramMap
     * @param encKey
     * @return
     */
    public Map<String, String> decrypt(Map<String, String> paramMap, String encKey) {
        Map<String, String> cryptResult = null;
        Map<String, Object> REQ_HEADER = getReqHeaderMap();
        try {

            Map<String, Object> reqParam = Maps.newHashMap();
            reqParam.put("data", gson.toJson(paramMap));
            reqParam.put("encType", ENC_TYPE);
            reqParam.put("uid", encKey);

            String url = CRYPT_ADDRESS + DECRYPT_PATH;
            Map<String, Object> cryptResultMap = httpConn.doPost(url, REQ_HEADER, reqParam);

            if(		cryptResultMap.get("responseCode") != null &&
                    Strings.isNullOrEmpty( (String)cryptResultMap.get("responseCode") ) == false &&
                    ( (String)cryptResultMap.get("responseCode") ).equalsIgnoreCase("SUCCESS")
            ) {
                cryptResult = gson.fromJson((String) cryptResultMap.get("data"), Map.class);
            }else {
                cryptResult = Maps.newHashMap();
            }
        } catch (JsonSyntaxException e) {
            logger.error(e.getMessage(), e);
        } catch (HttpConnectionException e) {
            logger.error(e.getMessage(), e);
        }
        return cryptResult;
    }

    /**
     * ese common HttpConnection 헤더 맵
     * @return
     */
    private Map<String, Object> getReqHeaderMap(){
        Map<String, Object> reqHeader = Maps.newHashMap();
        reqHeader.put("systemKey", CRYPT_KEY);
        reqHeader.put("secret", CRYPT_SECRET);
        return reqHeader;
    }
}
