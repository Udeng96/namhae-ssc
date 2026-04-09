package com.eseict.ssc.user.application.dto;

import com.eseict.ssc.common.dto.KeyValue;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class RoleInfo {

    private List<ZnRoleInfo> areaRoles;
    private List<KeyValue> eventRoles;
}
