import styled from 'styled-components';
import { useState, useEffect, useMemo } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { GIS_IMAGE } from '@/component/lib/constImage';
import { EVENT_HEATMAP_PERIOD_LIST } from '@/component/constants/eventCode';
import { useEventStore } from '@/component/stores/eventStore';
import { useCommonStore } from '@/component/stores/commonStore';
import { fetchEventHeatmap } from '@/component/api/eventApi';
/** "전체" 이벤트 타입 항목 (eventRoles 앞에 항상 표시) — statEvetCd='00' */
const HEATMAP_TYPE_ALL = { key: '00', value: '전체' };

/**
 * 이벤트 GIS 히트맵 버튼
 * - 드롭다운 열림 / 기간·이벤트 타입 변경 시 히트맵 API 호출
 * - 응답 데이터를 eventStore(heatmap, heatmapOn)에 저장
 * - EventHeatmap 컴포넌트가 leaflet.heat 레이어를 실제 렌더/제거
 */
const EventHeatmapBtn = () => {
  const {
    heatmapOn, setHeatmapOn, setHeatmap,
    heatmapDropdownOpen: isOpen, setHeatmapDropdownOpen: setIsOpen,
  } = useEventStore(
    useShallow((s) => ({
      heatmapOn:              s.heatmapOn,
      setHeatmapOn:           s.actions.setHeatmapOn,
      setHeatmap:             s.actions.setHeatmap,
      heatmapDropdownOpen:    s.heatmapDropdownOpen,
      setHeatmapDropdownOpen: s.actions.setHeatmapDropdownOpen,
    })),
  );

  const eventRoles = useCommonStore((s) => s.eventRoles);

  // 이벤트 타입 목록: "전체" + 서버 역할 목록
  const eventTypeList = useMemo(
    () => [HEATMAP_TYPE_ALL, ...eventRoles],
    [eventRoles],
  );

  const [date, setDate] = useState(EVENT_HEATMAP_PERIOD_LIST[0]);
  // 초기값: '00'(전체) — 빈 문자열을 전송하면 서버 500 에러 발생
  const [heatmapType, setHeatmapType] = useState('00');

  // 드롭다운이 닫힐 때(외부 초기화 포함) 기간·이벤트 타입을 전체로 초기화
  useEffect(() => {
    if (!isOpen) {
      setDate(EVENT_HEATMAP_PERIOD_LIST[0]);
      setHeatmapType('00');
    }
  }, [isOpen]);

  // 드롭다운 열림 상태이거나 기간·이벤트 타입이 바뀌면 히트맵 재조회
  useEffect(() => {
    if (!isOpen) return;

    let cancelled = false;
    (async () => {
      try {
        const res = await fetchEventHeatmap({
          startDtm:   date.startDtm,
          endDtm:     date.endDtm,
          statEvetCd: heatmapType,   // '00'=전체, '01'=비상벨, '02'=화재 ...
        });
        if (cancelled) return;
        setHeatmap(res.data ?? []);
        setHeatmapOn(true);
      } catch {
        if (cancelled) return;
        setHeatmap([]);
        setHeatmapOn(false);
      }
    })();

    return () => { cancelled = true; };
  }, [isOpen, date, heatmapType]);

  // 버튼 클릭 → 드롭다운 토글
  const handleToggle = () => setIsOpen(!isOpen);

  // 드롭다운 닫힐 때 heatmap 꺼짐 (date/type 초기화는 useEffect([isOpen])에서 처리)
  const handleClose = () => {
    setIsOpen(false);
    setHeatmapOn(false);
    setHeatmap([]);
  };

  return (
    <StyledHeatmapBtnBox>
      <StyledHeatmapBtn $isActive={isOpen || heatmapOn} onClick={isOpen ? handleClose : handleToggle}>
        <i />
        <span>히트 맵</span>
      </StyledHeatmapBtn>

      <StyledHeatmapOptionBox $isActive={isOpen}>
        <StyledHeatmapOptionArea>
          {/* 기간 설정 */}
          <StyledHeatmapOptionBoxHead>
            <i />
            <span>기간 설정</span>
          </StyledHeatmapOptionBoxHead>
          <StyledHeatmapOptionBoxBody>
            <StyledHeatmapBodyList>
              {EVENT_HEATMAP_PERIOD_LIST.map((item) => (
                <StyledHeatmapBodyItem key={item.cd}>
                  <StyledHeatmapBodyItemLabel>
                    <StyledHeatmapBodyItemInput
                      type="radio"
                      name="heatmapDate"
                      value={item.cd}
                      checked={date.cd === item.cd}
                      onChange={() => setDate(item)}
                    />
                    <span />
                    <p>{item.nm}</p>
                  </StyledHeatmapBodyItemLabel>
                </StyledHeatmapBodyItem>
              ))}
            </StyledHeatmapBodyList>
          </StyledHeatmapOptionBoxBody>

          {/* 이벤트 설정 (전체 + 서버 역할 목록) */}
          <StyledHeatmapOptionBoxHead>
            <i />
            <span>이벤트 설정</span>
          </StyledHeatmapOptionBoxHead>
          <StyledHeatmapOptionEventBoxList>
            {eventTypeList.map((role) => (
              <StyledHeatmapBodyEventItem
                key={role.key}
                $isActive={heatmapType === role.key}
                onClick={() => setHeatmapType(role.key)}
              >
                {role.value}
              </StyledHeatmapBodyEventItem>
            ))}
          </StyledHeatmapOptionEventBoxList>
        </StyledHeatmapOptionArea>
      </StyledHeatmapOptionBox>
    </StyledHeatmapBtnBox>
  );
};

export default EventHeatmapBtn;

// ── Styled (구 heatmapBtn.tsx 스타일과 동일) ────────────────────────────────

const StyledHeatmapBtnBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  position: relative;
  background: none;
  border: none;
`;

const StyledHeatmapBtn = styled.button<{ $isActive: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  width: 98px;
  height: 40px;
  font-weight: 500;
  font-size: 14px;
  border-radius: 8px;
  background: ${({ $isActive }) =>
    $isActive ? 'linear-gradient(180deg, #7F7AFF 0%, #681CEB 100%)' : '#12172E'};
  border: 1px solid ${({ $isActive }) => ($isActive ? '#9C7BFF' : '#090A14')};
  cursor: pointer;
  color: #f2f4fc;

  i {
    display: inline-block;
    width: 18px;
    height: 18px;
    margin-right: 4px;
    background-size: 100%;
    background-image: url('${({ $isActive }) =>
      $isActive ? GIS_IMAGE.TOP.HEATMAP.ACTIVE : GIS_IMAGE.TOP.HEATMAP.BASE}');
  }

  &:hover {
    color: ${({ $isActive }) => ($isActive ? '#F2F4FC' : '#7A45FF')};
    border-color: ${({ $isActive }) => ($isActive ? '#9C7BFF' : '#543FAF')};

    i {
      background-image: url('${({ $isActive }) =>
        $isActive ? GIS_IMAGE.TOP.HEATMAP.ACTIVE : GIS_IMAGE.TOP.HEATMAP.HOVER}');
    }
  }
`;

const StyledHeatmapOptionBox = styled.div<{ $isActive: boolean }>`
  display: ${({ $isActive }) => ($isActive ? 'block' : 'none')};
  background: #1a203a;
  position: absolute;
  top: calc(100% + 3px);
  right: -1px;
  width: 148px;
  border-radius: 10px;
  border: 1px solid #9c7bff;
  box-shadow: 0 10px 20px 0 rgba(0, 0, 0, 0.3);
  overflow: hidden;
  max-height: 400px;
  overflow-y: auto;
  z-index: 1;
`;

const StyledHeatmapOptionArea = styled.div``;

const StyledHeatmapOptionBoxHead = styled.div`
  display: flex;
  align-items: center;
  height: 34px;
  padding: 0 12px;
  color: #9c7bff;
  font-size: 13px;
  background: #12172e;

  i {
    display: inline-block;
    width: 15px;
    height: 15px;
    margin-right: 6px;
    background-size: 100%;
    background-image: url('${GIS_IMAGE.TOP.HEATMAP.DATE}');
  }
`;

const StyledHeatmapOptionBoxBody = styled.div``;

const StyledHeatmapBodyList = styled.ul`
  padding: 15px;
`;

const StyledHeatmapBodyItem = styled.li`
  width: auto;
  cursor: pointer;
  margin-top: 9px;

  &:nth-child(1) {
    margin-top: 0;
  }
`;

const StyledHeatmapBodyItemLabel = styled.label`
  display: flex;
  align-items: center;
  position: relative;
  width: auto;
  height: 12px;
  margin: 0;
  cursor: pointer;

  span {
    position: relative;
    display: inline-block;
    width: 12px;
    height: 12px;
    margin-right: 7px;
    border-radius: 50%;
    border: 1px solid #829099;
    background: #1a203a;

    &:after {
      content: '';
      display: block;
    }
  }

  p {
    font-size: 13px;
    font-weight: 300;
    color: #f2f4fc;
  }
`;

const StyledHeatmapBodyItemInput = styled.input`
  opacity: 0;
  width: 0;
  height: 0;
  position: absolute;

  &:checked ~ span {
    border-color: #7a45ff;
    background: #1a203a;

    &:after {
      position: absolute;
      top: 53%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background-color: #7a45ff;
    }
  }
`;

const StyledHeatmapOptionEventBoxList = styled.ul`
  padding: 12px 8px;
`;

const StyledHeatmapBodyEventItem = styled.li<{ $isActive: boolean }>`
  display: flex;
  align-items: center;
  width: 100%;
  height: 29px;
  padding: 0 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 400;
  cursor: pointer;
  color: #f2f4fc;
  border: solid 1px ${({ $isActive }) => ($isActive ? '#7A45FF' : '#2A2E54')};
  background: ${({ $isActive }) => ($isActive ? '#261E5E' : '#2A2E54')};

  &:hover {
    border-color: ${({ $isActive }) => ($isActive ? '#7A45FF' : '#3E4165')};
    background: ${({ $isActive }) => ($isActive ? '#261E5E' : '#3E4165')};
  }

  + li {
    margin-top: 3px;
  }
`;
