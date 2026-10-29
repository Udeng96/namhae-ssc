package com.eseict.ssc.open.domain.entity;

import com.eseict.ssc.config.ApiConstants;
import lombok.*;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;
import java.time.LocalDateTime;

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

    /** 단말 신고 투표로 error 가 된 시각. API 로 확인된 error 이거나 정상이면 null */
    @Column(name = "err_vote_dtm")
    private LocalDateTime errVoteDtm;

}
