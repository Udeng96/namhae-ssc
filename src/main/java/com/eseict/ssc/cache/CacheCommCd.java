package com.eseict.ssc.cache;

import com.eseict.ssc.sms.domain.entity.OmsCommCdInfo;
import lombok.AllArgsConstructor;
import lombok.Getter;

import java.util.Date;
import java.util.List;

/**
 * CacheHandler 내부 캐시 항목.
 * 생성 시각과 코드 목록을 함께 보관하여 TTL 체크에 사용한다.
 */
@Getter
@AllArgsConstructor
class CacheCommCd {
    private final Date createdDate;
    private final List<OmsCommCdInfo> list;
}
