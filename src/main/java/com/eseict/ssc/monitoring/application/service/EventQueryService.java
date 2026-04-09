package com.eseict.ssc.monitoring.application.service;

import com.eseict.ssc.common.dto.CommonArea;
import com.eseict.ssc.common.dto.SocketData;
import com.eseict.ssc.monitoring.application.dto.*;
import com.eseict.ssc.conf.domain.entity.BellConfInfo;
import com.eseict.ssc.facility.domain.entity.ErfFacInfo;
import com.eseict.ssc.facility.domain.entity.ErfPosCrdnt;
import com.eseict.ssc.monitoring.domain.entity.IocStatEvetOutbHist;
import com.eseict.ssc.repository.conf.BellConfRepository;
import com.eseict.ssc.repository.event.EventInfoRepository;
import com.eseict.ssc.repository.event.EventRepository;
import com.eseict.ssc.repository.event.EventZnInfoRepository;
import com.eseict.ssc.repository.event.UnitSvcRepository;
import com.eseict.ssc.repository.fac.FacPosRepository;
import com.eseict.ssc.repository.fac.FacRepository;
import com.eseict.ssc.common.util.DateTimeUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;

import static com.eseict.ssc.config.ApiConstants.EVENT_NULL.PLCID_NULL;

/**
 * EventQueryService — 이벤트 읽기 전용 Application Service (CQRS Query Side)
 *
 * 개선:
 *  - EventService God-object 를 Query / Command 로 분리
 *  - EventUtil @Component 제거 → private static 헬퍼 메서드 인라인
 *  - EventResultItem.builder() 사용 (위치 인수 생성자 제거)
 *  - 날짜·구역·코드 해석 로직을 전용 private 메서드로 추출
 */
@Service
@Slf4j
@RequiredArgsConstructor
public class EventQueryService {

    private final EventRepository       eventRepository;
    private final EventInfoRepository   eventInfoRepository;
    private final EventZnInfoRepository eventZnInfoRepository;
    private final UnitSvcRepository     unitSvcRepository;
    private final BellConfRepository    bellConfRepository;
    private final FacRepository         facRepository;
    private final FacPosRepository      facPosRepository;

    // ── 공개 API ────────────────────────────────────────────────────────────

    /**
     * 이벤트 리스트 페이징 조회
     * (반환 타입: EventResult — 기존과 동일)
     */
    public EventResult getEvents(String startDtm, String endDtm, String plcId,
                                 List<String> znCds, List<String> statEventCds, int pageNum) {
        validateDateRange(startDtm, endDtm);

        String[] dates = resolveDateRange(startDtm, endDtm);
        List<String> zns   = resolveZoneCodes(znCds);
        List<String> codes = resolveEventCodes(statEventCds);
        String pid = plcId.isEmpty() ? PLCID_NULL : plcId;

        List<EventDataResult> items =
                eventRepository.findEventHists(zns, codes, dates[0], dates[1], pid, pageNum, false);
        int totalCnt = (pageNum == 0)
                ? items.size()
                : eventRepository.findEventHists(zns, codes, dates[0], dates[1], pid, pageNum, true).size();

        long perPage   = items.isEmpty() ? 1L : 9L;
        long totalPage = (pageNum == 0) ? 1L : (totalCnt + perPage - 1) / perPage;

        log.info("이벤트 조회 — page={}, 현재={}, 전체={}", pageNum, items.size(), totalCnt);

        List<String> seqns  = items.stream()
                .map(EventDataResult::getStatEvetOutbSeqn)
                .collect(Collectors.toList());
        Map<String, BellConfInfo> confMap = buildConfMap(seqns);

        List<EventResultItem> results = items.stream()
                .map(item -> {
                    BellConfInfo conf = confMap.get(item.getStatEvetOutbSeqn());
                    if (conf != null && (conf.getConfStatus() == 1 || conf.getConfStatus() == 5)) {
                        return toResultItem(item, conf.getClrDtm(), conf.getUserId(),
                                String.valueOf(conf.getConfStatus()));
                    }
                    return toResultItem(item, "", "", "");
                })
                .collect(Collectors.toList());

        return new EventResult(pageNum, perPage, totalCnt, totalPage, results);
    }

    /**
     * seqn 으로 단건 이벤트 상세 조회
     * (반환 타입: EventResultItem — 기존과 동일)
     */
    public EventResultItem getEventInfoBySeqn(String seqn) {
        IocStatEvetOutbHist entity = eventRepository.findById(seqn)
                .orElseThrow(() -> new NoSuchElementException(
                        "해당 SEQN의 이벤트가 존재하지 않습니다. seqn=" + seqn));

        String znNm = Optional.ofNullable(
                eventZnInfoRepository.findZnNmByZnCd(entity.getZnCd())).orElse("");
        String unitSvcNm = unitSvcRepository
                .findUnitSvcNmByUnitSvcCd(entity.getUnitSvcCd())
                .stream().findFirst().orElse("");
        String statEvetNm = Optional.ofNullable(
                eventRepository.findStatEvetNm(entity.getZnCd(), entity.getUnitSvcCd(),
                        entity.getSvcThemeCd(), entity.getStatEvetCd())).orElse("");

        if (znNm.isEmpty() || unitSvcNm.isEmpty() || statEvetNm.isEmpty()) {
            log.warn("이벤트 정보 누락 — znNm={}, unitSvcNm={}, statEvetNm={}",
                    znNm, unitSvcNm, statEvetNm);
            throw new IllegalArgumentException("이벤트 정보가 누락되었습니다.");
        }

        List<ErfFacInfo> facInfos = facRepository.findByMgtNo(entity.getOutbPlac());
        String addrShort = facInfos.isEmpty() ? "" : facInfos.get(0).getAddrShort();

        // 좌표: 시설 위치에서 조회, 없으면 "0" (기존의 NPE 방어)
        String xcrdnt = "0", ycrdnt = "0";
        if (!facInfos.isEmpty()) {
            List<ErfPosCrdnt> posInfos = facPosRepository.findByFacId(facInfos.get(0).getFacId());
            if (!posInfos.isEmpty()) {
                xcrdnt = posInfos.get(0).getXCrdnt();
                ycrdnt = posInfos.get(0).getYCrdnt();
            }
        }

        return toResultItemFromEntity(entity, znNm, unitSvcNm, statEvetNm, addrShort, xcrdnt, ycrdnt);
    }

    /**
     * 소켓 데이터(uSvcOutbId)로 이벤트 조회
     * (반환 타입: EventResultItem — 기존과 동일)
     */
    public EventResultItem getEventInfoBySocketData(SocketData.StatEvet st) {
        IocStatEvetOutbHist entity = eventRepository.findByuSvcOutbId(st.getUSvcOutbId())
                .stream().findFirst()
                .orElseThrow(() -> new NoSuchElementException("해당 uSvcOutbId의 이벤트가 존재하지 않습니다."));

        String znNm = Optional.ofNullable(
                eventZnInfoRepository.findZnNmByZnCd(entity.getZnCd())).orElse("");
        String unitSvcNm = unitSvcRepository
                .findUnitSvcNmByUnitSvcCd(entity.getUnitSvcCd())
                .stream().findFirst().orElse("");
        String statEvetNm = Optional.ofNullable(
                eventRepository.findStatEvetNm(entity.getZnCd(), entity.getUnitSvcCd(),
                        entity.getSvcThemeCd(), entity.getStatEvetCd())).orElse("");

        List<ErfFacInfo> facInfos = facRepository.findByMgtNo(entity.getOutbPlac());
        String addrShort = facInfos.isEmpty() ? "" : facInfos.get(0).getAddrShort();

        if (znNm.isEmpty() || unitSvcNm.isEmpty() || statEvetNm.isEmpty() || addrShort.isEmpty()) {
            log.warn("소켓 이벤트 정보 누락 — znNm={}, unitSvcNm={}, statEvetNm={}, addrShort={}",
                    znNm, unitSvcNm, statEvetNm, addrShort);
            throw new IllegalArgumentException("이벤트 정보가 누락되었습니다.");
        }

        String xcrdnt = st.getOutbPos().get(0).getX();
        String ycrdnt = st.getOutbPos().get(0).getY();

        return toResultItemFromEntity(entity, znNm, unitSvcNm, statEvetNm, addrShort, xcrdnt, ycrdnt);
    }

    /**
     * 경로당 오늘 상태 이벤트 목록 조회
     * (반환 타입: List<TodayEventItem> — 기존과 동일)
     */
    public List<TodayEventItem> getTodayScEventList(String startDtm, String endDtm, String mgtNo) {
        List<TodayEventItem> all = eventRepository.findTodayScEventList(startDtm, endDtm, mgtNo);

        // 정상(code="00") / 고장 이벤트를 분리해 최신 고장 상태 판별
        Map<String, TodayEventItem> normalMap = new LinkedHashMap<>();
        Map<String, TodayEventItem> resultMap = new LinkedHashMap<>();

        for (TodayEventItem item : all) {
            String code = item.getStatEvetCd();
            if ("00".equals(code)) {
                normalMap.put(code, item);
                continue;
            }
            TodayEventItem prev = resultMap.get(code);
            String prevClr = prev == null ? null : prev.getClrDtm();
            if (prev == null || (prevClr != null && !prevClr.isEmpty())) {
                // 신규 고장 또는 이전 고장이 이미 종료 → 정상 이벤트로 clrDtm 보정
                resolveClrDtm(normalMap, item);
            }
            resultMap.put(code, item);
        }

        return new ArrayList<>(resultMap.values());
    }

    /**
     * 히트맵 데이터 조회
     * (반환 타입: List<EventHeatmap> — 기존과 동일)
     */
    public List<EventHeatmap> getHeatmapList(String startDtm, String endDtm, String statEvetCd) {
        if (statEvetCd.isEmpty()) {
            throw new IllegalArgumentException("이벤트 코드는 필수 입력값입니다.");
        }
        List<String> codes = "00".equals(statEvetCd)
                ? Arrays.asList("01", "02")
                : Collections.singletonList(statEvetCd);

        return eventRepository.findHeatmap(startDtm, endDtm, codes);
    }

    /**
     * 소방 대시보드용 이벤트 목록 조회 (procSt = '4' 필터)
     * (반환 타입: EventResult — 기존과 동일)
     *
     * 개선: isCount=true 로 LIMIT 없이 전체 조회 후 Java에서 procSt='4' 필터링
     *   - 기존 getEvents(pageNum=0) 방식은 LIMIT 50 제한이 있어 50건 이후 데이터 누락
     *   - findEventHists(isCount=true) 는 LIMIT 없이 전체 반환
     * TODO: 향후 QueryDSL에 procSt 파라미터 추가 → DB에서 직접 필터링으로 개선 가능
     */
    public EventResult getFireEvents(String startDtm, String endDtm, String plcId,
                                     List<String> znCds, List<String> statEventCds, Integer pageNumber) {
        validateDateRange(startDtm, endDtm);

        String[] dates = resolveDateRange(startDtm, endDtm);
        List<String> zns   = resolveZoneCodes(znCds);
        List<String> codes = resolveEventCodes(statEventCds);
        String pid = plcId.isEmpty() ? PLCID_NULL : plcId;

        // isCount=true → LIMIT 없이 전체 조회 (기존 LIMIT 50 누락 버그 수정)
        List<EventDataResult> allRaw =
                eventRepository.findEventHists(zns, codes, dates[0], dates[1], pid, 0, true);

        log.info("소방 이벤트 전체 조회 — 건수={}", allRaw.size());

        List<String> seqns = allRaw.stream()
                .map(EventDataResult::getStatEvetOutbSeqn)
                .collect(Collectors.toList());
        Map<String, BellConfInfo> confMap = buildConfMap(seqns);

        List<EventResultItem> all = allRaw.stream()
                .map(item -> {
                    BellConfInfo conf = confMap.get(item.getStatEvetOutbSeqn());
                    if (conf != null && (conf.getConfStatus() == 1 || conf.getConfStatus() == 5)) {
                        return toResultItem(item, conf.getClrDtm(), conf.getUserId(),
                                String.valueOf(conf.getConfStatus()));
                    }
                    return toResultItem(item, "", "", "");
                })
                .collect(Collectors.toList());

        List<EventResultItem> filtered = all.stream()
                .filter(it -> "4".equals(it.getProcSt()))
                .collect(Collectors.toList());

        long totalCnt  = filtered.size();
        long perPage   = filtered.isEmpty() ? 1L : 9L;
        long totalPage = (totalCnt + perPage - 1) / perPage;

        // 프론트에서 0-based pageNumber 전송 (0 = 첫 페이지, 7 = 8번째 페이지)
        // reqPage - 1 제거 — 프론트가 이미 0-based 로 전송
        int reqPage = pageNumber != null ? pageNumber : 0;
        int page    = clamp(reqPage, (int) Math.max(0, totalPage - 1));
        int from    = (int) (page * perPage);
        int to      = (int) Math.min(from + perPage, totalCnt);
        List<EventResultItem> pageItems = (from < to) ? filtered.subList(from, to) : Collections.emptyList();

        return EventResult.builder()
                .page(page + 1).cntPerPage(perPage).totalCnt(totalCnt)
                .totalPage(totalPage).eventList(pageItems).build();
    }

    // ── private 헬퍼 ────────────────────────────────────────────────────────

    /** 날짜 파라미터 유효성 검사 */
    private static void validateDateRange(String startDtm, String endDtm) {
        boolean startBlank = startDtm == null || startDtm.isEmpty();
        boolean endBlank   = endDtm   == null || endDtm.isEmpty();
        if (startBlank != endBlank) {
            throw new IllegalArgumentException("시작일과 종료일은 둘 다 입력하거나 둘 다 비워야 합니다.");
        }
    }

    /** 날짜 범위 해석: 비어 있으면 오늘 기준 7개월 전부터, 있으면 양 끝 시각 보정 */
    private static String[] resolveDateRange(String startDtm, String endDtm) {
        if (startDtm.isEmpty()) {
            String end = DateTimeUtil.getNowLocalDateTime();
            return new String[]{ DateTimeUtil.getMinusDate(7, end, "month"), end };
        }
        return new String[]{
                DateTimeUtil.getDtmLocalDateTime(startDtm + "000000"),
                DateTimeUtil.getDtmLocalDateTime(endDtm   + "235959")
        };
    }

    /** "400" 또는 빈 목록이면 전체 구역 코드 조회 */
    private List<String> resolveZoneCodes(List<String> znCds) {
        if (znCds.isEmpty() || "400".equals(znCds.get(0))) {
            return eventZnInfoRepository.findAreaList().stream()
                    .map(CommonArea::getCd)
                    .collect(Collectors.toList());
        }
        return znCds;
    }

    /** "00" 또는 빈 목록이면 검색 가능한 전체 이벤트 코드 조회 (03·04·05 제외) */
    private List<String> resolveEventCodes(List<String> statEventCds) {
        if (statEventCds.isEmpty() || "00".equals(statEventCds.get(0))) {
            return eventInfoRepository.getEventTypes().stream()
                    .map(kv -> kv.getValue().substring(4, 6))  // "001E01" → "01"
                    .filter(code -> !"03".equals(code) && !"04".equals(code) && !"05".equals(code))
                    .collect(Collectors.toList());
        }
        return statEventCds;
    }

    /**
     * 이벤트 시퀀스 목록으로 화상회의 정보를 Map 으로 수집
     * 동일 이벤트에 회의가 여러 개면 outbDtm 기준 최신 유지
     */
    private Map<String, BellConfInfo> buildConfMap(List<String> seqns) {
        if (seqns.isEmpty()) return Collections.emptyMap();
        return bellConfRepository.findConferencesBySeqns(seqns).stream()
                .collect(Collectors.toMap(
                        BellConfInfo::getStatEvetOutbSeqn,
                        Function.identity(),
                        (a, b) -> a.getOutbDtm().compareTo(b.getOutbDtm()) > 0 ? a : b
                ));
    }

    /** 고장 이벤트의 clrDtm 을 정상(00) 이벤트 시각으로 보정 */
    private static void resolveClrDtm(Map<String, TodayEventItem> normalMap, TodayEventItem faultItem) {
        normalMap.values().stream()
                .filter(n -> n.getStatEvetCd().equals(faultItem.getStatEvetCd()))
                .findFirst()
                .ifPresent(n -> faultItem.setClrDtm(n.getOutbDtm()));
    }

    /**
     * EventDataResult → EventResultItem (회의 정보 포함)
     * 기존 EventUtil.setEventResultItemConf() 를 static 으로 인라인 + builder 사용
     */
    private static EventResultItem toResultItem(EventDataResult e,
                                                String confClrDtm, String confUserId, String confStatus) {
        return EventResultItem.builder()
                .procSt(e.getProcSt())
                .statEvetOutbSeqn(e.getStatEvetOutbSeqn())
                .statEvetId(e.getZnCd() + "SSC" + e.getUnitSvcCd() + "E" + e.getStatEvetCd())
                .unitSvcNm(e.getUnitSvcNm())
                .unitSvcCd(e.getUnitSvcCd())
                .znNm(e.getZnNm())
                .znCd(e.getZnCd())
                .outbPlac(e.getOutbPlac())
                .addrShort(e.getAddrShort())
                .posNm(e.getPosNm())
                .outbDtm(e.getOutbDtm())
                .clrDtm(confClrDtm)
                .statEvetNm(e.getStatEvetNm())
                .statEvetCd(e.getStatEvetCd())
                .xcrdnt(e.getXcrdnt())
                .ycrdnt(e.getYcrdnt())
                .statEvetCntn(e.getStatEvetCntn())
                .confUserId(confUserId)
                .confStatus(confStatus)
                .build();
    }

    /**
     * IocStatEvetOutbHist → EventResultItem
     * 기존 EventUtil.setEventResultItem() 을 static 으로 인라인 + builder 사용
     */
    private static EventResultItem toResultItemFromEntity(IocStatEvetOutbHist e,
                                                          String znNm, String unitSvcNm,
                                                          String statEvetNm, String addrShort,
                                                          String xcrdnt, String ycrdnt) {
        return EventResultItem.builder()
                .procSt(e.getProcSt())
                .statEvetOutbSeqn(e.getStatEvetOutbSeqn())
                .statEvetId(e.getZnCd() + "SSC" + e.getUnitSvcCd() + "E" + e.getStatEvetCd())
                .unitSvcNm(unitSvcNm)
                .unitSvcCd(e.getUnitSvcCd())
                .znNm(znNm)
                .znCd(e.getZnCd())
                .outbPlac(e.getOutbPlac())
                .addrShort(addrShort)
                .posNm("")
                .outbDtm(e.getOutbDtm())
                .clrDtm(e.getClrDtm())
                .statEvetNm(statEvetNm)
                .statEvetCd(e.getStatEvetCd())
                .xcrdnt(xcrdnt)
                .ycrdnt(ycrdnt)
                .statEvetCntn(e.getStatEvetCntn())
                .confUserId("")
                .confStatus("0")
                .build();
    }

    private static <T> List<T> safeList(List<T> l) { return l != null ? l : Collections.emptyList(); }
    private static int clamp(int v, int max)        { return Math.max(0, Math.min(v, max)); }
}
