package com.eseict.ssc.facility.domain.entity;

import lombok.Data;

import javax.persistence.*;
import java.io.Serializable;

import static com.eseict.ssc.config.ApiConstants.DbSchema.FMS;

@Entity
@Data
@Table(name = "erf_fac_clfy_add_info_data", schema = FMS)
public class ErfFacClfyAddInfoData implements Serializable {

    @EmbeddedId
    private ErfFacClfyAddInfoDataId id;

    @Column(name = "ADD_INFO_DATA", length = 500)
    private String addInfoData;
}
