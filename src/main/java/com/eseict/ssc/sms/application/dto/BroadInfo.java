package com.eseict.ssc.sms.application.dto;

import com.eseict.ssc.sms.domain.entity.OmsCommCdInfo;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class BroadInfo {
    private String dsCode = "-";
    private String dsName = "-";
    private String mgtNb = "-";
    private String camDevNum = "-";
    private String classify = "-";
    private String deviceName = "-";
    private String addr1 = "-";
    private String lat = "-";
    private String lon = "-";
    private String stuDtm = "-";
    private String terminalKey = "-";

    public BroadInfo(String MGTNB, String DEVICENAME, String ADDR1, String LAT, String LON, String STUDTM) {
        this.mgtNb = MGTNB;
        this.deviceName = DEVICENAME;
        this.addr1 = ADDR1;
        this.lat = LAT;
        this.lon = LON;
        this.stuDtm = STUDTM;
    }

    public void setValueByAddInfoId(String addInfoId, String addInfoData, List<OmsCommCdInfo> dsCodeIdentifier) {
        if (addInfoId.equals("DS_CD_BC")) {
            this.dsCode = addInfoData;
            for (OmsCommCdInfo omsCommCdInfo : dsCodeIdentifier) {
                if (omsCommCdInfo.getCd().equals(addInfoData)) {
                    this.dsName = omsCommCdInfo.getCdNm();
                }
            }
        }
    }
}
