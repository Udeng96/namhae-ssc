package com.eseict.ssc.user.application.dto;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class SysResponse {
    private String result;
    private String message;
    private List<SysInfo> data;
}
