package com.eseict.ssc.socket.rinoEvent.rcv;

import com.eseict.ssc.monitoring.application.service.EventSocketService;
import com.eseict.ssc.socket.rinoEvent.message.GeneralMessage;
import com.eseict.ssc.socket.rinoEvent.util.HeaderUtil;
import io.netty.channel.AdaptiveRecvByteBufAllocator;
import io.netty.channel.ChannelHandlerContext;
import io.netty.channel.ChannelInboundHandlerAdapter;
import io.netty.channel.RecvByteBufAllocator;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Component;

import java.nio.charset.StandardCharsets;

import static com.eseict.ssc.config.ApiConstants.MSG_EXCH_PTRN.ONE_WAY;
import static com.eseict.ssc.config.ApiConstants.MSG_EXCH_PTRN.ONE_WAY_ACK;

/**
 * Rino 장비로부터 TCP 메시지를 수신하는 Netty 핸들러.
 * prototype 스코프로 채널마다 독립 인스턴스를 갖는다.
 *
 * 수신 흐름:
 *   1. channelRead() → EventSocketService.handleEventSocket() (비즈니스 처리)
 *   2. MEP(메시지 교환 패턴) 확인 후 ONE_WAY_ACK 이면 ACK 헤더 전송
 */
@Slf4j
@RequiredArgsConstructor
@Scope("prototype")
@Component
public class RinoEventSocketHandler extends ChannelInboundHandlerAdapter {

    private final EventSocketService eventSocketService;

    // ByteBuf 크기를 동적으로 조정하여 replaying decoder replay 횟수 감소
    private static final RecvByteBufAllocator RECV_BUF_ALLOCATOR =
            new AdaptiveRecvByteBufAllocator(1024, 8192, 32768);

    @Override
    public void handlerAdded(ChannelHandlerContext ctx) {
        ctx.channel().config().setRecvByteBufAllocator(RECV_BUF_ALLOCATOR);
    }

    /** 채널 활성화 — 연결된 원격 IP 로깅 */
    @Override
    public void channelActive(ChannelHandlerContext ctx) {
        String localPort = ctx.channel().localAddress().toString().split(":")[1];
        String remoteIp  = ctx.channel().remoteAddress().toString().substring(1).split(":")[0];
        log.info("connected: localPort=[{}] remoteIp=[{}]", localPort, remoteIp);
    }

    /** 채널 비활성화 — 상위 클래스에 위임 */
    @Override
    public void channelInactive(ChannelHandlerContext ctx) throws Exception {
        super.channelInactive(ctx);
    }

    /**
     * 수신 메시지 처리.
     * GeneralMessage 로 디코딩된 메시지를 EventSocketService에 전달하고,
     * MEP 값에 따라 ACK 응답을 전송한다.
     */
    @Override
    public void channelRead(ChannelHandlerContext ctx, Object msg) {
        if (!(msg instanceof GeneralMessage)) {
            log.error("수신 메시지가 GeneralMessage 타입이 아님: {}", msg.getClass().getName());
            return;
        }

        GeneralMessage gm = (GeneralMessage) msg;
        eventSocketService.handleEventSocket(gm);

        try {
            byte[] header = gm.getHeader();
            int startPos  = HeaderUtil.getHeaderItemStartPos(HeaderUtil.MSG_EXCH_PATRN);
            int length    = HeaderUtil.getHeaderItemLength(HeaderUtil.MSG_EXCH_PATRN);

            if (startPos + length > header.length) {
                log.error("헤더 범위 초과: startPos+length={}, header.length={}",
                          startPos + length, header.length);
                return;
            }

            byte[] mepByte = new byte[length];
            System.arraycopy(header, startPos, mepByte, 0, length);
            String mep = new String(mepByte, StandardCharsets.UTF_8).trim();
            log.info("mep=[{}]", mep);

            if (ONE_WAY.equals(mep)) {
                log.info("ONE_WAY 처리");
            } else if (ONE_WAY_ACK.equals(mep)) {
                GeneralMessage ackGm = new GeneralMessage();
                ackGm.setHeader(HeaderUtil.makeAckHeader(header, "", "3"));
                ctx.writeAndFlush(ackGm);
                log.info("ACK 전송 완료: [{}]", new String(ackGm.getHeader(), StandardCharsets.UTF_8));
            } else {
                log.warn("알 수 없는 MEP 값: '{}'", mep);
            }

        } catch (Exception e) {
            log.error("메시지 처리 중 예외 발생", e);
        }
    }

    @Override
    public void exceptionCaught(ChannelHandlerContext ctx, Throwable cause) {
        log.error("소켓 예외 발생", cause);
        ctx.close();
    }
}
