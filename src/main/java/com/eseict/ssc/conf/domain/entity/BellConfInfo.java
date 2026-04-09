package com.eseict.ssc.conf.domain.entity;

import com.eseict.ssc.config.ApiConstants;
import lombok.*;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
@Entity
@Table(name = "bell_conf_info", schema = ApiConstants.DbSchema.CONF)
public class BellConfInfo {

    @Id
    @Column(name = "seqn", length = 24, nullable = false)
    private String seqn;

    @Column(name = "pos_nm", length = 24, nullable = false)
    private String posNm;

    @Column(name = "pos_id", length = 24, nullable = false)
    private String posId;

    @Column(name = "user_id", length = 24, nullable = false)
    private String userId;

    @Column(name = "outb_dtm", length = 24, nullable = false)
    private String outbDtm;

    @Column(name = "clr_dtm", length = 24, nullable = false)
    private String clrDtm;

    @Column(name = "conf_status")
    private int confStatus;

    @Column(name = "pc_scheme", length = 24, nullable = false)
    private String pcScheme;

    @Column(name = "mobile_scheme", length = 24, nullable = false)
    private String mobileScheme;

    @Column(name = "stat_evet_outb_seqn", length = 24, nullable = false)
    private String statEvetOutbSeqn;

    @Column(name = "ext_id", length = 20, nullable = false)
    private String extId;
}
