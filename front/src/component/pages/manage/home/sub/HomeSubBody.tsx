import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useShallow } from 'zustand/react/shallow';
import moment from 'moment';
import { useHomeStore } from '../../../../stores/homeStore';
import { useCommonStore } from '../../../../stores/commonStore';
import { useEventStore } from '../../../../stores/eventStore';
import { NAMHAE_PANEL } from '../../../../constants/homeConst';
import { HOME_MAP } from '../../../../lib/homeImage';
import { ScFacType } from '../../../../types/fac';
import { EventResultItem } from '../../../../types/event';
import SubPanel from './panel/SubPanel';
import EventSubPanel from './panel/EventSubPanel';

// ─── 헬퍼: 센서 상태 배열 계산 [비상벨, 화재, 셋톱, CCTV] ──
const computeSensorStates = (fac: ScFacType): string[] => {
  const ok = (v: string) => v === '00';
  const bell   = ok(fac.bell);
  const fire   = ok(fac.fire);
  const settop = ok(fac.settop1) && ok(fac.settop2);
  const cctv   =
    (ok(fac.cctvT) || fac.cctvT === 'none') &&
    (ok(fac.cctvL) || fac.cctvL === 'none') &&
    ok(fac.cctvB) && ok(fac.cctvK);
  return [
    bell   ? '정상' : '고장',
    fire   ? '정상' : '고장',
    settop ? '정상' : '고장',
    cctv   ? '정상' : '고장',
  ];
};

// ─── 헬퍼: 모든 센서 정상 + 오늘 상황이벤트 없음 여부 ──────
const isAllNormal = (fac: ScFacType): boolean => {
  const ok = (v: string) => v === '00';
  return (
    ok(fac.bell) &&
    ok(fac.fire) &&
    ok(fac.settop1) && ok(fac.settop2) &&
    (ok(fac.cctvT) || fac.cctvT === 'none') &&
    (ok(fac.cctvL) || fac.cctvL === 'none') &&
    ok(fac.cctvB) && ok(fac.cctvK) &&
    fac.todayStatusEvet === 0
  );
};

const HomeSubBody = () => {
  const areaRoles = useCommonStore((s) => s.areaRoles);

  const { selectArea, selectSc, setSelectSc, scFacs } = useHomeStore(
    useShallow((s) => ({
      selectArea: s.selectArea,
      selectSc:   s.selectSc,
      setSelectSc: s.actions.setSelectSc,
      scFacs:     s.scFacs,
    })),
  );

  // 리팩토링: eventResult.eventList → eventList (직접 접근)
  const eventList = useEventStore((s) => s.eventList);

  const [iconList, setIconList]       = useState<{ nm: string; top: string; left: string }[]>([]);
  const [facs, setFacs]               = useState<ScFacType[]>([]);
  const [displayIndex, setDisplayIndex] = useState(0);
  const [showIndexList, setShowIndexList] = useState<number[]>([]);
  const [isReset, setIsReset]         = useState(false);
  const [todayEvents, setTodayEvents] = useState<EventResultItem[]>([]);
  const [sensorState, setSensorState] = useState<string[]>(['정상', '정상', '정상', '정상']);

  // 지역 변경 시 전체 초기화
  useEffect(() => {
    setIsReset(false);
    setShowIndexList([]);
    setDisplayIndex(0);
    setIconList([]);
    setFacs([]);
    if (selectArea === 'all') {
      setTodayEvents([]);
      setSensorState(['정상', '정상', '정상', '정상']);
    }
  }, [selectArea]);

  // 지역/경로당 선택 시 아이콘 목록 업데이트
  useEffect(() => {
    if (isReset) return;
    setIconList(selectArea !== 'all' ? NAMHAE_PANEL[selectArea].subScList : []);
  }, [isReset, selectArea]);

  // iconList → scFacs 매칭 (iconList 순서 유지)
  useEffect(() => {
    if (iconList.length === 0) {
      setFacs([]);
      return;
    }
    if (scFacs.length === 0) return;
    const ordered = iconList
      .map((icon) => scFacs.find((f) => f.facNm === icon.nm))
      .filter((f): f is ScFacType => !!f);
    setFacs(ordered);
  }, [iconList, scFacs]);

  // facs 준비 완료 → 100ms 후 애니메이션 시작
  useEffect(() => {
    if (facs.length === 0) return;
    const t = setTimeout(() => setIsReset(true), 100);
    return () => clearTimeout(t);
  }, [facs]);

  // 경로당 아이콘 하나씩 순차 표출 (40ms 간격)
  useEffect(() => {
    if (!isReset || displayIndex >= iconList.length) return;
    const t = setTimeout(() => {
      setShowIndexList((prev) => [...prev, displayIndex]);
      setDisplayIndex((d) => d + 1);
    }, 40);
    return () => clearTimeout(t);
  }, [displayIndex, isReset, iconList.length]);

  // 선택된 경로당의 오늘 이벤트 필터링
  useEffect(() => {
    if (!selectSc || scFacs.length === 0 || selectArea === 'all') return;
    const topArea = areaRoles.find((a) => a.znCd === selectArea);
    if (!topArea) return;
    const matched = scFacs.find(
      (f) => f.facNm === selectSc && f.topAreaId === topArea.areaCd,
    );
    if (!matched) return;
    const todayDtm = moment().format('YYYYMMDD');
    setTodayEvents(
      eventList.filter(
        (ev) =>
          ev.outbPlac === matched.mgtNo &&
          ev.outbDtm.substring(0, 8) === todayDtm,
      ),
    );
  }, [eventList, selectSc, scFacs, selectArea, areaRoles]);

  // 선택된 경로당 센서 상태 업데이트
  useEffect(() => {
    if (!selectSc || facs.length === 0) return;
    const fac = facs.find((f) => f.facNm === selectSc);
    if (fac) setSensorState(computeSensorStates(fac));
  }, [selectSc, facs]);

  if (iconList.length === 0) return null;

  return (
    <StyledHomeSub
      $isActive={isReset}
      $backImg={NAMHAE_PANEL[selectArea]?.subBack ?? ''}
    >
      <StyledScArea>
        {facs.map((fac, index) => {
          const visible =
            isReset &&
            (displayIndex === index || showIndexList.includes(index));
          const isSelected = selectSc === fac.facNm;
          const pos = iconList[index];

          return (
            <StyledScWrap key={fac.facNm} $top={pos.top} $left={pos.left}>
              <StyledScNm
                $isActive={isSelected}
                $isAni={visible}
                onClick={() => setSelectSc(fac.facNm)}
              >
                {fac.facNm}
              </StyledScNm>
              <StyledScIcon
                $backImg={
                  fac.todaySitEvet === 0
                    ? HOME_MAP.SUB.ICON.NORMAL
                    : HOME_MAP.SUB.ICON.ERROR
                }
                $isNormal={isAllNormal(fac)}
                $isAni={visible}
              />

              {isSelected && fac.todaySitEvet !== 0 && (
                <EventSubPanel
                  nm={fac.facNm}
                  isActive
                  todayEvents={todayEvents}
                  sensorStates={sensorState}
                />
              )}
              {isSelected && fac.todaySitEvet === 0 && (
                <SubPanel
                  nm={fac.facNm}
                  sensorStates={sensorState}
                />
              )}
            </StyledScWrap>
          );
        })}
      </StyledScArea>
    </StyledHomeSub>
  );
};

export default HomeSubBody;

const StyledHomeSub = styled.div<{ $isActive: boolean; $backImg: string }>`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  visibility: ${({ $isActive }) => ($isActive ? 'visible' : 'hidden')};
  opacity: ${({ $isActive }) => ($isActive ? '1' : '0')};
  transition: all 200ms ease-in-out;
  background: url('${({ $backImg }) => $backImg}') no-repeat;
`;

const StyledScArea = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
`;

const StyledScWrap = styled.div<{ $top: string; $left: string }>`
  display: inline-block;
  position: absolute;
  top: ${({ $top }) => $top};
  left: ${({ $left }) => $left};
`;

const StyledScNm = styled.div<{ $isActive: boolean; $isAni: boolean }>`
  position: relative;
  padding: 3px 7px;
  font-size: 14px;
  font-weight: 500;
  color: #fff;
  text-shadow: 0px 0px 4px rgba(0, 0, 0, 0.24);
  border-radius: 11px;
  background-color: rgba(6, 9, 28, 0.5);
  cursor: pointer;
  user-select: none;
  z-index: 1;
  transition: ${({ $isAni }) => ($isAni ? 'all 180ms ease-in' : 'none')};
  opacity: ${({ $isAni }) => ($isAni ? '1' : '0')};
  transform: ${({ $isAni }) => ($isAni ? 'translateY(0)' : 'translateY(10px)')};
  border: 1px solid ${({ $isActive }) => ($isActive ? '#BCA6FF' : 'transparent')};
  background: ${({ $isActive }) =>
    $isActive ? '#7A45FF' : 'rgba(6,9,28,0.5)'};

  &:hover {
    color: ${({ $isActive }) => ($isActive ? '#fff' : '#06091C')};
    text-shadow: none;
    background-color: ${({ $isActive }) =>
      $isActive ? '#7A45FF' : 'rgba(255,255,255,0.9)'};
  }
`;

const StyledScIcon = styled.div<{
  $backImg: string;
  $isNormal: boolean;
  $isAni: boolean;
}>`
  position: relative;
  left: 50%;
  transform: translateX(-50%);
  width: ${({ $isAni }) => ($isAni ? '28px' : '0')};
  height: 28px;
  background: url('${({ $backImg }) => $backImg}') no-repeat center / 100%;
  transition: ${({ $isAni }) => ($isAni ? 'all 350ms ease-in' : 'none')};

  &::before {
    content: '';
    display: ${({ $isNormal }) => ($isNormal ? 'none' : 'inline-block')};
    position: absolute;
    right: 0;
    width: ${({ $isAni }) => ($isAni ? '7px' : '0')};
    height: 7px;
    border-radius: 50%;
    border: solid 1px #fff;
    transition: ${({ $isAni }) => ($isAni ? 'all 350ms ease-in' : 'none')};
    background-color: #ff474f;
  }
`;
