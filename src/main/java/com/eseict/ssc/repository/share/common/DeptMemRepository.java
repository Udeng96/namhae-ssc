package com.eseict.ssc.repository.share.common;

import com.eseict.ssc.user.domain.entity.DepartmentMemberInfo;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DeptMemRepository extends JpaRepository<DepartmentMemberInfo, String> {
    List<DepartmentMemberInfo> findByDepartmentCd(String departmentCd);
}
