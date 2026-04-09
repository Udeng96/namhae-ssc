package com.eseict.ssc.stat.application.dto;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class KeyCountItem {
    private String key;
    private int count;

    public KeyCountItem(String key, long count){
        this.key = key;
        this.count = (int)count;
    }
}
