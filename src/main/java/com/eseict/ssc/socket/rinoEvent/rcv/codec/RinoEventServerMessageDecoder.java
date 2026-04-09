package com.eseict.ssc.socket.rinoEvent.rcv.codec;

import com.eseict.common.base.ByteSupport;
import com.eseict.ssc.socket.rinoEvent.message.GeneralMessage;
import com.eseict.ssc.socket.rinoEvent.util.HeaderUtil;
import io.netty.buffer.ByteBuf;
import io.netty.channel.ChannelHandlerContext;
import io.netty.handler.codec.ByteToMessageDecoder;
import lombok.extern.slf4j.Slf4j;

import java.nio.ByteOrder;
import java.nio.charset.StandardCharsets;
import java.util.List;

/**
 * Rino 장비로부터 수신한 ByteBuf → {@link GeneralMessage} 디코더.
 *
 * 프로토콜 구조: [헤더(60B)] + [바디(가변)]
 *   - 헤더 내 BODY_LEN 필드(4B, LittleEndian)를 읽어 바디 크기 결정
 *   - 헤더+바디가 모두 수신되지 않으면 다음 수신 시까지 대기(return)
 */
@Slf4j
public class RinoEventServerMessageDecoder extends ByteToMessageDecoder {

    @Override
    protected void decode(ChannelHandlerContext ctx, ByteBuf in, List<Object> out) {
        try {
            // 헤더가 아직 다 안 왔으면 대기
            if (in.readableBytes() < HeaderUtil.getHeaderTotalLen()) {
                return;
            }

            // 헤더 읽기
            byte[] headerArr = new byte[HeaderUtil.getHeaderTotalLen()];
            in.readBytes(headerArr);

            // 헤더 타입 코드 추출
            int typStart  = HeaderUtil.getHeaderItemStartPos(HeaderUtil.HEDR_TYP_CD);
            int typLen    = HeaderUtil.getHeaderItemLength(HeaderUtil.HEDR_TYP_CD);
            byte[] headerTypCdByte = new byte[typLen];
            System.arraycopy(headerArr, typStart, headerTypCdByte, 0, typLen);
            String headerTypCd = new String(headerTypCdByte, StandardCharsets.UTF_8);

            // 바디 길이 추출 (LittleEndian)
            int bodyStart = HeaderUtil.getHeaderItemStartPos(HeaderUtil.BODY_LEN);
            int bodyLenField = HeaderUtil.getHeaderItemLength(HeaderUtil.BODY_LEN);
            byte[] bodyLenArr = new byte[bodyLenField];
            System.arraycopy(headerArr, bodyStart, bodyLenArr, 0, bodyLenField);
            int bodyLen = ByteSupport.byteArrayToInt(bodyLenArr, ByteOrder.LITTLE_ENDIAN);

            // 바디가 아직 다 안 왔으면 에러 로그 (프로토콜 위반)
            if (in.readableBytes() != bodyLen) {
                log.error("[{}] 바디 크기 불일치: readable={}, expected={}",
                          headerTypCd, in.readableBytes(), bodyLen);
                return;
            }

            // 바디 읽기 → GeneralMessage 조립 → 핸들러로 전달
            byte[] bodyArr = new byte[bodyLen];
            in.readBytes(bodyArr);

            GeneralMessage message = new GeneralMessage();
            message.setHeaderTyp(headerTypCdByte);
            message.setHeader(headerArr);
            message.setBody(bodyArr);
            out.add(message);

        } catch (Exception e) {
            log.error("메시지 디코딩 중 예외 발생", e);
        }
    }
}
