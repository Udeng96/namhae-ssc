package com.eseict.ssc.repository.share.common;

import com.eseict.ssc.user.domain.entity.DepartmentInfo;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DeptRepository extends JpaRepository<DepartmentInfo, String> {
}
