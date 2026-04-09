package com.eseict.ssc.facility.domain.entity;


import com.eseict.ssc.config.ApiConstants;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;
import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "operating_hist", schema = ApiConstants.DbSchema.SCM)
public class OperatingHist {
    @Id
    @Column(name = "seqn")
    private String seqn;

    @Column(name = "facility_name")
    private String facilityName;

    @Column(name = "facility_operating_rate")
    private String facilityOperatingRate;

    @Column(name = "facility_type")
    private String facilityType;

    @Column(name = "center_name")
    private String centerName;

    @Column(name = "operating_type")
    private String operatingType;

    @Column(name = "calc_time")
    private String calcTime;

    @Column(name = "center_area")
    private String centerArea;

    @Column(name = "calc_date")
    private LocalDate calcDate;

}
