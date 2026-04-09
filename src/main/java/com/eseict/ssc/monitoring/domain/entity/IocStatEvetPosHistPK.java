package com.eseict.ssc.monitoring.domain.entity;

import lombok.Data;

import java.io.Serializable;

@Data
public class IocStatEvetPosHistPK implements Serializable {
    private String statEvetOutbSeqn;
    private int seq;
}
