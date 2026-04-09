package com.eseict.ssc.monitoring.application.dto;

import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode
@ToString
@Getter
@Setter
public class EventHeatmap {
    private Double lat;
    private Double lng;
    private int count;

    public EventHeatmap(String lat, String lng, Long count){
        this.lat = Double.parseDouble(lat);
        this.lng = Double.parseDouble(lng);
        this.count = Math.toIntExact(count);
    }

    public EventHeatmap(int lat, int lng, Long count){
        this.lat = Double.parseDouble(String.valueOf(lat));
        this.lng = Double.parseDouble(String.valueOf(lng));
        this.count = Math.toIntExact(count);
    }

    public EventHeatmap(Double lat, Double lng, Long count){
        this.lat = lat;
        this.lng = lng;
        this.count = Math.toIntExact(count);
    }
}
