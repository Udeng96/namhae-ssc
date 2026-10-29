package com.eseict.ssc.repository.social;

import com.eseict.ssc.open.domain.entity.YtVideo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

public interface YoutubeRepository extends JpaRepository<YtVideo, String> {

    @Query("select v from YtVideo v where v.videoId = :videoId")
    List<YtVideo> findByVideoId(@Param("videoId") String videoId);

    /**
     * 벌크 UPDATE 라 영속성 컨텍스트를 우회한다.
     * updateErrVideo() 가 이 호출 직후 updateActiveVideo() 에서 findAll() 로 다시 읽으므로,
     * OSIV 로 열려있는 1차 캐시가 갱신 전 errorYn 을 돌려주지 않도록 flush/clear 한다.
     *
     * @param errVoteDtm 단말 신고 투표로 error 가 된 시각. 그 밖의 경우 null
     */
    @Transactional
    @Modifying(flushAutomatically = true, clearAutomatically = true)
    @Query("update YtVideo v set v.errorYn = :errorYn, v.errVoteDtm = :errVoteDtm where v.videoId = :videoId")
    int updateErrorYn(@Param("videoId") String videoId, @Param("errorYn") boolean errorYn,
                      @Param("errVoteDtm") LocalDateTime errVoteDtm);

    @Transactional
    @Modifying
    @Query("update YtVideo v set v.activeYn = :activeYn where v.videoId = :videoId")
    int updateActiveYn(@Param("videoId") String videoId, @Param("activeYn") boolean activeYn);

    List<YtVideo> findTop5ByActiveYnTrueAndErrorYnFalseOrderByPublishDtmDesc();

}
