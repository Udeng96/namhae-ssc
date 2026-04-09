package com.eseict.ssc.repository.share.common;

import com.eseict.ssc.sms.domain.entity.ShareSendHistory;
import com.eseict.ssc.repository.share.common.ShareHistRepositoryCustom;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ShareHistRepository extends JpaRepository<ShareSendHistory, String>, ShareHistRepositoryCustom {
}
