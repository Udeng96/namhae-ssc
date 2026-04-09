package com.eseict.ssc.sms.domain.entity;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Entity
@Table(name = "ttsbrcastinfo")
public class TtsBrcastInfo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="tts_key")
    Long ttsKey;// TTS방송 요청키 (자동생성)
    @Column(name="status")
    Integer status;// 방송 요청 상태
    @Column(name="order_time")
    String orderTime;// 방송 요청 시간
    @Column(name="order_user")
    String orderUser;// 방송 요청자 id
    @Column(name="order_client")
    String orderClient;// 방송 처리 클라이언트ID
    @Column(name="text")
    String text;// 방송 내용
    @Column(name="upchime")
    Integer upChime;// 방송 시작차임 옵션
    @Column(name="downchime")
    Integer downChime;// 방송 종료차임 옵션
    @Column(name="volume")
    Integer volume;// TTS 출력 볼륨
    @Column(name="speed")
    Integer speed;// TTS 재생 속도
    @Column(name="tts_dbtype")
    Integer ttsDbType;// 방송 목소리 설정
    @Column(name="brcast_day")
    String brcastDay;// 방송 송출 일자
    @Column(name="brcast_time")
    String brcastTime;// 방송 송출 시간
    @Column(name="result")
    String result;// TTS 변환 실패 내용
    @Column(name="retry")
    Integer retry;
    @Column(name="brcast_type")
    Integer brcastType;// 방송 송출 타입
    @Column(name="tts_repeat")
    Integer ttsRepeat;
    @Column(name="request_key")
    Integer requestKey;// 방송요청 키
}
