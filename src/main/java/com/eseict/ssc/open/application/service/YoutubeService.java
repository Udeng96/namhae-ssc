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
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
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

    private final YoutubeRepository youtubeRepository;

    @Value("${api.youtube.api-key}")
    private String apiKey;
    @Value("${api.youtube.channel}")
    private String channelId;

    // ── 조회 ─────────────────────────────────────────────

    public List<YtVideo> getYTVideos() {
        return youtubeRepository.findTop5ByActiveYnTrueAndErrorYnFalseOrderByPublishDtmDesc();
    }

    // ── 업데이트 ──────────────────────────────────────────

    public void scheduleYoutube() {
        List<YtVideo> videos = searchYTVideos();
        if (!videos.isEmpty()) {
            insertAllYtVideo(videos);
        }
    }

    public List<YtVideo> updateErrVideo(String videoId) {
        log.info("YOUTUBE 150 ERR : {}", videoId);

        List<YtVideo> matched = youtubeRepository.findByVideoId(videoId.trim());
        if (!matched.isEmpty()) {
            log.info("update Err Video:{}", videoId);
            youtubeRepository.updateErrorYn(matched.get(0).getVideoId(), true);
        }

        return youtubeRepository.findTop5ByActiveYnTrueAndErrorYnFalseOrderByPublishDtmDesc();
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
                        false, false))
                .collect(Collectors.toList());
    }

    public List<SearchResult> getYTVideosFromApi(String ytType) {
        try {
            YouTube youTube = new YouTube.Builder(HTTP_TRANSPORT, JSON_FACTORY, req -> {})
                    .setApplicationName("namhae-test")
                    .setYouTubeRequestInitializer(new YouTubeRequestInitializer(apiKey))
                    .build();

            YouTube.Search.List search = youTube.search().list("id,snippet");
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
            log.error("cant get videos from youtube : {}", e.getMessage());
            throw new RuntimeException(e);
        }
    }

    // ── private ──────────────────────────────────────────

    private List<SearchResult> filterByChannel(List<SearchResult> items) {
        return items.stream()
                .filter(item -> channelId.equals(item.getSnippet().getChannelId()))
                .collect(Collectors.toList());
    }

    private void insertAllYtVideo(List<YtVideo> ytVideos) {
        List<YtVideo> newVideos = ytVideos.stream()
                .filter(v -> youtubeRepository.findByVideoId(v.getVideoId()).isEmpty())
                .collect(Collectors.toList());

        if (newVideos.isEmpty()) {
            log.info("all videos already exist");
            return;
        }

        List<YtVideo> saved = youtubeRepository.saveAll(newVideos);
        if (!saved.isEmpty()) {
            updateActiveVideo();
            log.info("insert and update {} videos", saved.size());
        }
    }

    private void updateActiveVideo() {
        List<YtVideo> all     = youtubeRepository.findAll(Sort.by(Sort.Direction.DESC, "publishDtm"));
        List<YtVideo> recent  = all.stream().limit(5).filter(v -> !v.getActiveYn()).collect(Collectors.toList());
        List<YtVideo> others  = all.stream().skip(5).filter(YtVideo::getActiveYn).collect(Collectors.toList());

        recent.forEach(v -> youtubeRepository.updateActiveYn(v.getVideoId(), true));
        others.forEach(v -> youtubeRepository.updateActiveYn(v.getVideoId(), false));
    }
}
