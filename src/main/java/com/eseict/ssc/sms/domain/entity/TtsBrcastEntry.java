package com.eseict.ssc.sms.domain.entity;


import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

import javax.persistence.*;

@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "ttsbrcastentry")
public class TtsBrcastEntry {
    @Id
    @Column(name="tts_key")
    Long ttsKey;    // TTS방송 요청키
    @Column(name="terminal_key")
    Long terminalKey;    // TTS방송 요청 단말 키
    @Column(name="outside_call_number")
    Long outsideCallNumber;    // TTS방송 요청 카메라 식별 번호 코드

}
