package com.eseict.ssc.open.application.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class AddrResponse {
    String id;
    String title;
    String category;
    Address address;
    Point point;

     @Data
     public static class Address {
         String road;
         String parcel;
     }

     @Data
     public static class Point {
         String x;
         String y;
     }
}
