import { useEffect, useRef } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { useEventStore } from '@/component/stores/eventStore';
import { useCommonStore } from '@/component/stores/commonStore';
import alarm from '@/assets/alarm/fire_bell.wav';

const AUTO_STOP_MS = 8000;
const GAP_MS = 500;

/**
 * 운영 대시보드 화재 이벤트 알람.
 *
 * - statEvetCd === '02' (화재) 수신 시 useEventWs 가 isFireAlarm=true 로 세팅
 * - 관제사(userType='001') 화면에서만 사이렌(fire_bell.mp3) 8초간 재생
 * - 0.5초 간격으로 loop, 8초 후 자동 정지
 * - BellEventAlarm 과 동일한 패턴 (사운드/대상 state 만 다름)
 */
const FireEventAlarm = () => {
  const { isFireAlarm, setIsFireAlarm } = useEventStore(
    useShallow((state) => ({
      isFireAlarm:    state.isFireAlarm,
      setIsFireAlarm: state.actions.setIsFireAlarm,
    })),
  );
  const userInfo = useCommonStore((state) => state.userInfo);

  const audioRef      = useRef<HTMLAudioElement | null>(null);
  const stopTimerRef  = useRef<number | null>(null);
  const gapTimerRef   = useRef<number | null>(null);
  const isPlayingRef  = useRef(false);

  const clearTimers = () => {
    if (stopTimerRef.current !== null) {
      window.clearTimeout(stopTimerRef.current);
      stopTimerRef.current = null;
    }
    if (gapTimerRef.current !== null) {
      window.clearTimeout(gapTimerRef.current);
      gapTimerRef.current = null;
    }
  };

  const stopAlarm = () => {
    clearTimers();
    const a = audioRef.current;
    if (!a) return;
    a.pause();
    a.currentTime = 0;
    isPlayingRef.current = false;
  };

  useEffect(() => {
    const a = new Audio(alarm);
    a.preload = 'auto';
    a.loop = false;
    audioRef.current = a;

    const onEnded = () => {
      if (!isPlayingRef.current) return;
      gapTimerRef.current = window.setTimeout(async () => {
        const audio = audioRef.current;
        if (!audio || !isPlayingRef.current) return;
        try {
          audio.currentTime = 0;
          await audio.play();
        } catch (e) {
          console.error('audio play failed:', e);
          stopAlarm();
        }
      }, GAP_MS);
    };

    a.addEventListener('ended', onEnded);
    return () => {
      a.removeEventListener('ended', onEnded);
      stopAlarm();
      audioRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const startAlarmWithAutoStop = async (): Promise<boolean> => {
    const a = audioRef.current;
    if (!a) return false;
    if (isPlayingRef.current) return true;

    clearTimers();
    try {
      isPlayingRef.current = true;
      a.currentTime = 0;
      await a.play();
      stopTimerRef.current = window.setTimeout(stopAlarm, AUTO_STOP_MS);
      return true;
    } catch (e) {
      console.error('audio play failed:', e);
      isPlayingRef.current = false;
      return false;
    }
  };

  useEffect(() => {
    const isTargetUser = userInfo !== null && String(userInfo.userType).trim() === '001';
    if (isTargetUser && isFireAlarm) {
      (async () => {
        const ok = await startAlarmWithAutoStop();
        if (ok) setIsFireAlarm(false);
      })();
    }
  }, [isFireAlarm, userInfo]);

  return <div />;
};

export default FireEventAlarm;
