package com.eseict.ssc.repository.event;

import com.eseict.ssc.common.dto.KeyValue;

import java.util.List;

public interface EventInfoRepositoryCustom {

    List<KeyValue> getEventTypes();

    List<KeyValue> getFacEventTypes();
}
