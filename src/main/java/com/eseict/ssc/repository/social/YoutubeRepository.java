package com.eseict.ssc.repository.social;

import com.eseict.ssc.open.domain.entity.YtVideo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface YoutubeRepository extends JpaRepository<YtVideo, String> {

    @Query("select v from YtVideo v where v.videoId = :videoId")
    List<YtVideo> findByVideoId(@Param("videoId") String videoId);

    @Transactional
    @Modifying
    @Query("update YtVideo v set v.errorYn = :errorYn where v.videoId = :videoId")
    int updateErrorYn(@Param("videoId") String videoId, @Param("errorYn") boolean errorYn);

    @Transactional
    @Modifying
    @Query("update YtVideo v set v.activeYn = :activeYn where v.videoId = :videoId")
    int updateActiveYn(@Param("videoId") String videoId, @Param("activeYn") boolean activeYn);

    List<YtVideo> findTop5ByActiveYnTrueAndErrorYnFalseOrderByPublishDtmDesc();

}
