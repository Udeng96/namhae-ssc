package com.eseict.ssc.repository.conf;

import com.eseict.ssc.conf.domain.entity.ConferenceSession;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface ConfSessionRepository extends JpaRepository<ConferenceSession, String> {

    List<ConferenceSession> findConferenceSessionByCreateDtmBetween(@Param("createDtm") LocalDateTime createDtm, @Param("createDtm2")LocalDateTime createDtm2);
}
