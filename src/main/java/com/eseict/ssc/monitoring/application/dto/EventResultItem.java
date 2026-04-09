package com.eseict.ssc.monitoring.application.dto;

import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class EventResultItem {

    private String procSt;                       //상황 발생 종료 코드, 1=발생, 4=종료
    private String statEvetOutbSeqn;            //  이벤트 시퀀스 코드
    private String statEvetId;                  //  이벤트 아이디
    private String unitSvcNm;                   //  이벤트 종류 이름
    private String unitSvcCd;                   //  이벤트 종류 코드
    private String znNm;                    //  지역 이름
    private String znCd;                    //  지역 코드
    private String outbPlac;                 //  경로당 이름
    private String addrShort;                 // 경로당 법정동 주소
    private String posNm;                       // 경로당 도로명 주소
    private String outbDtm;                //  발생 시간
    private String clrDtm;                  //  해제 시간
    private String statEvetNm;             //  이벤트 상황 상태 이름
    private String statEvetCd;             //  이벤트 상황 상태 코드
    private String xcrdnt;                  //  x좌표
    private String ycrdnt;                  //  y좌표
    private String statEvetCntn;                //  이벤트 발생 메세지
    private String confUserId;              //  화상회의 유저ID (비상벨일 경우 해당 경로당의 userID는 셋톱박스ID)
    private String confStatus = String.valueOf(0);

    public EventResultItem(String procSt, String statEvetId, String unitSvcCd, String znCd, String outbPlac, String outbDtm, String statEvetNm, String statEvetCd, String xcrdnt, String ycrdnt, String statEvetCntn, String confUserId) {
        this.procSt = procSt;
        this.statEvetId = statEvetId;
        this.unitSvcCd = unitSvcCd;
        this.znCd = znCd;
        this.outbPlac = outbPlac;
        this.outbDtm = outbDtm;
        this.statEvetNm = statEvetNm;
        this.statEvetCd = statEvetCd;
        this.xcrdnt = xcrdnt;
        this.ycrdnt = ycrdnt;
        this.statEvetCntn = statEvetCntn;
        this.confUserId = confUserId;
    }

    public EventResultItem(String procSt, String statEvetId, String unitSvcCd, String znCd, String outbPlac, String outbDtm, String statEvetNm, String statEvetCd, String xcrdnt, String ycrdnt, String statEvetCntn) {
        this.procSt = procSt;
        this.statEvetId = statEvetId;
        this.unitSvcCd = unitSvcCd;
        this.znCd = znCd;
        this.outbPlac = outbPlac;
        this.outbDtm = outbDtm;
        this.statEvetNm = statEvetNm;
        this.statEvetCd = statEvetCd;
        this.xcrdnt = xcrdnt;
        this.ycrdnt = ycrdnt;
        this.statEvetCntn = statEvetCntn;
    }

    public EventResultItem(String procSt, String statEvetOutbSeqn, String statEvetId, String unitSvcNm, String unitSvcCd, String znNm, String znCd, String outbPlac, String addrShort, String posNm, String outbDtm, String clrDtm, String statEvetNm, String statEvetCd, String xcrdnt, String ycrdnt, String statEvetCntn) {
        this.procSt = procSt;
        this.statEvetOutbSeqn = statEvetOutbSeqn;
        this.statEvetId = statEvetId;
        this.unitSvcNm = unitSvcNm;
        this.unitSvcCd = unitSvcCd;
        this.znNm = znNm;
        this.znCd = znCd;
        this.outbPlac = outbPlac;
        this.addrShort = addrShort;
        this.posNm = posNm;
        this.outbDtm = outbDtm;
        this.clrDtm = clrDtm;
        this.statEvetNm = statEvetNm;
        this.statEvetCd = statEvetCd;
        this.xcrdnt = xcrdnt;
        this.ycrdnt = ycrdnt;
        this.statEvetCntn = statEvetCntn;
    }
}
