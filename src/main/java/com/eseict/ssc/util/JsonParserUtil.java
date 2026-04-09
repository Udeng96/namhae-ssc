package com.eseict.ssc.util;

import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.codehaus.commons.nullanalysis.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.transaction.UnexpectedRollbackException;

import java.io.IOException;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

public class JsonParserUtil {

    private static final Logger logger = LoggerFactory.getLogger(JsonParserUtil.class);

    public static <T> List<T> getJsonArray(@NotNull String data, @NotNull String[] jsonColumns, @NotNull Class<T> cls) {
        List<T> list = null;
        try {
            ObjectMapper objectMapper = new ObjectMapper();
            objectMapper.configure(DeserializationFeature.ACCEPT_SINGLE_VALUE_AS_ARRAY, true);
            JsonNode targetNode = getToItemFromJson(objectMapper.readTree(data), jsonColumns);
            list = objectMapper.readValue(targetNode.toPrettyString(), objectMapper.getTypeFactory().constructCollectionType(List.class, cls));
        } catch (IOException e) {
//            logger.error(e.getMessage(), e);
        } catch (NullPointerException e) {
//            logger.error(e.getMessage(), e, data);
        } catch (UnexpectedRollbackException e) {
            logger.error(e.getMessage(), e);
        } catch (IllegalArgumentException e) {
//            logger.error("CONTENT IS NULL!!!");
        }
        return list;
    }


    public static JsonNode getToItemFromJson(JsonNode responseJson, String[] jsonColumns) {
        JsonNode resultJsonObjLev = null;

        for (String category : jsonColumns) {
            if (resultJsonObjLev == null) {
                resultJsonObjLev = findJsonObject(responseJson, category);
            } else {
                resultJsonObjLev = findJsonObject(resultJsonObjLev, category);
            }
        }
        return resultJsonObjLev;
    }


    public static JsonNode findJsonObject(JsonNode responseJson, String category) {
        for (Iterator<Map.Entry<String, JsonNode>> rowLev = responseJson.fields(); rowLev.hasNext(); ) {
            Map.Entry<String, JsonNode> rowLevfield = rowLev.next();
            if (rowLevfield.getKey().equals(category)) {
                return rowLevfield.getValue();
            }
        }
        return null;
    }

}
