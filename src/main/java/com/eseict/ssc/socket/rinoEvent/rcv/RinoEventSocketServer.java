package com.eseict.ssc.socket.rinoEvent.rcv;

import com.eseict.ssc.socket.rinoEvent.rcv.codec.RinoEventServerMessageDecoder;
import com.eseict.ssc.socket.rinoEvent.rcv.codec.RinoEventServerMessageEncoder;
import io.netty.bootstrap.ServerBootstrap;
import io.netty.channel.*;
import io.netty.channel.nio.NioEventLoopGroup;
import io.netty.channel.socket.SocketChannel;
import io.netty.channel.socket.nio.NioServerSocketChannel;
import io.netty.util.concurrent.Future;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.annotation.PostConstruct;
import javax.annotation.PreDestroy;


@Slf4j
@RequiredArgsConstructor
@Component
public class RinoEventSocketServer {

    private final RinoEventSocketHandlerFactory rinoEventSocketHandlerFactory;

    private ServerBootstrap serverBootstrap;
    private EventLoopGroup bossGroup;
    private EventLoopGroup workerGroup;

    @Value("${rino.socket.port:22222}")
    private int serverPort;

    @PostConstruct
    public void start() {
        init();
    }

    public void init() {
        bossGroup = new NioEventLoopGroup();
        workerGroup = new NioEventLoopGroup();

        try {
            serverBootstrap = new ServerBootstrap();
            serverBootstrap.group(bossGroup, workerGroup)
                    .channel(NioServerSocketChannel.class)
                    .childHandler(new ChannelInitializer<SocketChannel>() {
                        @Override
                        protected void initChannel(SocketChannel ch) {
                            ChannelPipeline pipeline = ch.pipeline();
                            pipeline
                                    .addLast("decoder", new RinoEventServerMessageDecoder())
                                    .addLast("encoder", new RinoEventServerMessageEncoder())
                                    .addLast("handler", rinoEventSocketHandlerFactory.create());
                        }
                    })
                    .option(ChannelOption.SO_BACKLOG, 128)
                    .childOption(ChannelOption.SO_KEEPALIVE, true);

            ChannelFuture future = serverBootstrap.bind(this.serverPort).sync();
            log.info("[ {} ] RINO EVENT Socket Server Bind", this.serverPort);

        } catch (InterruptedException e) {
            log.error("SOCKET BIND ERROR [{}]", serverPort, e);
            Thread.currentThread().interrupt();
            throw new RuntimeException("Failed to bind to port " + serverPort, e);
        } finally {
            log.info("RinoEventSocketServer init() finished.");
        }
    }

    @PreDestroy
    public void destroy() {
        log.info("RinoEventSocketServer Destroy Start");
        Future<?> wg = workerGroup.shutdownGracefully().syncUninterruptibly();
        Future<?> bg = bossGroup.shutdownGracefully().syncUninterruptibly();

        try {
            wg.await();
            bg.await();
        } catch (Exception e) {
            log.error("Shutdown error", e);
        }
        log.info("RinoEventSocketServer Destroy Finished");
    }
}
