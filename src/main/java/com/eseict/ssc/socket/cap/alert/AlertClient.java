package com.eseict.ssc.socket.cap.alert;

import io.netty.bootstrap.Bootstrap;
import io.netty.channel.ChannelInitializer;
import io.netty.channel.ChannelOption;
import io.netty.channel.EventLoopGroup;
import io.netty.channel.nio.NioEventLoopGroup;
import io.netty.channel.socket.SocketChannel;
import io.netty.channel.socket.nio.NioSocketChannel;
import lombok.extern.slf4j.Slf4j;

import java.net.InetSocketAddress;

/**
 * CAP 서버에 연결하는 Netty 클라이언트.
 * {@link com.eseict.ssc.socket.cap.CapServerSocketStarter#reStart()} 에서 호출된다.
 */
@Slf4j
public class AlertClient {

    private final String host;
    private final int    port;

    public AlertClient(String host, int port) {
        this.host = host;
        this.port = port;
    }

    /**
     * CAP 서버에 연결한다.
     * EventLoopGroup은 연결 수명 동안 유지되며, 채널 종료 시 정리된다.
     */
    public void start() throws InterruptedException {
        EventLoopGroup group = new NioEventLoopGroup();
        Bootstrap bootstrap  = new Bootstrap();

        bootstrap.group(group)
                 .channel(NioSocketChannel.class)
                 .remoteAddress(new InetSocketAddress(host, port))
                 .handler(new ChannelInitializer<SocketChannel>() {
                     @Override
                     public void initChannel(SocketChannel ch) {
                         ch.pipeline().addLast(new AlertHandler(host, String.valueOf(port)));
                     }
                 })
                 .option(ChannelOption.SO_KEEPALIVE, true);

        bootstrap.connect().sync();
        log.info("CAP 서버 연결 완료: {}:{}", host, port);
    }
}
