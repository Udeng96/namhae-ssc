package com.eseict.ssc.conf.domain.entity;

import com.eseict.ssc.config.ApiConstants;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;
import java.time.LocalDateTime;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Entity
@Table(name = "conference_session", schema = ApiConstants.DbSchema.MCS)
public class ConferenceSession {

    @Id
    @Column(name = "session_seq")
    private String sessionSeq;

    @Column(name = "session_id")
    private String sessionId;

    @Column(name = "create_dtm")
    private LocalDateTime createDtm;

    @Column(name = "end_dtm")
    private LocalDateTime endDtm;

    @Column(name = "session_subject")
    private String sessionSubject;

    @Column(name = "customer_id")
    private String customerId;

    @Column(name = "user_id")
    private String userId;

    @Column(name = "pc_scheme")
    private String pcScheme;

    @Column(name = "mobile_scheme")
    private String mobileScheme;

    @Column(name = "status")
    private String status;

    @Column(name = "duration")
    private String duration;

    @Column(name = "remove_yn")
    private String removeYn;
}
