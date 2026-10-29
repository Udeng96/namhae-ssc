import { useEffect, useRef } from 'react';
import { API, BASE_URL } from '@/component/lib/urls';

/** 재생 위치 확인 주기 (ms) */
const CHECK_INTERVAL_MS = 60000;

/** 위치가 이 횟수 연속으로 그대로면 멈춘 것으로 본다 (약 3분) */
const STALL_COUNT = 3;

/**
 * 자가 복구 새로고침 최소 간격 (ms).
 * 재생이 아예 불가능한 상태(외부 인터넷 장애 등)에서 새로고침이 반복되지 않게 한다.
 * 새로고침해도 sessionStorage 는 남으므로 이 값으로 막는다.
 */
const MIN_RELOAD_INTERVAL_MS = 600000;
const SELF_HEAL_AT_KEY = 'socialPlaybackSelfHealAt';

/** 새로고침 전 서버 확인 타임아웃 (ms) */
const HEALTH_TIMEOUT_MS = 5000;

/**
 * 서버가 응답하는지 확인한다.
 * 내부망까지 끊긴 상태에서 새로고침하면 페이지 자체를 못 불러와 브라우저 오류 화면에 머물고,
 * 그러면 복구해 줄 스크립트도 남지 않는다. 서버가 응답할 때만 새로고침한다.
 * (내부망 장애 복구 시의 새로고침은 useSocialWs 의 헬스체크가 따로 맡는다)
 */
const isServerReachable = async (): Promise<boolean> => {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), HEALTH_TIMEOUT_MS);
  try {
    const res = await fetch(`${BASE_URL}${API.HEALTH.CHECK}`, { cache: 'no-store', signal: controller.signal });
    return res.ok;
  } catch {
    return false;
  } finally {
    clearTimeout(timer);
  }
};

/**
 * 지금 재생 중인 영상의 표본.
 * - key: 무엇을 틀고 있는지 (영상 종류 + 식별자). 바뀌면 판정을 처음부터 한다.
 * - position: 재생 위치(초). 플레이어가 없거나 못 읽으면 null.
 * - null 을 돌려주면 판정하지 않는다 (표출할 영상 자체가 없는 경우).
 */
export type PlaybackSample = { key: string; position: number | null } | null;

/**
 * 영상이 멈추면 화면을 스스로 새로고침한다. (합천 VideoPlayArea 의 자가 복구와 같은 기준)
 *
 * 영상 로테이션은 플레이어 이벤트(끝남·에러·버퍼링)로만 넘어가서, 이벤트가 오지 않는
 * 상태에 빠지면 새로고침 전까지 영구히 멈춘다. 재현된 경우:
 *   - 재생 중 화면을 터치해 일시정지됨 (일시정지 처리가 없음)
 *   - 외부 인터넷이 10초 넘게 끊긴 사이 다음 영상으로 넘어가 새 플레이어가 로드에 실패함
 *
 * 같은 영상에서 위치가 늘지 않으면 센다. 합천과 달리 위치를 못 읽는 상태도 센다.
 * 로드에 실패한 플레이어는 위치를 끝내 읽을 수 없어서, 건너뛰면 그 경우를 못 잡는다.
 */
const usePlaybackSelfHeal = (getSample: () => PlaybackSample) => {
  const getSampleRef = useRef(getSample);
  getSampleRef.current = getSample;

  useEffect(() => {
    let prev: PlaybackSample = null;
    let stallCount = 0;

    let reloading = false;

    const id = setInterval(async () => {
      if (reloading) return;

      let sample: PlaybackSample = null;
      try { sample = getSampleRef.current(); } catch { sample = null; }

      const progressed =
        !sample || !prev || sample.key !== prev.key ||
        (sample.position !== null && (prev.position === null || sample.position > prev.position));

      prev = sample;
      if (progressed) {
        stallCount = 0;
        return;
      }

      stallCount += 1;
      console.log(`social :: 영상 재생 정지 감지 (${stallCount}/${STALL_COUNT}) ${sample?.key}`);
      if (stallCount < STALL_COUNT) return;

      let lastAt = 0;
      try { lastAt = Number(sessionStorage.getItem(SELF_HEAL_AT_KEY) ?? 0); } catch { /* 저장소 차단 환경 무시 */ }
      if (Date.now() - lastAt < MIN_RELOAD_INTERVAL_MS) return;

      // 서버가 응답하지 않으면 이번에는 넘긴다. 멈춤 횟수는 유지해 다음 확인에서 다시 시도한다.
      reloading = true;
      const reachable = await isServerReachable();
      if (!reachable) {
        reloading = false;
        console.log('social :: 서버 응답 없음 — 재로드 보류');
        return;
      }

      try { sessionStorage.setItem(SELF_HEAL_AT_KEY, String(Date.now())); } catch { /* noop */ }
      console.log('social :: 영상 재생이 멈춰 화면 재로드');
      window.location.reload();
    }, CHECK_INTERVAL_MS);

    return () => clearInterval(id);
  }, []);
};

export default usePlaybackSelfHeal;
