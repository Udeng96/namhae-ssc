package com.eseict.ssc.open.domain.entity;

import com.eseict.ssc.config.ApiConstants;
import lombok.*;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;
@NoArgsConstructor
@AllArgsConstructor
@Data
@Entity
@ToString
@Table(name = "yt_video", schema = ApiConstants.DbSchema.SOCIAL)
public class YtVideo {
    @Id
    @Column(name = "video_id")
    private String videoId;

    @Column(name = "etag")
    private String etag;

    @Column(name = "publish_dtm")
    private String publishDtm;

    @Column(name = "active_yn")
    private Boolean activeYn;

    @Column(name = "error_yn")
    private Boolean errorYn;


}
