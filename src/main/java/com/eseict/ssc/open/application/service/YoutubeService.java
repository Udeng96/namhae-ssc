package com.eseict.ssc.open.application.service;

import com.eseict.ssc.config.ApiConstants;
import com.eseict.ssc.open.domain.entity.YtVideo;
import com.eseict.ssc.repository.social.YoutubeRepository;
import com.eseict.ssc.util.YouTubeDateComparator;
import com.google.api.client.http.HttpTransport;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.JsonFactory;
import com.google.api.client.json.jackson2.JacksonFactory;
import com.google.api.services.youtube.YouTube;
import com.google.api.services.youtube.YouTubeRequestInitializer;
import com.google.api.services.youtube.model.SearchListResponse;
import com.google.api.services.youtube.model.SearchResult;
import com.google.api.services.youtube.model.Video;
import com.google.api.services.youtube.model.VideoListResponse;
import com.google.api.services.youtube.model.VideoStatus;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.text.SimpleDateFormat;
import java.time.Clock;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

/**
 * YoutubeService (refac) — 유튜브 영상 조회 및 관리
 *
 * 기존(service/newOpen/YoutubeService) 개선:
 *   - scheduleYoutube(): insertAllYtVideo null 체크 → isEmpty()로 명확화 (동일)
 *   - updateActiveVideo(): stream().limit().filter() 이중 체인을 변수로 분리해 가독성 향상
 *   - searchYTVideos(): shorts/midiums 병합 후 sort → addAll 순서 명확화
 *   - 패키지 변경 (service.newOpen → refac.open.application.service)
 *   - YoutubeDao 제거: updateErrVideo()의 getVideos()/updateVideoErr() →
 *     YoutubeRepository.findByVideoId() / updateErrorYn() 직접 호출
 */
@Service
@Slf4j
@RequiredArgsConstructor
public class YoutubeService {

    private static final HttpTransport HTTP_TRANSPORT = new NetHttpTransport();
    private static final JsonFactory  JSON_FACTORY    = new JacksonFactory();
    /** videos.list 한 번에 조회할 수 있는 최대 id 수 (YouTube Data API 제한) */
    private static final int VIDEO_STATUS_BATCH = 50;
    /** 단말 신고 투표로 error 가 된 영상을 자동 복구에서 빼 두는 기간 */
    private static final int VOTE_HOLD_DAYS = 7;
    /** 신고 요청 Referer 의 정보표출모니터 경로(/ssc/sc/social/{단말ID}) */
    private static final Pattern SOCIAL_TERMINAL = Pattern.compile("/sc/social/([^/?#]+)");

    private final YoutubeRepository youtubeRepository;
    private final Clock clock = Clock.system(ZoneId.of("Asia/Seoul"));
    private final YoutubeErrVoteTracker voteTracker = new YoutubeErrVoteTracker(clock);

    @Value("${api.youtube.api-key}")
    private String apiKey;
    @Value("${api.youtube.channel}")
    private String channelId;

    /**
     * YouTube SDK 의 base endpoint 우회 설정.
     *
     * <p>운영서버에서 외부 인터넷(www.googleapis.com) 직접 호출이 막혀있는 환경에서
     * DMZ 의 nginx (또는 사내 외부 게이트웨이) 를 통해 우회하기 위해 사용한다.
     * <p>값이 비어있으면 SDK 기본값({@code https://www.googleapis.com/}) 으로 직접 호출 — dev 환경 영향 없음.
     * <p>운영 환경에서는 application-prod.yml 에 DMZ nginx URL 을 지정한다.
     */
    @Value("${api.youtube.root-url:}")
    private String rootUrl;

    // ── 조회 ─────────────────────────────────────────────

    public List<YtVideo> getYTVideos() {
        return youtubeRepository.findTop5ByActiveYnTrueAndErrorYnFalseOrderByPublishDtmDesc();
    }

    // ── 업데이트 ──────────────────────────────────────────

    /**
     * 자정 스케줄러 진입점.
     *
     * <p>신규 영상 수집과 active 5개 보정을 한 번에 수행한다.
     * 예외가 발생해도 스케줄러가 중단되지 않도록 최상위에서 잡고,
     * 신규 영상 유무와 무관하게 active 보정({@link #updateActiveVideo()})을 호출하여
     * 사이에 발생한 error 영상으로 active 자리가 비었을 경우도 정상화한다.
     */
    public void scheduleYoutube() {
        try {
            List<YtVideo> videos = searchYTVideos();
            if (!videos.isEmpty()) {
                insertAllYtVideo(videos);
            }
        } catch (Exception e) {
            log.error("schedule youtube failed", e);
        }
        try {
            recheckExpiredVoteErrors();
        } catch (Exception e) {
            log.error("recheck vote err videos failed", e);
        }
        // 신규 영상 0건이거나 예외가 발생해도 active 5개는 항상 보정
        try {
            updateActiveVideo();
        } catch (Exception e) {
            log.error("updateActiveVideo failed", e);
        }
    }

    /**
     * 정보표출모니터의 재생 불가(101/150) 신고 처리.
     *
     * <p>신고 한 건만 믿고 error 로 바꾸지 않는다. 2026-10-19 08:01~08:09 에 한 단말이 영상마다 150 을
     * 내며 연달아 신고해, 실제로는 임베드 가능한 영상 257건이 error 가 되고 목록이 1건만 남았다.
     * <ul>
     *   <li>YouTube 에서 재생 불가로 확인되면 바로 error 로 바꾼다.</li>
     *   <li>재생 가능하거나 확인에 실패하면 단말 표로 센다. 서로 다른 단말 3대 이상이 신고하면
     *       error 로 바꾸고, {@value #VOTE_HOLD_DAYS}일 동안 자동 복구에서 뺀다.
     *       (API 로는 정상인데 거의 모든 단말에서 150 이 나는 영상이 있다.)</li>
     *   <li>한 단말이 하루에 서로 다른 영상 5개 이상을 신고하면 그 단말의 표는 빼고, 그 표로
     *       error 가 된 영상은 되살린다({@link YoutubeErrVoteTracker}).</li>
     * </ul>
     * 단말은 신고와 별개로 다음 영상으로 넘어가므로 화면이 멈추지 않는다.
     *
     * @param referer 신고 요청의 Referer. 단말을 구분하지 못하면 표로 세지 않는다
     */
    public List<YtVideo> updateErrVideo(String videoId, String referer) {
        String terminalId = terminalOf(referer);
        log.info("YOUTUBE 150 ERR : {} (terminal = {})", videoId, terminalId);

        List<YtVideo> matched = youtubeRepository.findByVideoId(videoId.trim());
        if (matched.isEmpty()) {
            return getYTVideos();
        }

        String id = matched.get(0).getVideoId();
        Map<String, Boolean> playable = getPlayable(Collections.singletonList(id));
        if (playable != null && !playable.get(id)) {
            log.info("update Err Video:{}", id);
            youtubeRepository.updateErrorYn(id, true, null);
            refreshActiveVideo();
            return getYTVideos();
        }

        log.info("YOUTUBE 150 ERR not confirmed by YouTube ({}) : {}",
                playable == null ? "cannot verify" : "embeddable", id);
        if (terminalId == null) {
            return getYTVideos();
        }

        YoutubeErrVoteTracker.Decision decision = voteTracker.report(terminalId, id);
        if (decision.terminalExcluded) {
            log.warn("YOUTUBE 150 ERR votes excluded (terminal reported {}+ videos today) : {}",
                    YoutubeErrVoteTracker.TERMINAL_LIMIT, terminalId);
        }
        if (decision.error) {
            log.info("update Err Video by votes ({} terminals):{}", voteTracker.votes(id), id);
            youtubeRepository.updateErrorYn(id, true, LocalDateTime.now(clock));
        }
        for (String restoreId : decision.restore) {
            log.info("restore Err Video (votes withdrawn):{}", restoreId);
            youtubeRepository.updateErrorYn(restoreId, false, null);
        }
        if (decision.error || !decision.restore.isEmpty()) {
            refreshActiveVideo();
        }
        return getYTVideos();
    }

    /**
     * error 로 비워진 active 자리를 즉시 메워 항상 5개를 유지한다.
     * 이전에는 error_yn 만 켜고 끝나서, 낮에 재생 불가 영상이 발견되면
     * 다음 자정 스케줄러가 돌 때까지 4개(혹은 그 이하)로 표출됐다.
     */
    private void refreshActiveVideo() {
        try {
            updateActiveVideo();
        } catch (Exception e) {
            log.error("updateActiveVideo after err failed", e);
        }
    }

    /** Referer 에서 정보표출모니터 단말 ID 를 꺼낸다. 없으면 null */
    static String terminalOf(String referer) {
        if (referer == null) {
            return null;
        }
        Matcher m = SOCIAL_TERMINAL.matcher(referer);
        return m.find() ? m.group(1) : null;
    }

    // ── YouTube API 호출 ──────────────────────────────────

    public List<YtVideo> searchYTVideos() {
        List<SearchResult> shorts  = filterByChannel(getYTVideosFromApi(ApiConstants.YOUTUBE_VIDEO_DURATION_TYPE.SHORT));
        List<SearchResult> mediums = filterByChannel(getYTVideosFromApi(ApiConstants.YOUTUBE_VIDEO_DURATION_TYPE.MEDIUM));

        List<SearchResult> merged = new ArrayList<>();
        merged.addAll(shorts);
        merged.addAll(mediums);
        merged.sort(new YouTubeDateComparator());

        if (merged.isEmpty()) {
            log.info("there is no videos");
            return new ArrayList<>();
        }

        SimpleDateFormat sdf = new SimpleDateFormat("yyyyMMddHHmmss");
        return merged.stream()
                .map(item -> new YtVideo(
                        item.getId().getVideoId(),
                        item.getEtag(),
                        sdf.format(new Date(item.getSnippet().getPublishedAt().getValue())),
                        false, false, null))
                .collect(Collectors.toList());
    }

    /**
     * YouTube Search API 호출.
     *
     * <p>예외 발생 시 RuntimeException 으로 throw 하면 SHORT 1회 실패만으로
     * MEDIUM 호출까지 막혀 그 날 신규 영상 수집이 전부 실패한다.
     * 부분 실패에도 다른 duration 은 계속 시도하도록 빈 리스트 반환으로 변경.
     */
    public List<SearchResult> getYTVideosFromApi(String ytType) {
        try {
            YouTube.Search.List search = buildYouTube().search().list("id,snippet");
            search.setChannelId(channelId);
            search.setMaxResults(20L);
            search.setType("video");
            search.setVideoEmbeddable("true");
            search.setVideoSyndicated("true");
            search.setVideoDuration(ytType);
            search.setOrder("date");

            SearchListResponse response = search.execute();
            return new ArrayList<>(response.getItems());
        } catch (IOException e) {
            log.error("cant get videos from youtube (type={}): {}", ytType, e.getMessage());
            return Collections.emptyList();
        }
    }

    /**
     * 영상별 재생 가능 여부를 YouTube 에서 조회한다 (videos.list, part=status, 호출당 quota 1).
     *
     * <p>공개(public) · 업로드 완료(processed) · 임베드 허용(embeddable) 이어야 재생 가능으로 본다.
     * 응답에 없는 id(삭제·비공개 전환)는 재생 불가로 본다.
     *
     * @param videoIds 최대 {@value #VIDEO_STATUS_BATCH}개
     * @return id → 재생 가능 여부. 조회에 실패하면 null
     */
    private Map<String, Boolean> getPlayable(List<String> videoIds) {
        try {
            VideoListResponse response = buildYouTube().videos().list("status")
                    .setId(String.join(",", videoIds))
                    .setMaxResults((long) VIDEO_STATUS_BATCH)
                    .execute();

            Map<String, Boolean> playable = new HashMap<>();
            videoIds.forEach(id -> playable.put(id, false));
            List<Video> items = response.getItems() != null ? response.getItems() : Collections.emptyList();
            for (Video video : items) {
                VideoStatus status = video.getStatus();
                playable.put(video.getId(), status != null
                        && Boolean.TRUE.equals(status.getEmbeddable())
                        && "public".equals(status.getPrivacyStatus())
                        && "processed".equals(status.getUploadStatus()));
            }
            return playable;
        } catch (IOException e) {
            log.error("cant get video status from youtube ({} ids): {}", videoIds.size(), e.getMessage());
            return null;
        }
    }

    /**
     * error 영상 중 YouTube 에서 다시 재생 가능해진 영상을 되살린다.
     *
     * <p>임베드 허용은 채널 쪽에서 바뀔 수 있어 error 를 영구 상태로 두지 않는다.
     * 재생 가능 영상이 5건 미만일 때만 호출된다({@link #updateActiveVideo()}).
     * 조회에 실패한 묶음은 건드리지 않는다.
     *
     * @param held true 면 단말 신고 투표로 error 가 된 지 {@value #VOTE_HOLD_DAYS}일이 안 된 영상만,
     *             false 면 그 밖의 error 영상만 확인한다
     * @return 되살린 영상 수
     */
    private int restoreErrVideos(boolean held) {
        LocalDateTime now = LocalDateTime.now(clock);
        List<String> errIds = youtubeRepository.findAll().stream()
                .filter(v -> Boolean.TRUE.equals(v.getErrorYn()))
                .filter(v -> isVoteHeld(v, now) == held)
                .map(YtVideo::getVideoId)
                .collect(Collectors.toList());
        int restored = restorePlayable(errIds);
        log.info("youtube err videos rechecked (held = {}, err = {}, restored = {})", held, errIds.size(), restored);
        return restored;
    }

    /**
     * 단말 신고 투표로 error 가 된 지 {@value #VOTE_HOLD_DAYS}일이 지난 영상을 다시 확인한다.
     *
     * <p>{@link #restoreErrVideos(boolean)} 는 5건 미만일 때만 돌기 때문에, 투표 error 는 자정마다
     * 따로 확인한다. YouTube 에서 재생 가능하면 되살리고, 여전히 단말에서 재생이 안 되면
     * 다시 신고가 모여 error 가 된다.
     */
    private void recheckExpiredVoteErrors() {
        LocalDateTime now = LocalDateTime.now(clock);
        List<String> expiredIds = youtubeRepository.findAll().stream()
                .filter(v -> Boolean.TRUE.equals(v.getErrorYn()))
                .filter(v -> v.getErrVoteDtm() != null && !isVoteHeld(v, now))
                .map(YtVideo::getVideoId)
                .collect(Collectors.toList());
        if (expiredIds.isEmpty()) {
            return;
        }
        int restored = restorePlayable(expiredIds);
        log.info("youtube vote err videos rechecked (expired = {}, restored = {})", expiredIds.size(), restored);
    }

    /** YouTube 에서 재생 가능한 영상만 error 를 푼다. 조회에 실패한 묶음은 건드리지 않는다 */
    private int restorePlayable(List<String> errIds) {
        int restored = 0;
        for (int from = 0; from < errIds.size(); from += VIDEO_STATUS_BATCH) {
            List<String> batch = errIds.subList(from, Math.min(from + VIDEO_STATUS_BATCH, errIds.size()));
            Map<String, Boolean> playable = getPlayable(batch);
            if (playable == null) continue;

            for (String id : batch) {
                if (!playable.get(id)) continue;
                youtubeRepository.updateErrorYn(id, false, null);
                restored++;
            }
        }
        return restored;
    }

    private static boolean isVoteHeld(YtVideo video, LocalDateTime now) {
        return video.getErrVoteDtm() != null
                && video.getErrVoteDtm().isAfter(now.minusDays(VOTE_HOLD_DAYS));
    }

    // ── private ──────────────────────────────────────────

    private YouTube buildYouTube() {
        YouTube.Builder builder = new YouTube.Builder(HTTP_TRANSPORT, JSON_FACTORY, req -> {})
                .setApplicationName("namhae-test")
                .setYouTubeRequestInitializer(new YouTubeRequestInitializer(apiKey));
        // rootUrl 비어있으면 SDK 기본값 사용 (dev 직접 호출).
        // 운영에서는 DMZ nginx URL 로 우회. (반드시 '/' 로 끝나야 SDK 가 path 를 정상 결합)
        if (rootUrl != null && !rootUrl.isEmpty()) {
            builder.setRootUrl(rootUrl.endsWith("/") ? rootUrl : rootUrl + "/");
        }
        return builder.build();
    }

    private List<SearchResult> filterByChannel(List<SearchResult> items) {
        return items.stream()
                .filter(item -> channelId.equals(item.getSnippet().getChannelId()))
                .collect(Collectors.toList());
    }

    /**
     * 신규 영상만 DB 에 insert.
     *
     * <p>active 보정은 호출자(scheduleYoutube)가 신규 유무와 무관하게 별도로
     * {@link #updateActiveVideo()} 를 부르므로 여기서는 insert 만 책임진다.
     */
    private void insertAllYtVideo(List<YtVideo> ytVideos) {
        List<YtVideo> newVideos = ytVideos.stream()
                .filter(v -> youtubeRepository.findByVideoId(v.getVideoId()).isEmpty())
                .collect(Collectors.toList());

        if (newVideos.isEmpty()) {
            log.info("all videos already exist");
            return;
        }

        List<YtVideo> saved = youtubeRepository.saveAll(newVideos);
        log.info("insert {} new videos", saved.size());
    }

    /**
     * 활성 5개 영상 보정 — publish_dtm DESC + error_yn=FALSE 인 영상 중 상위 5개를 active 로.
     *
     * <p>이전 버그: error 영상도 active 후보에 포함되어, error 영상이 상위 5위에 끼면
     * 그 자리를 차지해 정상 영상이 active 되지 못함 → 화면에 5개 미만 표시.
     * <p>개선: error_yn=TRUE 를 후보에서 제외 + active 영상 중 TOP5 가 아닌 것은
     * (error 여부 무관) 모두 비활성화.
     */
    private void updateActiveVideo() {
        // error 제외, publish_dtm DESC TOP 5 선정
        List<YtVideo> validTop5 = findValidTop5();
        // 5건이 안 되면 error 영상 중 다시 재생 가능해진 것이 있는지 YouTube 에서 확인한다
        if (validTop5.size() < 5 && restoreErrVideos(false) > 0) {
            validTop5 = findValidTop5();
        }
        // 그래도 5건이 안 되면 단말 신고 투표로 error 가 된 영상도 기간과 무관하게 되살린다
        if (validTop5.size() < 5 && restoreErrVideos(true) > 0) {
            validTop5 = findValidTop5();
        }

        Set<String> top5Ids = validTop5.stream()
                .map(YtVideo::getVideoId)
                .collect(Collectors.toSet());

        // top5 외 active → 비활성 (에러로 active 자리 차지하던 영상도 여기서 정리)
        youtubeRepository.findAll().stream()
                .filter(v -> Boolean.TRUE.equals(v.getActiveYn()))
                .filter(v -> !top5Ids.contains(v.getVideoId()))
                .forEach(v -> youtubeRepository.updateActiveYn(v.getVideoId(), false));

        // top5 중 비활성 → 활성
        validTop5.stream()
                .filter(v -> !Boolean.TRUE.equals(v.getActiveYn()))
                .forEach(v -> youtubeRepository.updateActiveYn(v.getVideoId(), true));

        log.info("active videos refreshed (top5 size = {})", validTop5.size());
    }

    private List<YtVideo> findValidTop5() {
        return youtubeRepository
                .findAll(Sort.by(Sort.Direction.DESC, "publishDtm"))
                .stream()
                .filter(v -> !Boolean.TRUE.equals(v.getErrorYn()))
                .limit(5)
                .collect(Collectors.toList());
    }
}
