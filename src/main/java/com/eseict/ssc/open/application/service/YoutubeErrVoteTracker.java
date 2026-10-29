package com.eseict.ssc.open.application.service;

import java.time.Clock;
import java.time.LocalDate;
import java.util.Collections;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

/**
 * 정보표출모니터의 유튜브 재생 불가 신고를 단말별로 모아 error 처리 여부를 정한다.
 *
 * <p>YouTube API 로는 재생 가능하다고 나오는데 실제 임베드 재생은 안 되는 영상이 있다
 * (2026-10-24 부터 9rYp0kYTA8E, k_ZfwegAdfA 가 거의 모든 단말에서 매 세션 150). 그래서 서로 다른
 * 단말 {@value #VOTE_THRESHOLD}대 이상이 같은 영상을 신고하면 API 결과와 무관하게 error 로 본다.
 * <p>한 단말이 하루에 서로 다른 영상 {@value #TERMINAL_LIMIT}개 이상을 신고하면 그 단말 쪽 문제로
 * 보고(2026-10-19 CS_CHEONP 한 대가 257건 신고) 그 단말의 표를 전부 뺀다. 이미 그 표로 error 가 된
 * 영상이 {@value #VOTE_THRESHOLD}표 미만으로 떨어지면 되살릴 대상으로 돌려준다.
 * <p>표는 메모리에만 두고 날짜(KST)가 바뀌면 비운다. 재기동해도 초기화된다.
 */
class YoutubeErrVoteTracker {

    static final int VOTE_THRESHOLD = 3;
    static final int TERMINAL_LIMIT = 5;

    private final Clock clock;

    private LocalDate day;
    /** 영상 → 신고한 단말 */
    private final Map<String, Set<String>> votersByVideo = new HashMap<>();
    /** 단말 → 신고한 영상 */
    private final Map<String, Set<String>> videosByTerminal = new HashMap<>();
    /** 신고 상한을 넘어 표가 빠진 단말 */
    private final Set<String> excluded = new HashSet<>();
    /** 오늘 표로 error 가 된 영상 */
    private final Set<String> votedErrors = new HashSet<>();

    YoutubeErrVoteTracker(Clock clock) {
        this.clock = clock;
        this.day = LocalDate.now(clock);
    }

    /**
     * 신고 한 건을 반영한다.
     *
     * @return 이번 신고로 error 로 바꿀 영상인지, 표가 빠져 되살릴 영상이 있는지
     */
    synchronized Decision report(String terminalId, String videoId) {
        rollDay();
        if (excluded.contains(terminalId)) {
            return Decision.NONE;
        }

        Set<String> reported = videosByTerminal.computeIfAbsent(terminalId, k -> new HashSet<>());
        reported.add(videoId);
        votersByVideo.computeIfAbsent(videoId, k -> new HashSet<>()).add(terminalId);

        if (reported.size() >= TERMINAL_LIMIT) {
            excluded.add(terminalId);
            Set<String> restore = votedErrors.stream()
                    .filter(id -> validVotes(id) < VOTE_THRESHOLD)
                    .collect(Collectors.toSet());
            votedErrors.removeAll(restore);
            return new Decision(false, restore, true);
        }

        if (!votedErrors.contains(videoId) && validVotes(videoId) >= VOTE_THRESHOLD) {
            votedErrors.add(videoId);
            return new Decision(true, Collections.emptySet(), false);
        }
        return Decision.NONE;
    }

    synchronized int votes(String videoId) {
        rollDay();
        return validVotes(videoId);
    }

    private int validVotes(String videoId) {
        Set<String> voters = votersByVideo.getOrDefault(videoId, Collections.emptySet());
        return (int) voters.stream().filter(t -> !excluded.contains(t)).count();
    }

    private void rollDay() {
        LocalDate today = LocalDate.now(clock);
        if (today.equals(day)) {
            return;
        }
        day = today;
        votersByVideo.clear();
        videosByTerminal.clear();
        excluded.clear();
        votedErrors.clear();
    }

    static final class Decision {
        static final Decision NONE = new Decision(false, Collections.emptySet(), false);

        /** 이번 신고로 표가 기준을 넘어 error 로 바꿀 영상 */
        final boolean error;
        /** 단말 표가 빠져 기준 미만이 된, 오늘 표로 error 가 된 영상 */
        final Set<String> restore;
        /** 이번 신고로 단말이 상한을 넘어 표가 빠졌는지 */
        final boolean terminalExcluded;

        Decision(boolean error, Set<String> restore, boolean terminalExcluded) {
            this.error = error;
            this.restore = restore;
            this.terminalExcluded = terminalExcluded;
        }
    }
}
