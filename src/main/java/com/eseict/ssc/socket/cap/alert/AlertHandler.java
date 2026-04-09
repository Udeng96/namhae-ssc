package com.eseict.ssc.socket.cap.alert;

import com.eseict.ssc.socket.cap.CapServerSocketStarter;
import io.netty.buffer.ByteBuf;
import io.netty.channel.ChannelHandlerContext;
import io.netty.channel.SimpleChannelInboundHandler;
import io.netty.util.CharsetUtil;
import lombok.extern.slf4j.Slf4j;

/**
 * CAP 서버와의 TCP 연결을 관리하는 Netty 핸들러.
 *
 * AlertClient 에서 new AlertHandler(host, port) 로 생성되므로
 * Spring Bean 이 아님 → @Value 주입 불가. 생성자로 값을 받는다.
 */
@Slf4j
public class AlertHandler extends SimpleChannelInboundHandler<ByteBuf> {

    private final String capServerKey; // "host:port" 형태의 맵 키

    public AlertHandler(String host, String port) {
        this.capServerKey = host + ":" + port;
    }

    /** 연결 수립 시 채널 컨텍스트를 공유 맵에 등록 */
    @Override
    public void channelActive(ChannelHandlerContext ctx) {
        CapServerSocketStarter.map.put(capServerKey, ctx);
        log.info("CAP 서버 연결됨: {}", capServerKey);
    }

    /** 연결 종료 시 공유 맵에서 제거 */
    @Override
    public void channelInactive(ChannelHandlerContext ctx) {
        CapServerSocketStarter.map.remove(capServerKey);
        log.info("CAP 서버 연결 종료: {}", capServerKey);
    }

    @Override
    protected void channelRead0(ChannelHandlerContext ctx, ByteBuf msg) {
        log.info("CAP 메시지 수신: {}", msg.toString(CharsetUtil.UTF_8));
    }

    @Override
    public void exceptionCaught(ChannelHandlerContext ctx, Throwable cause) {
        log.error("CAP 소켓 예외 발생", cause);
        ctx.close();
    }
}
