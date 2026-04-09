package com.eseict.ssc.sms.domain.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Entity
@Table(name = "viewterminfo", schema = "ipbroadcast")
public class ViewTermInfo {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="terminal_key")
    Integer terminalKey; // 방송단말 고유 키
    @Column(name="termid")
    String termId; // 방송단말 문자열 식별 코드
    @Column(name="term_name")
    String termName; // 방송단말 이름
    @Column(name="cam_dev_num")
    Integer camDevNum; // 카메라 식별 번호 코드
    @Column(name="cam_dev_str")
    String camDevStr; // 카메라 문자열 식별 코드
    @Column(name="cam_video_num")
    Integer camVideoNum; // 카메라 비상벨 영상 번호
    @Column(name="pos_x")
    Double posX; // 경도
    @Column(name="pos_y")
    Double posY; //  위도
    @Column(name="term_location")
    String termLocation;
    @Column(name="status")
    Integer status; // 방송 단말 상태 (0 = 오프라인, 1 = 온라인, 2 = 방송중)


}
