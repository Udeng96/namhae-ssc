package com.eseict.ssc.repository.conf;

import com.eseict.ssc.conf.domain.entity.ConferenceParticipateStat;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface ConfStatusRepository extends JpaRepository<ConferenceParticipateStat, String> {
    List<ConferenceParticipateStat> findByCreatedTimeIsBetween(LocalDateTime createdTime, LocalDateTime createdTime2);

}
