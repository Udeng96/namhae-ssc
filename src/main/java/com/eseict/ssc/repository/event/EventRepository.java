package com.eseict.ssc.repository.event;

import com.eseict.ssc.monitoring.domain.entity.IocStatEvetOutbHist;
import com.eseict.ssc.repository.event.EventRepositoryCustom;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import javax.transaction.Transactional;
import java.util.List;


@Repository
public interface EventRepository extends JpaRepository<IocStatEvetOutbHist, String>, EventRepositoryCustom {

    List<IocStatEvetOutbHist> findByuSvcOutbId(String uSvcOutbId);

    @Query("SELECT e From IocStatEvetOutbHist  e where e.outbPlac=:outbPlac and e.svcThemeCd='SSC' and e.unitSvcCd='002' and e.znCd = :znCd and e.statEvetCd = :statEvetCd order by e.outbDtm desc")
    List<IocStatEvetOutbHist> findStatusEvent(@Param("outbPlac")String outbPlac, @Param("znCd")String znCd, @Param("statEvetCd")String statEvetCd);

    @Transactional
    @Modifying
    @Query("update IocStatEvetOutbHist  e set e.statEvetGdCd = :statEvetGdCd where e.statEvetOutbSeqn = :seqn")
    int updateStatusEventGdCd(@Param("statEvetGdCd")String statEvetGdCd, @Param("seqn")String seqn);

    @Transactional
    @Modifying
    @Query("UPDATE IocStatEvetOutbHist e SET e.procSt = '4' WHERE e.statEvetOutbSeqn = :seqn")
    int updateProcStNameBySeqn(@Param("seqn") String seqn);

    // ── 이벤트 통계용 쿼리 (gs 방식) ────────────────────────────

    @Query(
            "SELECT e.znCd, COUNT(e) " +
                    "FROM IocStatEvetOutbHist e " +
                    "WHERE e.outbDtm BETWEEN :start AND :end " +
                    "AND e.svcThemeCd = 'SSC' " +
                    "AND e.unitSvcCd = '001' " +
                    "AND e.znCd <> '503' " +
                    "AND e.outbPlac IS NOT NULL " +
                    "AND e.outbPlac <> '' " +
                    "AND e.statEvetCd NOT IN ('04','05') " +
                    "AND e.statEvetCd IN ('01','02') " +
                    "GROUP BY e.znCd"
    )
    List<Object[]> countGroupByZnCd(@Param("start") String start, @Param("end") String end);

    @Query(value =
            "SELECT e.outb_plac, f.fac_nm, COUNT(*) " +
                    "FROM ioc.ioc_stat_evet_outb_hist e " +
                    "JOIN fms.erf_fac_info f ON f.mgt_no = e.outb_plac " +
                    "WHERE e.outb_dtm BETWEEN :start AND :end " +
                    "AND e.svc_theme_cd = 'SSC' " +
                    "AND e.unit_svc_cd = '001' " +
                    "AND e.zn_cd <> '503' " +
                    "AND e.zn_cd = :znCd " +
                    "AND e.outb_plac IS NOT NULL " +
                    "AND e.outb_plac <> '' " +
                    "AND e.stat_evet_cd NOT IN ('04','05') " +
                    "AND e.stat_evet_cd IN ('01','02') " +
                    "GROUP BY e.outb_plac, f.fac_nm " +
                    "ORDER BY COUNT(*) DESC",
            nativeQuery = true
    )
    List<Object[]> countByOutbPlacSub(@Param("start") String start, @Param("end") String end, @Param("znCd") String znCd);

    @Query(value =
            "SELECT SUBSTRING(e.outb_dtm, 1, 8) AS day_key, " +
                    "       e.stat_evet_cd, " +
                    "       COUNT(*) " +
                    "FROM ioc.ioc_stat_evet_outb_hist e " +
                    "WHERE e.outb_dtm BETWEEN :start AND :end " +
                    "AND e.svc_theme_cd = 'SSC' " +
                    "AND e.unit_svc_cd = '001' " +
                    "AND e.zn_cd <> '503' " +
                    "AND e.outb_plac IS NOT NULL " +
                    "AND e.outb_plac <> '' " +
                    "AND e.stat_evet_cd NOT IN ('04','05') " +
                    "AND e.stat_evet_cd IN ('01','02') " +
                    "GROUP BY SUBSTRING(e.outb_dtm, 1, 8), e.stat_evet_cd " +
                    "ORDER BY day_key",
            nativeQuery = true
    )
    List<Object[]> countByDayAndStat(@Param("start") String start, @Param("end") String end);

    @Query(value =
            "SELECT SUBSTRING(e.outb_dtm, 1, 8) AS day_key, " +
                    "       e.stat_evet_cd, " +
                    "       COUNT(*) " +
                    "FROM ioc.ioc_stat_evet_outb_hist e " +
                    "WHERE e.outb_dtm BETWEEN :start AND :end " +
                    "AND e.svc_theme_cd = 'SSC' " +
                    "AND e.unit_svc_cd = '001' " +
                    "AND e.zn_cd <> '503' " +
                    "AND e.outb_plac IS NOT NULL " +
                    "AND e.outb_plac <> '' " +
                    "AND e.zn_cd = :znCd " +
                    "AND e.stat_evet_cd NOT IN ('04','05') " +
                    "AND e.stat_evet_cd IN ('01','02') " +
                    "GROUP BY SUBSTRING(e.outb_dtm, 1, 8), e.stat_evet_cd " +
                    "ORDER BY day_key",
            nativeQuery = true
    )
    List<Object[]> countByDayAndStatSub(@Param("start") String start, @Param("end") String end, @Param("znCd") String znCd);

    @Query(
            "SELECT e.znCd, COUNT(e) " +
                    "FROM IocStatEvetOutbHist e " +
                    "WHERE e.outbDtm BETWEEN :start AND :end " +
                    "AND e.svcThemeCd = 'SSC' " +
                    "AND e.unitSvcCd = '001' " +
                    "AND e.statEvetCd = '01' " +
                    "AND e.znCd <> '503' " +
                    "AND e.outbPlac IS NOT NULL " +
                    "AND e.outbPlac <> '' " +
                    "GROUP BY e.znCd"
    )
    List<Object[]> countBySc(@Param("start") String start, @Param("end") String end);

    @Query(
            "SELECT e.outbPlac, COUNT(e) " +
                    "FROM IocStatEvetOutbHist e " +
                    "WHERE e.outbDtm BETWEEN :start AND :end " +
                    "AND e.svcThemeCd = 'SSC' " +
                    "AND e.unitSvcCd = '001' " +
                    "AND e.statEvetCd = '01' " +
                    "AND e.znCd <> '503' " +
                    "AND e.znCd = :znCd " +
                    "AND e.outbPlac IS NOT NULL " +
                    "AND e.outbPlac <> '' " +
                    "AND e.statEvetCd IN ('01','02') " +
                    "GROUP BY e.outbPlac"
    )
    List<Object[]> countByScSub(@Param("start") String start, @Param("end") String end, @Param("znCd") String znCd);

    @Query(value =
            "SELECT e.outb_plac, f.fac_nm, " +
                    "       COUNT(*) AS cnt, " +
                    "       ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER (), 0) AS percent " +
                    "FROM ioc.ioc_stat_evet_outb_hist e " +
                    "JOIN fms.erf_fac_info f ON f.mgt_no = e.outb_plac " +
                    "WHERE e.outb_dtm BETWEEN :start AND :end " +
                    "AND e.svc_theme_cd = 'SSC' " +
                    "AND e.unit_svc_cd = '001' " +
                    "AND e.zn_cd <> '503' " +
                    "AND e.outb_plac IS NOT NULL " +
                    "AND e.outb_plac <> '' " +
                    "AND e.stat_evet_cd NOT IN ('04','05') " +
                    "AND e.stat_evet_cd IN ('01','02') " +
                    "GROUP BY e.outb_plac, f.fac_nm " +
                    "ORDER BY cnt DESC " +
                    "LIMIT :limit",
            nativeQuery = true
    )
    List<Object[]> countTopScWithGlobalPercent(@Param("start") String start, @Param("end") String end, @Param("limit") int limit);

    @Query(value =
            "SELECT e.outb_plac, f.fac_nm, " +
                    "       COUNT(*) AS cnt, " +
                    "       ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER (), 0) AS percent " +
                    "FROM ioc.ioc_stat_evet_outb_hist e " +
                    "JOIN fms.erf_fac_info f ON f.mgt_no = e.outb_plac " +
                    "WHERE e.outb_dtm BETWEEN :start AND :end " +
                    "AND e.svc_theme_cd = 'SSC' " +
                    "AND e.unit_svc_cd = '001' " +
                    "AND e.zn_cd <> '503' " +
                    "AND e.zn_cd = :znCd " +
                    "AND e.outb_plac IS NOT NULL " +
                    "AND e.outb_plac <> '' " +
                    "AND e.stat_evet_cd NOT IN ('04','05') " +
                    "AND e.stat_evet_cd IN ('01','02') " +
                    "GROUP BY e.outb_plac, f.fac_nm " +
                    "ORDER BY cnt DESC " +
                    "LIMIT :limit",
            nativeQuery = true
    )
    List<Object[]> countTopScWithGlobalPercentSub(@Param("start") String start, @Param("end") String end, @Param("limit") int limit, @Param("znCd") String znCd);

    // ── 시설물 고장 통계용 쿼리 ──────────────────────────────────

    @Query(
            "SELECT e.znCd, COUNT(e) " +
                    "FROM IocStatEvetOutbHist e " +
                    "WHERE e.outbDtm BETWEEN :start AND :end " +
                    "AND e.svcThemeCd = 'SSC' " +
                    "AND e.unitSvcCd = '002' " +
                    "AND e.znCd <> '503' " +
                    "AND e.statEvetGdCd = '01' " +
                    "AND e.outbPlac IS NOT NULL " +
                    "AND e.outbPlac <> '' " +
                    "AND e.outbPlac LIKE '%\\_%' " +
                    "AND e.statEvetCd NOT IN ('03') " +
                    "GROUP BY e.znCd"
    )
    List<Object[]> countFacByZnCd(@Param("start") String start, @Param("end") String end);

    @Query(value =
            "SELECT e.outb_plac, f.fac_nm, COUNT(*) " +
                    "FROM ioc.ioc_stat_evet_outb_hist e " +
                    "JOIN fms.erf_fac_info f ON f.mgt_no = e.outb_plac " +
                    "WHERE e.outb_dtm BETWEEN :start AND :end " +
                    "AND e.svc_theme_cd = 'SSC' " +
                    "AND e.unit_svc_cd = '002' " +
                    "AND e.zn_cd <> '503' " +
                    "AND e.zn_cd = :znCd " +
                    "AND e.stat_evet_gd_cd = '01' " +
                    "AND e.outb_plac IS NOT NULL " +
                    "AND e.outb_plac <> '' " +
                    "AND e.outb_plac LIKE '%\\_%' " +
                    "AND e.stat_evet_cd NOT IN ('03') " +
                    "GROUP BY e.outb_plac, f.fac_nm " +
                    "ORDER BY COUNT(*) DESC",
            nativeQuery = true
    )
    List<Object[]> countFacByOutbPlacSub(@Param("start") String start, @Param("end") String end, @Param("znCd") String znCd);

    @Query(value =
            "SELECT SUBSTRING(e.outb_dtm, 1, 8) AS day_key, e.stat_evet_cd, COUNT(*) " +
                    "FROM ioc.ioc_stat_evet_outb_hist e " +
                    "WHERE e.outb_dtm BETWEEN :start AND :end " +
                    "AND e.svc_theme_cd = 'SSC' " +
                    "AND e.unit_svc_cd = '002' " +
                    "AND e.zn_cd <> '503' " +
                    "AND e.stat_evet_gd_cd = '01' " +
                    "AND e.outb_plac IS NOT NULL " +
                    "AND e.outb_plac <> '' " +
                    "AND e.outb_plac LIKE '%\\_%' " +
                    "AND e.stat_evet_cd NOT IN ('03') " +
                    "GROUP BY SUBSTRING(e.outb_dtm, 1, 8), e.stat_evet_cd " +
                    "ORDER BY day_key",
            nativeQuery = true
    )
    List<Object[]> countFacByDay(@Param("start") String start, @Param("end") String end);

    @Query(value =
            "SELECT SUBSTRING(e.outb_dtm, 1, 8) AS day_key, e.stat_evet_cd, COUNT(*) " +
                    "FROM ioc.ioc_stat_evet_outb_hist e " +
                    "WHERE e.outb_dtm BETWEEN :start AND :end " +
                    "AND e.svc_theme_cd = 'SSC' " +
                    "AND e.unit_svc_cd = '002' " +
                    "AND e.zn_cd <> '503' " +
                    "AND e.zn_cd = :znCd " +
                    "AND e.stat_evet_gd_cd = '01' " +
                    "AND e.outb_plac IS NOT NULL " +
                    "AND e.outb_plac <> '' " +
                    "AND e.outb_plac LIKE '%\\_%' " +
                    "AND e.stat_evet_cd NOT IN ('03') " +
                    "GROUP BY SUBSTRING(e.outb_dtm, 1, 8), e.stat_evet_cd " +
                    "ORDER BY day_key",
            nativeQuery = true
    )
    List<Object[]> countFacByDaySub(@Param("start") String start, @Param("end") String end, @Param("znCd") String znCd);

    @Query(
            "SELECT e.statEvetCd, COUNT(e) " +
                    "FROM IocStatEvetOutbHist e " +
                    "WHERE e.outbDtm BETWEEN :start AND :end " +
                    "AND e.svcThemeCd = 'SSC' " +
                    "AND e.unitSvcCd = '002' " +
                    "AND e.znCd <> '503' " +
                    "AND e.statEvetGdCd = '01' " +
                    "AND e.outbPlac IS NOT NULL " +
                    "AND e.outbPlac <> '' " +
                    "AND e.outbPlac LIKE '%\\_%' " +
                    "AND e.statEvetCd NOT IN ('03') " +
                    "GROUP BY e.statEvetCd"
    )
    List<Object[]> countFacByStat(@Param("start") String start, @Param("end") String end);

    @Query(
            "SELECT e.statEvetCd, COUNT(e) " +
                    "FROM IocStatEvetOutbHist e " +
                    "WHERE e.outbDtm BETWEEN :start AND :end " +
                    "AND e.svcThemeCd = 'SSC' " +
                    "AND e.unitSvcCd = '002' " +
                    "AND e.znCd <> '503' " +
                    "AND e.znCd = :znCd " +
                    "AND e.statEvetGdCd = '01' " +
                    "AND e.outbPlac IS NOT NULL " +
                    "AND e.outbPlac <> '' " +
                    "AND e.outbPlac LIKE '%\\_%' " +
                    "AND e.statEvetCd NOT IN ('03') " +
                    "GROUP BY e.statEvetCd"
    )
    List<Object[]> countFacByStatSub(@Param("start") String start, @Param("end") String end, @Param("znCd") String znCd);

    @Query(value =
            "SELECT e.outb_plac, f.fac_nm, " +
                    "       COUNT(*) AS cnt, " +
                    "       ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER (), 0) AS percent " +
                    "FROM ioc.ioc_stat_evet_outb_hist e " +
                    "JOIN fms.erf_fac_info f ON f.mgt_no = e.outb_plac " +
                    "WHERE e.outb_dtm BETWEEN :start AND :end " +
                    "AND e.svc_theme_cd = 'SSC' " +
                    "AND e.unit_svc_cd = '002' " +
                    "AND e.zn_cd <> '503' " +
                    "AND e.stat_evet_gd_cd = '01' " +
                    "AND e.outb_plac IS NOT NULL " +
                    "AND e.outb_plac <> '' " +
                    "AND e.outb_plac LIKE '%\\_%' " +
                    "AND e.stat_evet_cd NOT IN ('03') " +
                    "GROUP BY e.outb_plac, f.fac_nm " +
                    "ORDER BY cnt DESC " +
                    "LIMIT :limit",
            nativeQuery = true
    )
    List<Object[]> countFacSc(@Param("start") String start, @Param("end") String end, @Param("limit") int limit);

    @Query(value =
            "SELECT e.outb_plac, f.fac_nm, " +
                    "       COUNT(*) AS cnt, " +
                    "       ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER (), 0) AS percent " +
                    "FROM ioc.ioc_stat_evet_outb_hist e " +
                    "JOIN fms.erf_fac_info f ON f.mgt_no = e.outb_plac " +
                    "WHERE e.outb_dtm BETWEEN :start AND :end " +
                    "AND e.svc_theme_cd = 'SSC' " +
                    "AND e.unit_svc_cd = '002' " +
                    "AND e.zn_cd <> '503' " +
                    "AND e.zn_cd = :znCd " +
                    "AND e.stat_evet_gd_cd = '01' " +
                    "AND e.outb_plac IS NOT NULL " +
                    "AND e.outb_plac <> '' " +
                    "AND e.outb_plac LIKE '%\\_%' " +
                    "AND e.stat_evet_cd NOT IN ('03') " +
                    "GROUP BY e.outb_plac, f.fac_nm " +
                    "ORDER BY cnt DESC " +
                    "LIMIT :limit",
            nativeQuery = true
    )
    List<Object[]> countFacScSub(@Param("start") String start, @Param("end") String end, @Param("znCd") String znCd, @Param("limit") int limit);

    // ─────────────────────────────────────────────────────────

    @Query(value =
            "WITH latest_outb AS ( " +
                    "    SELECT c.stat_evet_outb_seqn, d.item_val, c.outb_dtm, " +
                    "           ROW_NUMBER() OVER (PARTITION BY c.outb_plac, d.item_val ORDER BY c.outb_dtm DESC) AS rn " +
                    "    FROM ioc.ioc_stat_evet_outb_hist c " +
                    "    INNER JOIN ioc.ioc_stat_evet_item_hist d " +
                    "        ON c.stat_evet_outb_seqn = d.stat_evet_outb_seqn " +
                    "    WHERE c.svc_theme_cd = 'SSC' " +
                    "      AND c.unit_svc_cd = '002' " +
                    "      AND d.seq = 1 " +
                    "      AND c.outb_plac IN (:outbPlacList) " +
                    ") " +
                    "SELECT b.item_val, a.stat_evet_gd_cd " +
                    "FROM ioc.ioc_stat_evet_outb_hist a " +
                    "INNER JOIN ioc.ioc_stat_evet_item_hist b " +
                    "    ON a.stat_evet_outb_seqn = b.stat_evet_outb_seqn " +
                    "INNER JOIN latest_outb lo " +
                    "    ON a.stat_evet_outb_seqn = lo.stat_evet_outb_seqn " +
                    "WHERE b.seq = 1 AND lo.rn = 1 " +
                    "ORDER BY a.outb_dtm DESC",
            nativeQuery = true)
    List<Object[]> findLastestFacEvents(@Param("outbPlacList") List<String> outbPlacList);


    List<IocStatEvetOutbHist> findAllByOutbDtmBetweenAndSvcThemeCdAndUnitSvcCdAndZnCdIsNot(String s, String s1, String ssc, String number, String number1);
}
