package com.eseict.ssc.socket.rinoEvent.rcv.codec;

import io.netty.buffer.ByteBuf;
import io.netty.channel.ChannelHandlerContext;
import io.netty.handler.codec.MessageToByteEncoder;

import java.nio.charset.StandardCharsets;

/**
 * ACK 응답용 String → ByteBuf 인코더.
 *
 * 주의: Netty의 MessageToByteEncoder는 encode() 완료 후 out ByteBuf를
 *       자동으로 채널에 쓰고 release()한다.
 *       encode() 내에서 out.release()나 ctx.flush()를 직접 호출하면 안 된다.
 */
public class RinoEventServerMessageEncoder extends MessageToByteEncoder<String> {

    @Override
    protected void encode(ChannelHandlerContext ctx, String msg, ByteBuf out) {
        out.writeBytes(msg.getBytes(StandardCharsets.UTF_8));
    }
}
