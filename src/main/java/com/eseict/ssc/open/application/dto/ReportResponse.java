package com.eseict.ssc.open.application.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class ReportResponse {

    private Response response;

    @Data
    public static class Response {
        private Header header;
        private Body body;
    }

    @Data
    public static class Header {
        private String resultCode;
        private String resultMsg;
    }

    @Data
    public static class Body {
        private String dataType;
        private Items items;
        private Integer pageNo;
        private Integer numOfRows;
        private Integer totalCount;
    }


    @Data
    private static class Items {
        private List<Item> item;
    }

    @Data
    public static class Item {
        private String stnId;
        private String other;
        private String t1;
        private String t2;
        private String t3;
        private String t4;
        private String t5;
        private String t6;
        private String t7;
        private String tmFc;
        private String tmSeq;
        private String warFc;
    }

    public List<Item> getReportItems() {
        return response.getBody().getItems().getItem();
    }
}


