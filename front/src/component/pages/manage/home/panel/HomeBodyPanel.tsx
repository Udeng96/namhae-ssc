import { useEffect, useState } from 'react';
import styled, { css } from 'styled-components';
import { useShallow } from 'zustand/react/shallow';
import { useHomeStore } from '../../../../stores/homeStore';
import { useCommonStore } from '../../../../stores/commonStore';
import { ScFacType } from '../../../../types/fac';
import { NAMHAE_ORDER, NAMHAE_PANEL } from '../../../../constants/homeConst';
import { ANI_KEYFRAME } from '../../../../lib/animations';
import { ZnType } from '../../../../types/common';
import PanelHead from './PanelHead';
import PanelBody from './PanelBody';

const HomeBodyPanel = () => {
  const { hoverArea, setHoverArea, setSelectArea } = useHomeStore(
    useShallow((s) => ({
      hoverArea: s.hoverArea,
      setHoverArea: s.actions.setHoverArea,
      setSelectArea: s.actions.setSelectArea,
    })),
  );

  const areaList = useCommonStore((s) => s.areaRoles);
  const scFacs = useHomeStore((s) => s.scFacs);

  // scFacs로 지역별 카운트 계산 (topAreaId === areaCd 매핑)
  const getEventCounts = (areaCd: string) => {
    const facsInArea = scFacs.filter((f: ScFacType) => f.topAreaId === areaCd);
    return {
      sitCnt: facsInArea.filter((f: ScFacType) => f.todaySitEvet > 0).length,
      statusCnt: facsInArea.filter((f: ScFacType) => f.todayStatusEvet > 0).length,
    };
  };

  const [sortedList, setSortedList] = useState<ZnType[]>([]);
  const [isAni, setIsAni] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (areaList.length > 0) {
      setSortedList(
        areaList
          .filter((a) => a.active)
          .slice()
          .sort((a, b) => NAMHAE_ORDER.indexOf(a.znCd) - NAMHAE_ORDER.indexOf(b.znCd)),
      );
    } else {
      setSortedList([]);
    }
  }, [areaList]);

  useEffect(() => {
    if (sortedList.length > 0) setIsAni(true);
  }, [sortedList]);

  useEffect(() => {
    if (!isAni) return;
    const timer = setTimeout(() => {
      setHoverArea('402');
      setIsAni(false);
      setReady(true);
    }, 2300);
    return () => clearTimeout(timer);
  }, [isAni, setHoverArea]);

  if (!isAni && !ready) return null;

  return (
    <>
      {sortedList.map((area, idx) => (
        <StyledPanel
          key={`panel_${area.znCd}`}
          $left={NAMHAE_PANEL[area.znCd].left}
          $top={NAMHAE_PANEL[area.znCd].top}
          $isAni={isAni}
          $delay={250 + idx * 100}
          onMouseOver={() => setHoverArea(area.znCd)}
          onMouseLeave={() => setHoverArea('')}
          onClick={() => setSelectArea(area.znCd)}
        >
          <StyledPanelBox $isAni={isAni} $isFocus={hoverArea === area.znCd}>
            <PanelHead znNm={area.znNm} facCnt={area.scCnt} />
            <PanelBody
              eventCnt={scFacs.length > 0 ? getEventCounts(area.areaCd).sitCnt : area.todaySitCnt}
              facEventCnt={scFacs.length > 0 ? getEventCounts(area.areaCd).statusCnt : area.todayStatusCnt}
            />
          </StyledPanelBox>
        </StyledPanel>
      ))}

      {sortedList.map((area) => (
        <StyledPanelBack
          key={`back_${area.znCd}`}
          $isFocus={area.znCd === hoverArea}
          $backImg={NAMHAE_PANEL[area.znCd].back}
        />
      ))}
    </>
  );
};

export default HomeBodyPanel;

const StyledPanel = styled.div<{ $top: string; $left: string; $isAni: boolean; $delay: number }>`
  position: absolute;
  overflow: hidden;
  padding: 20px 30px 40px;
  transform: translate(-30px, -20px);
  top: ${({ $top }) => $top};
  left: ${({ $left }) => $left};
  z-index: 2;

  div {
    animation: ${({ $isAni, $delay }) =>
      $isAni
        ? css`${ANI_KEYFRAME.HOME.MAP.PANEL} 575ms ${$delay}ms cubic-bezier(0,0,0,1.4) forwards`
        : 'none'};
  }
`;

const StyledPanelBox = styled.div<{ $isAni: boolean; $isFocus: boolean }>`
  width: 212px;
  padding: 22px 20px;
  border-radius: 16px;
  border: 1px solid
    ${({ $isFocus }) =>
      $isFocus ? 'rgba(240,241,255,0.9)' : 'rgba(240,241,255,0.4)'};
  background: ${({ $isFocus }) =>
    $isFocus
      ? 'linear-gradient(180deg,rgba(100,73,252,0.9) 0%,rgba(41,17,97,0.9) 100%)'
      : 'linear-gradient(180deg,rgba(27,30,37,0.9) 0%,rgba(20,28,51,0.9) 100%)'};
  box-shadow: ${({ $isFocus }) =>
    $isFocus
      ? '0px 14px 28px 0px rgba(108,85,220,0.21),0px 7px 14px 0px rgba(212,206,242,0.28)'
      : '0px 14px 28px 0px rgba(0,0,0,0.21),0px 7px 14px 0px rgba(0,0,0,0.28)'};
  cursor: pointer;
  transform: ${({ $isAni }) => ($isAni ? 'translateY(90%)' : 'translateX(0)')};
  opacity: ${({ $isAni }) => ($isAni ? '0' : '1')};
  outline: ${({ $isFocus }) =>
    $isFocus ? 'solid 0.5px rgba(240,241,255,0.9)' : 'none'};
`;

const StyledPanelBack = styled.div<{ $isFocus: boolean; $backImg: string }>`
  position: absolute;
  width: 100%;
  height: 100%;
  opacity: ${({ $isFocus }) => ($isFocus ? '1' : '0')};
  visibility: ${({ $isFocus }) => ($isFocus ? 'visible' : 'hidden')};
  transition: visibility 450ms, opacity 450ms;
  background: url('${({ $backImg }) => $backImg}') no-repeat center;
  z-index: 1;
  top: -24px;
`;
