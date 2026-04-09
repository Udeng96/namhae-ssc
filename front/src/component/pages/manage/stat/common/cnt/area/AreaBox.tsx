import styled from 'styled-components';
import { useShallow } from 'zustand/react/shallow';
import { STAT_IMAGE } from '@/component/lib/statImage';
import { STAT_TYPE } from '@/component/constants/statConst';
import { useStatStore } from '@/component/stores/statStore';
import { ZnType } from '@/component/types/common';

interface Props {
  area: ZnType;
}

const AreaBox = ({ area }: Props) => {
  const { activeTab, activeArea, hoverArea, setActiveArea, setHoverArea } = useStatStore(
    useShallow((s) => ({
      activeTab:    s.activeTab,
      activeArea:   s.activeArea,
      hoverArea:    s.hoverArea,
      setActiveArea: s.actions.setActiveArea,
      setHoverArea:  s.actions.setHoverArea,
    })),
  );

  const isUsage    = activeTab === STAT_TYPE.USAGE.id;
  const isActive   = !!activeArea && activeArea.znCd === area.znCd;
  const isHover    = !!hoverArea  && hoverArea.znCd  === area.znCd;

  if (!area.active) {
    return (
      <StyledDisabledBox>
        <StyledDisabledBtn>
          <StyledNm>{area.znNm}</StyledNm>
          <StyledCntArea><i /><p>0</p></StyledCntArea>
          <StyledCntArea><i /><p>0</p></StyledCntArea>
        </StyledDisabledBtn>
      </StyledDisabledBox>
    );
  }

  if (isUsage) {
    return (
      <StyledDisabledBox>
        <StyledBtn>
          <StyledNm>{area.znNm}</StyledNm>
          <StyledCntArea><i /><p>{area.scCnt}</p></StyledCntArea>
          <StyledCntArea><i /><p>{area.facCnt}</p></StyledCntArea>
        </StyledBtn>
      </StyledDisabledBox>
    );
  }

  return (
    <StyledBox
      $isActive={isActive}
      $isHover={isHover}
      onClick={() => setActiveArea(area)}
      onMouseOver={() => setHoverArea(area)}
      onMouseLeave={() => setHoverArea(null)}
    >
      <StyledBtn>
        <StyledNm>{area.znNm}</StyledNm>
        <StyledCntArea><i /><p>{area.scCnt}</p></StyledCntArea>
        <StyledCntArea><i /><p>{area.facCnt}</p></StyledCntArea>
      </StyledBtn>
    </StyledBox>
  );
};

export default AreaBox;

const StyledBox = styled.li<{ $isActive: boolean; $isHover: boolean }>`
  position: relative;
  width: 350px;
  height: 70px;
  border-radius: 14px;
  border: 1px solid ${({ $isActive, $isHover }) => $isActive ? '#7A45FF' : $isHover ? '#4B4E73' : '#262A4D'};
  background: ${({ $isActive, $isHover }) => $isActive ? '#261E5D' : $isHover ? '#262A4D' : '#191D36'};
  cursor: pointer;
`;

const StyledDisabledBox = styled.li`
  position: relative;
  width: 350px;
  height: 70px;
  border-radius: 14px;
  border: 1px solid #262A4D;
  background: #191D36;
  opacity: 0.3;
  pointer-events: none;
`;

const StyledBtn = styled.button`
  display: flex;
  align-items: center;
  gap: 0 7px;
  width: 100%;
  height: 100%;
  padding: 0 24px 0 40px;
  cursor: pointer;

  &::after {
    content: '';
    display: inline-block;
    position: absolute;
    top: 50%;
    right: 24px;
    transform: translateY(-50%);
    width: 22px;
    height: 22px;
    background: url(${STAT_IMAGE.CNT.AREA.ARROW}) no-repeat center / 100%;
  }
`;

const StyledDisabledBtn = styled.button`
  display: flex;
  align-items: center;
  gap: 0 7px;
  width: 100%;
  height: 100%;
  padding: 0 24px 0 40px;
`;

const StyledNm = styled.div`
  display: flex;
  width: 50px;
  justify-content: center;
  margin-right: 33px;
  align-items: center;
  font-size: 18px;
  font-weight: 500;
  color: #FFF;
`;

const StyledCntArea = styled.div`
  display: flex;
  align-items: center;
  font-size: 18px;
  font-weight: 500;
  color: #FFF;

  i {
    display: inline-block;
    width: 20px;
    height: 20px;
    margin-right: 9px;
    background: url(${STAT_IMAGE.CNT.AREA.SC}) no-repeat center / 100%;
  }

  p { width: 54px; text-align: left; }

  &:last-child i {
    background: url(${STAT_IMAGE.CNT.AREA.FAC}) no-repeat center / 100%;
  }
`;
