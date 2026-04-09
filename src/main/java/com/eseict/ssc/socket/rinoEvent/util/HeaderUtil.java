package com.eseict.ssc.socket.rinoEvent.util;

import com.eseict.ssc.util.ByteSupport;
import com.eseict.ssc.util.StringUtil;
import lombok.extern.slf4j.Slf4j;

import java.nio.ByteOrder;
import java.nio.charset.StandardCharsets;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Locale;

/**
 * Rino 프로토콜 헤더 파싱/조립 유틸리티 (인스턴스화 불가).
 *
 * 헤더 구조 (총 60B):
 *   [0-1]  HEDR_TYP_CD  (2B) — 헤더 타입 코드
 *   [2-10] SND_SYS_CD   (9B) — 송신 시스템 코드
 *   [11]   MSG_EXCH_PATRN (1B) — 메시지 교환 패턴 (1:ONE_WAY, 2:ONE_WAY_ACK, 3:ACK)
 *   [12-15] BODY_LEN    (4B) — 데이터부 길이 (LittleEndian)
 *   [16-18] MSG_TYP_CD  (3B) — 메시지 타입 코드
 *   [19-42] TRCE_ID     (24B) — 트레이스 ID
 *   [43-59] SND_DTM     (17B) — 전송 시간 (yyyyMMddHHmmssSSS)
 */
@Slf4j
public final class HeaderUtil {

    // ── 날짜 포맷 ────────────────────────────────────────────────────────────
    public static final String DTM_FORMAT = "yyyyMMddHHmmssSSS";

    // ── 현재 헤더 필드 인덱스 ─────────────────────────────────────────────────
    public static final int HEDR_TYP_CD    = 0;
    public static final int SND_SYS_CD     = 1;
    public static final int MSG_EXCH_PATRN = 2;
    public static final int BODY_LEN       = 3;
    public static final int MSG_TYP_CD     = 4;
    public static final int TRCE_ID        = 5;
    public static final int SND_DTM        = 6;

    // ── 레거시 헤더 필드 인덱스 (구버전 호환) ─────────────────────────────────
    public static final int OLD_BODY_LEN        = 12;
    public static final int HEADER_TYP_CD_LEN   = 2;
    public static final int OLD_HEADER_TYP_CD_LEN = 1;

    // ── 현재 헤더 레이아웃 ────────────────────────────────────────────────────
    private static final int[] HEADER_ITEM_LEN       = {2, 9, 1, 4, 3, 24, 17};
    private static final int[] HEADER_ITEM_START_POS = {0, 2, 11, 12, 16, 19, 43};
    private static final int[] HEADER_ITEM_END_POS   = {2, 11, 12, 16, 19, 43, 60};

    // ── 레거시 헤더 레이아웃 ──────────────────────────────────────────────────
    private static final int[] OLD_HEADER_ITEM_LEN       = {1, 10, 20, 20, 20, 15, 20, 20, 10, 100, 14, 14, 10};
    private static final int[] OLD_HEADER_ITEM_START_POS = {0, 1, 11, 31, 51, 71, 86, 106, 126, 136, 236, 250, 264};

    // ── 총 길이 (캐싱) ────────────────────────────────────────────────────────
    private static final int HEADER_TOTAL_LEN;
    private static final int OLD_HEADER_TOTAL_LEN;

    static {
        int total = 0;
        for (int len : HEADER_ITEM_LEN) total += len;
        HEADER_TOTAL_LEN = total;

        int oldTotal = 0;
        for (int len : OLD_HEADER_ITEM_LEN) oldTotal += len;
        OLD_HEADER_TOTAL_LEN = oldTotal;
    }

    private HeaderUtil() { }

    // ── 현재 헤더 조회 ────────────────────────────────────────────────────────

    public static int getHeaderItemLength(int fieldId)   { return HEADER_ITEM_LEN[fieldId]; }
    public static int getHeaderItemStartPos(int fieldId) { return HEADER_ITEM_START_POS[fieldId]; }
    public static int getHeaderItemEndPos(int fieldId)   { return HEADER_ITEM_END_POS[fieldId]; }
    public static int getHeaderTotalLen()                { return HEADER_TOTAL_LEN; }

    // ── 레거시 헤더 조회 ──────────────────────────────────────────────────────

    public static int getOldHeaderItemLength(int fieldId)   { return OLD_HEADER_ITEM_LEN[fieldId]; }
    public static int getOldHeaderItemStartPos(int fieldId) { return OLD_HEADER_ITEM_START_POS[fieldId]; }
    public static int getOldHeaderTotalLen()                { return OLD_HEADER_TOTAL_LEN; }

    // ── 헤더 조립 ─────────────────────────────────────────────────────────────

    /**
     * 수신 헤더를 복제하여 ACK 헤더를 생성한다.
     * SND_SYS_CD, MSG_EXCH_PATRN, BODY_LEN(0) 필드를 교체한다.
     */
    public static byte[] makeAckHeader(byte[] header, String sndSysCd, String mep) {
        byte[] ackHeader = header.clone();

        byte[] sndSysCdByte = StringUtil.setPad(sndSysCd, getHeaderItemLength(SND_SYS_CD), ' ', StringUtil.PAD_LEFT)
                                        .getBytes(StandardCharsets.UTF_8);
        byte[] mepByte      = mep.getBytes(StandardCharsets.UTF_8);
        byte[] bodyLenByte  = ByteSupport.intToByteArray(0, ByteOrder.BIG_ENDIAN);

        System.arraycopy(sndSysCdByte, 0, ackHeader, getHeaderItemStartPos(SND_SYS_CD),     getHeaderItemLength(SND_SYS_CD));
        System.arraycopy(mepByte,      0, ackHeader, getHeaderItemStartPos(MSG_EXCH_PATRN), getHeaderItemLength(MSG_EXCH_PATRN));
        System.arraycopy(bodyLenByte,  0, ackHeader, getHeaderItemStartPos(BODY_LEN),       getHeaderItemLength(BODY_LEN));

        return ackHeader;
    }

    /**
     * 신규 헤더 바이트 배열을 생성한다.
     * 바디 길이는 헤더 조립 후 BODY_LEN 위치에 LittleEndian으로 삽입한다.
     */
    public static byte[] makeHeader(
            String headerTypCd, String clientCd, String siteCd,
            String sndSysCd, String msgTypCd, String mepTypCd,
            String trceId, int bodyLen) {
        try {
            String sndSysCdPadded = StringUtil.setPad(sndSysCd, 9,  ' ', StringUtil.PAD_LEFT);
            String trceIdPadded   = StringUtil.setPad(trceId,   24, ' ', StringUtil.PAD_RIGHT);
            String sndDtm         = new SimpleDateFormat(DTM_FORMAT, Locale.KOREAN)
                                            .format(Calendar.getInstance().getTime());

            String headerStr = clientCd
                    + StringUtil.setPad(siteCd, 8, ' ', StringUtil.PAD_LEFT)
                    + headerTypCd
                    + sndSysCdPadded
                    + mepTypCd
                    + "0000"       // 바디 길이 임시값 (아래서 덮어씀)
                    + msgTypCd
                    + trceIdPadded
                    + sndDtm;

            byte[] headerByte  = headerStr.getBytes(StandardCharsets.UTF_8);
            byte[] bodyLenByte = ByteSupport.intToByteArray(bodyLen, ByteOrder.LITTLE_ENDIAN);
            System.arraycopy(bodyLenByte, 0, headerByte,
                             getHeaderItemStartPos(BODY_LEN), getHeaderItemLength(BODY_LEN));

            return headerByte;

        } catch (Exception e) {
            log.error("헤더 생성 실패", e);
            return null;
        }
    }
}
