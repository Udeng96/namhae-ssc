package com.eseict.ssc.repository.conf;

import com.eseict.ssc.conf.domain.entity.ConferenceSnrCenter;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ConfRepository extends JpaRepository<ConferenceSnrCenter, String> {

    List<ConferenceSnrCenter> findConferenceSeniorCenterByConferenceStatus(String status);
}
