package com.eseict.ssc.repository.share.broadcast;

import com.eseict.ssc.sms.domain.entity.TtsBrcastEntry;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TtsBrcastEntryRepository extends JpaRepository<TtsBrcastEntry, Long> {
}
