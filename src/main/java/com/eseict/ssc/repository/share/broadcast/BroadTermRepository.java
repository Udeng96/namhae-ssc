package com.eseict.ssc.repository.share.broadcast;

import com.eseict.ssc.sms.domain.entity.ViewTermInfo;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BroadTermRepository extends JpaRepository<ViewTermInfo, String> {

}
