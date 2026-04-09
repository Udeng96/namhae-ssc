package com.eseict.ssc.util;

import lombok.extern.slf4j.Slf4j;
import org.w3c.dom.Document;
import org.w3c.dom.NodeList;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import java.io.ByteArrayInputStream;
import java.util.function.Function;

@Slf4j
public class XMLParser {

    public static <T> T parseXml(String xmlContent, Function<Document, T> parserFunction) {
        T result = null;
        try {
            DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();
            DocumentBuilder builder = factory.newDocumentBuilder();
            Document document = builder.parse(new ByteArrayInputStream(xmlContent.getBytes()));
            result = parserFunction.apply(document);
        } catch (Exception e) {
            log.error("XML Parsing error. Content: {}", xmlContent, e);
            return null;
        }

        return result;
    }

    /**
     *
     * XML태그 내의 문자를 반환합니다.
     *
     * @name : parseReturnAuthMsg
     * @author : ssiky
     * @since : 2024. 11. 6.
     */
    public static String parseReturnAuthMsg(String xmlContent) {
        if (xmlContent == null || xmlContent.trim().isEmpty()) {
            return "Invalid or empty XML content.";
        }
        return parseXml(xmlContent, document -> {
            // return할 tag의 이름을 적어넣기
            NodeList nodeList = document.getElementsByTagName("returnAuthMsg");
            if (nodeList.getLength() > 0) {
                return nodeList.item(0).getTextContent();
            }
            return "No returnAuthMsg tag found.";
        });
    }
}

