import styled from 'styled-components';
import { useEffect, useState } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { STAT_IMAGE } from '@/component/lib/statImage';
import { STAT_AREA_NAMHAE, STAT_NORM_MAP, STAT_TYPE } from '@/component/constants/statConst';
import { useStatStore } from '@/component/stores/statStore';
import { useCommonStore } from '@/component/stores/commonStore';
import { GisStatType } from '@/component/types/stat';
import EventPoi    from '@/component/pages/manage/stat/hist/gis/poi/main/EventPoi';
import FacPoi      from '@/component/pages/manage/stat/hist/gis/poi/main/FacPoi';
import OperPoi     from '@/component/pages/manage/stat/hist/gis/poi/main/OperPoi';
import SubEventPoi from '@/component/pages/manage/stat/hist/gis/poi/sub/SubEventPoi';
import SubFacPoi   from '@/component/pages/manage/stat/hist/gis/poi/sub/SubFacPoi';
import SubOperPoi  from '@/component/pages/manage/stat/hist/gis/poi/sub/SubOperPoi';
import EventLegend from '@/component/pages/manage/stat/hist/gis/legend/EventLegend';
import FacLegend   from '@/component/pages/manage/stat/hist/gis/legend/FacLegend';
import OperLegend  from '@/component/pages/manage/stat/hist/gis/legend/OperLegend';

const GisArea = () => {
  const areaRoles = useCommonStore((s) => s.areaRoles);

  const {
    activeTab, activeArea, setActiveArea,
    subEvent, subFac, subOper,
  } = useStatStore(
    useShallow((s) => ({
      activeTab:    s.activeTab,
      activeArea:   s.activeArea,
      setActiveArea: s.actions.setActiveArea,
      subEvent:     s.subEvent,
      subFac:       s.subFac,
      subOper:      s.subOper,
    })),
  );

  const [activeMap, setActiveMap] = useState<string>(STAT_IMAGE.GIS.BACK.NORM.ALL);
  const [activeSc, setActiveSc]   = useState<{ nm: string; top: string; left: string }[]>([]);

  // 지역별 배경 맵 및 경로당 목록
  useEffect(() => {
    if (activeArea) {
      setActiveMap(STAT_NORM_MAP[activeArea.znCd] ?? STAT_IMAGE.GIS.BACK.NORM.ALL);
      setActiveSc(STAT_AREA_NAMHAE[activeArea.znCd]?.scList ?? []);
    } else {
      setActiveMap(STAT_IMAGE.GIS.BACK.NORM.ALL);
      setActiveSc([]);
    }
  }, [activeArea]);

  // sub 데이터 (Record 기반 O(1))
  const subEventResult = activeArea ? (subEvent[activeArea.znCd] ?? null) : null;
  const subFacResult   = activeArea ? (subFac[activeArea.znCd]   ?? null) : null;
  const subOperResult  = activeArea ? (subOper[activeArea.areaCd] ?? null) : null;

  const subEventGis: GisStatType[] = subEventResult?.gisStats ?? [];
  const subFacGis:   GisStatType[] = subFacResult?.gisStats   ?? [];
  const subOperGis:  GisStatType[] = subOperResult?.gisStats   ?? [];
  const subEventCnt  = subEventResult?.allCnt ?? 0;
  const subFacCnt    = subFacResult?.allCnt   ?? 0;
  const subOperCnt   = subOperResult?.allCnt  ?? 0;

  return (
    <StyledGisArea>
      <StyledGisMap $back={activeMap}>
        <StyledMapTitle>{activeArea?.znNm ?? ''}</StyledMapTitle>

        {activeArea !== null && (
          <StyledHomeBtn onClick={() => setActiveArea(null)}>
            <i />전체 지도로 돌아가기
          </StyledHomeBtn>
        )}

        {/* 전체 지도: 읍면 POI */}
        {activeArea === null && (
          <>
            {activeTab === STAT_TYPE.EVENT.id && areaRoles.map((area, i) =>
              area.active && (
                <EventPoi key={i} area={area}
                  top={STAT_AREA_NAMHAE[area.znCd]?.top ?? '0'}
                  left={STAT_AREA_NAMHAE[area.znCd]?.left ?? '0'}
                  hoverTop={STAT_AREA_NAMHAE[area.znCd]?.hoverTop ?? '0'}
                  hoverLeft={STAT_AREA_NAMHAE[area.znCd]?.hoverLeft ?? '0'}
                />
              ),
            )}
            {activeTab === STAT_TYPE.FAC.id && areaRoles.map((area, i) =>
              area.active && (
                <FacPoi key={i} area={area}
                  top={STAT_AREA_NAMHAE[area.znCd]?.top ?? '0'}
                  left={STAT_AREA_NAMHAE[area.znCd]?.left ?? '0'}
                  hoverTop={STAT_AREA_NAMHAE[area.znCd]?.hoverTop ?? '0'}
                  hoverLeft={STAT_AREA_NAMHAE[area.znCd]?.hoverLeft ?? '0'}
                />
              ),
            )}
            {activeTab === STAT_TYPE.OPERATE.id && areaRoles.map((area, i) =>
              area.active && (
                <OperPoi key={i} area={area}
                  top={STAT_AREA_NAMHAE[area.znCd]?.top ?? '0'}
                  left={STAT_AREA_NAMHAE[area.znCd]?.left ?? '0'}
                  hoverTop={STAT_AREA_NAMHAE[area.znCd]?.hoverTop ?? '0'}
                  hoverLeft={STAT_AREA_NAMHAE[area.znCd]?.hoverLeft ?? '0'}
                />
              ),
            )}
          </>
        )}

        {/* 상세 지도: 경로당 POI */}
        {activeArea !== null && activeSc.length > 0 && (
          <>
            {activeTab === STAT_TYPE.EVENT.id && activeSc.map((sc, i) => (
              <SubEventPoi key={i} area={activeArea} top={sc.top} left={sc.left} nm={sc.nm}
                allCnt={subEventCnt} gisStatInfos={subEventGis} />
            ))}
            {activeTab === STAT_TYPE.FAC.id && activeSc.map((sc, i) => (
              <SubFacPoi key={i} area={activeArea} top={sc.top} left={sc.left} nm={sc.nm}
                allCnt={subFacCnt} gisStatInfos={subFacGis} />
            ))}
            {activeTab === STAT_TYPE.OPERATE.id && activeSc.map((sc, i) => (
              <SubOperPoi key={i} area={activeArea} top={sc.top} left={sc.left} nm={sc.nm}
                allCnt={subOperCnt} gisStatInfos={subOperGis} />
            ))}
          </>
        )}
      </StyledGisMap>

      {activeTab === STAT_TYPE.EVENT.id   && <EventLegend />}
      {activeTab === STAT_TYPE.FAC.id     && <FacLegend />}
      {activeTab === STAT_TYPE.OPERATE.id && <OperLegend />}
    </StyledGisArea>
  );
};

export default GisArea;

const StyledGisArea = styled.div`
  position: relative;
  width: 708px;
  height: 822px;
  margin-top: 95px;
`;

const StyledGisMap = styled.div<{ $back: string }>`
  width: 100%;
  height: 100%;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: url('${({ $back }) => $back}') no-repeat center;
`;

const StyledMapTitle = styled.div`
  display: flex;
  align-items: center;
  position: absolute;
  bottom: calc(100% + 10px);
  left: 50%;
  transform: translateX(-50%);
  font-size: 28px;
  font-weight: 700;
  color: #FFF;
`;

const StyledHomeBtn = styled.button`
  position: absolute;
  bottom: calc(100% + 10px);
  left: -49px;
  font-size: 16px;
  font-weight: 500;
  color: #C8CBE8;
  display: flex;
  align-items: center;

  i {
    display: inline-block;
    width: 24px;
    height: 24px;
    margin-right: 8px;
    background: url('${STAT_IMAGE.GIS.HOME.NORM}') no-repeat center / 100%;
  }

  &:hover {
    color: #FFF;
    i { background-image: url('${STAT_IMAGE.GIS.HOME.HOVER}'); }
  }
`;
