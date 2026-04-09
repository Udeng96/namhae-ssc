package com.eseict.ssc.common.dto;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class SocketData {

    StatEvet statEvet;

    @Data
    public class StatEvet{
        private String uSvcOutbId;
        private String statEvetId;
        private String statEvetNm;
        private String statEvetGdCd;
        private String procSt;
        private String statEvetCntn;
        private String statEvetOutbDtm;
        private Integer outbPosCnt;
        private List<OutbPos> outbPos;
        private String outbPosNm;
        private Integer statEvetItemCnt;
        private List<StatEvetItem> statEvetItem;
        private String statEvetActnCntn;
        private String statEvetActnMn;
        private String statEvetActnDtm;
        private String statEvetActnRslt;
        private String statEvetClrDtm;
        private String outbScopRads;
        private Integer cpxRelEvetOutbSeqnCnt = 0;
        private List<String> cpxRelEvetOutbSeqn = new ArrayList<>();
        private String outbMainGb = "P";

    }

    @Data
    public class OutbPos{
        private String x;
        private String y;
        private String z;
    }

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public class StatEvetItem{
        private String key;
        private String value;
    }

}


