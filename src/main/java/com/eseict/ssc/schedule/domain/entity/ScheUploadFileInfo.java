package com.eseict.ssc.schedule.domain.entity;

import com.eseict.ssc.config.ApiConstants;
import lombok.AllArgsConstructor;
import lombok.Builder;
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
@Builder
@Table(name = "sche_upload_file_info", schema = ApiConstants.DbSchema.SCHE)
public class ScheUploadFileInfo {


    @Id
    @Column(name = "file_id")
    private String fileId;

    @Column(name = "file_nm")
    private String fileNm;

    @Column(name = "file_type")
    private String fileType;

    @Column(name = "upload_dtm")
    private String uploadDtm;

    @Column(name = "file_duration")
    private String fileDuration;

    @Column(name = "normal_yn")
    private String normalYn;

    @Column(name = "width")
    private Integer width;

    @Column(name = "height")
    private Integer height;
}
