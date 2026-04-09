package com.eseict.ssc.schedule.domain.entity;

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
@Table(name = "sche_content_schedule_info", schema = ApiConstants.DbSchema.SCHE)
public class ScheContentScheduleInfo {

    @Id
    @Column(name = "content_id")
    private String contentId;

    @Column(name = "content_title")
    private String contentTitle;

    @Column(name = "start_dtm")
    private String startDtm;

    @Column(name = "end_dtm")
    private String endDtm;

    @Column(name = "repeat_date")
    private String repeatDate;

    @Column(name = "content_area")
    private String contentArea;

    @Column(name = "content_file")
    private String contentFile;

    @Column(name = "content_type")
    private String contentType;

    @Column(name = "content_cntn")
    private String contentCntn;

    @Column(name = "back_image")
    private String backImage;

    @Column(name = "expire_time")
    private String expireTime;

    @Column(name = "color_type")
    private String colorType;

    @Column(name = "start_time")
    private String startTime;

    @Column(name = "end_time")
    private String endTime;

    @Column(name = "content_grp_id")
    private String contentGrpId;

    @Column(name = "outb_dtm")
    private String outbDtm;

    @Column(name = "expire_dtm")
    private String expireDtm;

    @Column(name = "editor_type")
    private String editorType;

}
