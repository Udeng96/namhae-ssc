package com.eseict.ssc.socket.rinoEvent.message;

import lombok.Getter;
import lombok.Setter;

import java.io.Serializable;

/**
 * Rino 장비 ↔ SSC 간 TCP 소켓 통신에서 사용하는 기본 메시지 VO.
 * headerTyp(2B) + header(60B) + body(가변) 구조.
 */
@Getter
@Setter
public class GeneralMessage implements Serializable {

    private static final long serialVersionUID = 2657355430074131014L;

    private byte[] headerTyp = {};
    private byte[] header   = {};
    private byte[] body     = {};
}
