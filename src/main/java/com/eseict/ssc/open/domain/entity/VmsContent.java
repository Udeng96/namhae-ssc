package com.eseict.ssc.open.domain.entity;

import com.eseict.ssc.config.ApiConstants;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Entity
@Table(name = "vms_content", schema = ApiConstants.DbSchema.SOCIAL)
public class VmsContent {

    @Id
    @Column(name = "seqn")
    private String seqn;

    @Column(name = "file_nm")
    private String fileNm;

    @Column(name = "start_dtm")
    private String startDtm;

    @Column(name = "end_dtm")
    private String endDtm;

    @Column(name = "use_yn")
    private String useYn;

    @Column(name = "file_type")
    private String fileType;
}
