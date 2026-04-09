package com.eseict.ssc.socket.rinoEvent.rcv.queue.event;

import com.google.common.collect.Queues;
import edu.umd.cs.findbugs.annotations.SuppressFBWarnings;
import lombok.extern.slf4j.Slf4j;

import java.util.concurrent.LinkedBlockingQueue;
import java.util.concurrent.TimeUnit;

@Slf4j
public class SocketMsgQueue {
    /**
     * 싱글톤 패턴 적용으로 하나의 인스턴스만 존재하도록 보장.
     * SocketMsgQueue.getInstance()를 통해 인스턴스에 접근
     */
    private static final SocketMsgQueue instance = new SocketMsgQueue();
    // 메세지를 저장하는 큐
    private static final LinkedBlockingQueue<String> msgQueue = Queues.newLinkedBlockingQueue();

    private SocketMsgQueue() {
    }

    @SuppressFBWarnings("MS_EXPOSE_REP")
    public static SocketMsgQueue getInstance() {
        return instance;
    }

    /**
     *
     * 큐에 메세지를 추가합니다.
     * offer 메서드를 사용하여, 큐가 가득차면 false를 반환하고 실패 로그를 남깁니다.
     *
     * @name : put
     * @author : ssiky
     * @since : 2024. 12. 17.
     */
    public boolean put(String msg) {
        boolean added = msgQueue.offer(msg);
        if (!added) {
            log.warn("FAILED TO ADD MSG TO QUEUE");
        }
        return added;
    }

    /**
     *
     * 큐에서 메세지를 꺼냅니다.
     * 큐가 비어 있으면 새로운 메세지가 들어올 때까지 대기 합니다.
     *
     * @name : take
     * @author : ssiky
     * @since : 2024. 12. 17.
     */
    public String take() throws InterruptedException {
        return msgQueue.take();
    }

    /**
     *
     * 지정된 시간동안 큐에서 메세지를 가져옵니다.
     * 큐에 메세지가 없으면 지정된 시간동안 기다립니다.
     * 시간내에 메세지가 들어오지 않으면 null을 반환합니다.
     * 
     * 현재 take 메서드를 사용중임으로 사용되지 않습니다.
     *
     * @name : poll
     * @author : ssiky
     * @since : 2024. 12. 17.
     */
    public String poll(long timeout, TimeUnit unit) throws InterruptedException {
        return msgQueue.poll(timeout, unit);
    }

    /**
     *
     * 큐에 있는 모든 메세지를 제거합니다.
     *
     * @name : clear
     * @author : ssiky
     * @since : 2024. 12. 17.
     */
    public void clear() {
        msgQueue.clear();
    }

    /**
     *
     * 큐에 있는 메세지의 개수를 반환합니다.
     *
     * @name : size
     * @author : ssiky
     * @since : 2024. 12. 17.
     */
    public int size() {
        return msgQueue.size();
    }
}
