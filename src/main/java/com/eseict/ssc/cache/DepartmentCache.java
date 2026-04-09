package com.eseict.ssc.cache;

import com.eseict.common.cache.CacheException;
import com.eseict.ssc.sms.application.dto.DeptTarget;

import java.util.List;

public interface DepartmentCache {
    List<DeptTarget> getData() throws CacheException;
}
