package com.eseict.ssc.sms.domain.entity;

import com.eseict.ssc.config.ApiConstants;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;

@AllArgsConstructor
@NoArgsConstructor
@Entity
@Data
@Builder
@Table(name = "share_send_history", schema = ApiConstants.DbSchema.SHARE)
public class ShareSendHistory {

    @Id
    @Column(name = "msg_seqn", length = 40)
    private String msgSeqn;
    @Column(name = "msg_type", length = 5)
    private String msgType;
    @Column(name = "msg_title", length = 500)
    private String msgTitle;
    @Column(name = "msg_content", length = 2000)
    private String msgContent;
    @Column(name = "target_list", length = 500)
    private String targetList;
    @Column(name = "send_time", length = 30)
    private String sendTime;
    @Column(name = "device_code", length = 500)
    private String deviceCode;
    @Column(name = "device_name", length = 500)
    private String deviceName;
    @Column(name = "ori_event_seqn", length = 40)
    private String oriEventSeqn;
    @Column(name = "broadcast_id", length = 40)
    private String broadcastId;
    @Column(name = "tts_key",nullable = true)
    private int ttsKey;

    public ShareSendHistory(String msgSeqn, String msgType, String msgTitle, String msgContent, String sendTime, String oriEventSeqn, int ttsKey) {
        this.msgSeqn = msgSeqn;
        this.msgType = msgType;
        this.msgTitle = msgTitle;
        this.msgContent = msgContent;
        this.sendTime = sendTime;
        this.oriEventSeqn = oriEventSeqn;
        this.ttsKey = ttsKey;
    }


}
