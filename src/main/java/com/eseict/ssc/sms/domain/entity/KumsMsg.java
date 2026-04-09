package com.eseict.ssc.sms.domain.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.time.LocalDateTime;

@AllArgsConstructor
@NoArgsConstructor
@Entity
@Data
@Table(name = "kums_msg")
public class KumsMsg {
    // SMS에서 전송시, 사용하는 heidis
    // ese database에는 존재하지 않음.

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "KUMS_SEQ")
    private Integer kumsSeq;
    @Column(name = "KUMS_TYPE", insertable = false)
    private String kumsType;
    @Column(name = "SMS_TYPE")
    private String smsType;
    @Column(name = "MSG")
    private String msg;
    @Column(name = "MOBILE_NO")
    private String mobileNo;
    @Column(name = "CALLBACK_NO")
    private String callbackNo;
    @Column(name = "INSERT_DATE")
    private LocalDateTime insertDate;

    public KumsMsg(String smsType, String msg, String mobileNo, String callbackNo) {
        this.smsType = smsType;
        this.msg = msg;
        this.mobileNo = mobileNo;
        this.callbackNo = callbackNo;
        this.insertDate = LocalDateTime.now();
    }
}
