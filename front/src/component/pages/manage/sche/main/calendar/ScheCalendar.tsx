import styled          from 'styled-components';
import FullCalendar    from '@fullcalendar/react';
import dayGridPlugin   from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { EventClickArg } from '@fullcalendar/core';
import { useEffect, useState } from 'react';
import moment from 'moment';
import { useShallow } from 'zustand/react/shallow';
import { useScheStore } from '@/component/stores/scheStore';
import { CalEventItem, ScheItem } from '@/component/types/sche';
import { SCHE_MODE, SCHE_RESULT_TYPE, SCHE_TYPE } from '@/component/constants/scheConst';

// ─── 유틸 ─────────────────────────────────────────────
/** 만료 여부·긴급 여부에 따라 CSS 클래스 결정 */
const resolveClassName = (colorType: string, endDate: string, contentType: string): string => {
  const nowHH = moment().format('YYYYMMDDHH');
  const isExpired = Number(endDate) <= Number(nowHH);
  return (isExpired || contentType === SCHE_RESULT_TYPE.EMER)
    ? `${colorType} disable`
    : colorType;
};

const ScheCalendar = () => {
  const { activeType, contents, norms, emers, setActiveSche, setScheMode } = useScheStore(
    useShallow((s) => ({
      activeType:   s.activeType,
      contents:     s.contents,
      norms:        s.norms,
      emers:        s.emers,
      setActiveSche: s.actions.setActiveSche,
      setScheMode:   s.actions.setScheMode,
    })),
  );

  const [schedules, setSchedules] = useState<ScheItem[]>([]);
  const [calEvents, setCalEvents] = useState<CalEventItem[]>([]);
  const [activeCal, setActiveCal] = useState<CalEventItem | null>(null);

  // ── 탭 변경 시 달력 초기화 & 스케줄 목록 설정 ─────────
  useEffect(() => {
    setActiveCal(null);
    setActiveSche(null);
    setScheMode(SCHE_MODE.DEFAULT);

    if (activeType === SCHE_TYPE.CONTENT) {
      setSchedules(contents);
    } else if (activeType === SCHE_TYPE.NORM) {
      setSchedules(norms);
    } else {
      // EMER: 시스템 내부 메시지 제외
      setSchedules(
        emers.filter(
          (e) => e.contentTitle !== '비상벨 회의 종료' && e.contentTitle !== 'refresh',
        ),
      );
    }
  }, [activeType, contents, norms, emers]);

  // ── 스케줄 → FullCalendar 이벤트 변환 ────────────────
  useEffect(() => {
    if (schedules.length === 0) return;
    setCalEvents(
      schedules.map((s) => ({
        title:     s.contentTitle,
        className: resolveClassName(
          s.colorType,
          s.endDtm.replaceAll('-', '') + s.endTime,
          s.contentType,
        ),
        start: moment(s.startDtm, 'YYYYMMDD').format('YYYY-MM-DD'),
        end:   moment(s.endDtm,   'YYYYMMDD').format('YYYY-MM-DD'),
        id:    `${s.contentId}/${s.contentGrpId}`,
      })),
    );
  }, [schedules]);

  // ── 선택 상태 → active 클래스 토글 ───────────────────
  const addActive    = (c: CalEventItem) => ({ ...c, className: `${c.className} active` });
  const removeActive = (c: CalEventItem) => ({
    ...c,
    className: c.className.includes('active')
      ? c.className.replace('active', '').trim()
      : c.className,
  });

  const setActive = (
    newActiveCal: CalEventItem,
    sameGroupScheds: ScheItem[],
    clickedSche: ScheItem,
    grpId: string,
  ) => {
    // 그룹 내 만료되지 않은 이벤트가 있으면 EDIT, 없으면 READ
    const hasNonExpired = calEvents.some(
      (c) => c.id.split('/')[1] === grpId && !c.className.includes('disable'),
    );
    setScheMode(hasNonExpired ? SCHE_MODE.EDIT : SCHE_MODE.READ);

    setActiveCal(newActiveCal);
    setActiveSche({
      ...clickedSche,
      startDtm: sameGroupScheds[0].startDtm,
      endDtm:   sameGroupScheds[sameGroupScheds.length - 1].endDtm,
    });

    // 달력 이벤트 active 클래스 재구성
    setCalEvents((prev) =>
      prev.map((c) => (c.id.split('/')[1] === grpId ? addActive(c) : removeActive(c))),
    );
  };

  const clearActive = () => {
    setScheMode(SCHE_MODE.DEFAULT);
    setActiveCal(null);
    setActiveSche(null);
    setCalEvents((prev) => prev.map(removeActive));
  };

  const handleCal = (arg: EventClickArg) => {
    const [scheId, grpId] = arg.event.id.split('/');
    const sameGroupCals   = calEvents.filter((c) => c.id.split('/')[1] === grpId);
    const clickedCal      = sameGroupCals.find((c) => c.id.split('/')[0] === scheId)!;
    const sameGroupScheds = schedules.filter((s) => s.contentGrpId === grpId);
    const clickedSche     = sameGroupScheds.find((s) => s.contentId === scheId)!;

    if (activeCal && activeCal.id.split('/')[1] === grpId) {
      clearActive();
    } else {
      setActive(clickedCal, sameGroupScheds, clickedSche, grpId);
    }
  };

  return (
    <StyledScheCalendar>
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        dayMaxEventRows={2}
        headerToolbar={{ left: 'prev', center: 'title', right: 'next' }}
        locale="ko"
        dayPopoverFormat={{ day: 'numeric' }}
        weekends
        editable
        initialView="dayGridMonth"
        dayCellContent={(e) => e.dayNumberText.split('일')[0]}
        events={calEvents}
        eventClick={handleCal}
      />
    </StyledScheCalendar>
  );
};

export default ScheCalendar;

const StyledScheCalendar = styled.div`
  width: 666px;
  height: 780px;
`;
