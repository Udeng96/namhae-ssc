package com.eseict.ssc.conf.domain.entity;

import com.eseict.ssc.config.ApiConstants;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

/**
 * conference.site — 면 단위 지역 코드 ↔ 이름 매핑.
 *
 * site_cd: 4884xxx000 (10자리, 끝 3자리 000)
 * site_nm: 면 이름 (남해읍, 이동면, 상주면, 삼동면, 미조면, 남면, 서면, 고현면, 설천면, 창선면)
 * simple_cd: 401 ~ 410 (지역 단축 코드)
 */
@AllArgsConstructor
@NoArgsConstructor
@Data
@Entity
@Table(name = "site", schema = ApiConstants.DbSchema.CONF)
public class Site {

    @Id
    @Column(name = "site_cd")
    private String siteCd;

    @Column(name = "site_nm")
    private String siteNm;

    @Column(name = "simple_cd")
    private String simpleCd;
}
