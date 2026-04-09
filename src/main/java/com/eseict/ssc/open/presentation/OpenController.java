package com.eseict.ssc.open.presentation;

import com.eseict.ssc.open.application.dto.DustResult;
import com.eseict.ssc.open.application.dto.ReportResult;
import com.eseict.ssc.open.domain.entity.Forecast;
import com.eseict.ssc.open.domain.entity.YtVideo;
import com.eseict.ssc.open.application.service.ReportService;
import com.eseict.ssc.open.application.service.WeatherService;
import com.eseict.ssc.open.application.service.YoutubeService;
import io.swagger.annotations.ApiOperation;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import static com.eseict.ssc.config.ApiConstants.Common.API_PRODUCES;

/**
 * OpenController (refac) — 외부 Open API 데이터 제공
 *
 * 기존: /openapi → service/newOpen/*
 * 개선: /refac/openapi → refac/open/application/service/* (리팩토링된 서비스 참조)
 * 변경: BusService 제거 (더 이상 사용하지 않음)
 */
@RestController
@RequestMapping(value = "/openapi", produces = API_PRODUCES)
@Slf4j
@RequiredArgsConstructor
public class OpenController {

    private final WeatherService weatherService;
    private final ReportService reportService;
    private final YoutubeService youtubeService;

    @ApiOperation(value = "날씨 정보", notes = "정보표출 모니터에서 사용하는 날씨 조회")
    @GetMapping("/forecast")
    public ResponseEntity<Forecast> getForecast() {
        return ResponseEntity.ok(weatherService.getForecast());
    }

    @ApiOperation(value = "미세먼지 정보", notes = "정보표출 모니터에서 사용하는 미세먼지 조회")
    @GetMapping("/dust")
    public ResponseEntity<DustResult> getDust() {
        return ResponseEntity.ok(weatherService.getDustInfoFromApi().get(0));
    }

    @ApiOperation(value = "날씨 수동 업데이트")
    @PostMapping("/forecast")
    public void updateForecast() {
        weatherService.updateWeather();
    }

    @ApiOperation(value = "날씨특보 정보", notes = "정보표출 모니터에서 사용하는 날씨특보 조회")
    @GetMapping("/report")
    public ResponseEntity<ReportResult> getSpecialReportInfo() {
        return ResponseEntity.ok(reportService.getReportInfoFromApi());
    }

    @ApiOperation(value = "유튜브 영상 리스트 조회")
    @GetMapping("/youtube")
    public ResponseEntity<List<YtVideo>> getYoutube() {
        return ResponseEntity.ok(youtubeService.getYTVideos());
    }

    @ApiOperation(value = "유튜브 영상 수동 업데이트")
    @PostMapping("/youtube")
    public void updateYoutube() {
        youtubeService.scheduleYoutube();
    }

    @ApiOperation(value = "유튜브 영상 에러 업데이트")
    @PostMapping("/youtube/err/{videoId}")
    public ResponseEntity<List<YtVideo>> updateYoutubeError(@PathVariable String videoId) {
        return ResponseEntity.ok(youtubeService.updateErrVideo(videoId));
    }
}
