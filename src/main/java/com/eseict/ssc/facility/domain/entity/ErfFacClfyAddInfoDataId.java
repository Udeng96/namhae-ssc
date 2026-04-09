package com.eseict.ssc.facility.domain.entity;

import lombok.Data;

import javax.persistence.Column;
import javax.persistence.Embeddable;
import java.io.Serializable;

@Embeddable
@Data
public class ErfFacClfyAddInfoDataId implements Serializable {
    @Column(name = "FAC_ID")
    private String facId;

    @Column(name = "ADD_INFO_ID")
    private String addInfoId;
}
