package com.eseict.ssc.monitoring.domain.entity;

import lombok.Data;

import java.io.Serializable;

@Data
public class IocStatEvetInfoPK implements Serializable {

    private String znCd;                                                //  지역 코드
    private String unitSvcCd;                                           //  시설물 코드 (화재센서, 가스센서, 비상벨, CCTV, 셋톱박스)
    private String svcThemeCd;                                          //  이벤트 테마 코드(노인정, 경찰, 소방 등)
    private String statEvetCd;                                          //  이벤트 발생 상태 코드
    private String evetGbCd;                                            //
}
