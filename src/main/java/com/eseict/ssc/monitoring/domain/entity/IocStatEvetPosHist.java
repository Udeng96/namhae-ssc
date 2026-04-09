package com.eseict.ssc.monitoring.domain.entity;

import com.eseict.ssc.config.ApiConstants;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;

import javax.persistence.*;

@Getter
@AllArgsConstructor
@NoArgsConstructor
@ToString
@Entity
@IdClass(IocStatEvetPosHistPK.class)
@Table(name = "ioc_stat_evet_pos_hist", schema = ApiConstants.DbSchema.IOC)
public class IocStatEvetPosHist {

    @Id
    @Column(name = "stat_evet_outb_seqn", length = 24, nullable = false)
    private String statEvetOutbSeqn;

    @Id
    @Column(name = "seq", nullable = false)
    private int seq;

    @Column(name = "x_crdnt", length = 20)
    private String xCrdnt;

    @Column(name = "y_crdnt", length = 20)
    private String yCrdnt;

    @Column(name = "z_crdnt", length = 20)
    private String zCrdnt;
}
