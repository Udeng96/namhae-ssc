package com.eseict.ssc.repository.share.sms;

import com.eseict.ssc.sms.domain.entity.KumsMsg;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SmsRepository extends JpaRepository<KumsMsg, Integer> {
}
