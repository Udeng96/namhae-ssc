import styled from 'styled-components';
import { useShallow } from 'zustand/react/shallow';
import { useHomeStore } from '../../../../../stores/homeStore';
import { useCommonStore } from '../../../../../stores/commonStore';
import { useFacStore } from '../../../../../stores/facStore';
import { NAV_MAP } from '../../../../../constants/nav';
import { NAV_CODE } from '../../../../../constants/nav';
import { HOME_MAP } from '../../../../../lib/homeImage';
import { SENSOR_PANEL_LIST } from '../../../../../constants/homeConst';
import SubPanelItem from './SubPanelItem';

interface Props {
  nm: string;
  sensorStates: string[];
}

const SubPanel = ({ nm, sensorStates }: Props) => {
  const setSelectNav = useCommonStore((s) => s.actions.setSelectNav);

  const { scFacs, selectSc, setSelectSc } = useHomeStore(
    useShallow((s) => ({
      scFacs:     s.scFacs,
      selectSc:   s.selectSc,
      setSelectSc: s.actions.setSelectSc,
    })),
  );

  const setSelectFac = useFacStore((s) => s.actions.setSelectFac);

  const handleMore = () => {
    const fac = scFacs.find((f) => f.facNm === nm);
    if (fac) {
      setSelectFac(fac);
      setSelectNav(NAV_MAP[NAV_CODE.FAC]);
    }
  };

  return (
    <StyledPanel $isActive={selectSc === nm}>
      <StyledClsBtn onClick={() => setSelectSc('')} />
      <StyledBox>
        <StyledContent>
          {SENSOR_PANEL_LIST.map((sensor, i) => (
            <SubPanelItem key={sensor.nm} sensor={sensor} state={sensorStates[i]} />
          ))}
        </StyledContent>
        <StyledMoreBtn onClick={handleMore}>자세히 보기</StyledMoreBtn>
      </StyledBox>
    </StyledPanel>
  );
};

export default SubPanel;

const StyledPanel = styled.div<{ $isActive: boolean }>`
  position: absolute;
  display: ${({ $isActive }) => ($isActive ? 'block' : 'none')};
  width: 198px;
  border-radius: 10px;
  border: 1.5px solid rgba(242, 245, 255, 0.2);
  background: rgba(242, 245, 255, 0.1);
  box-shadow: 0px 14px 16px 0px rgba(0,0,0,0.16), 0px 4px 5px 0px rgba(0,0,0,0.24);
  backdrop-filter: blur(8px);
  padding: 23px 8px 8px;
  left: 53px;
  top: 23px;
  z-index: 100;
`;

const StyledClsBtn = styled.button`
  position: absolute;
  right: 6px;
  top: 6px;
  width: 17px;
  height: 17px;
  background: url('${HOME_MAP.SUB.PANEL.CLOSE_BTN.BASE}') no-repeat center / 60%;

  &:hover {
    background-image: url('${HOME_MAP.SUB.PANEL.CLOSE_BTN.HOVER}');
  }
`;

const StyledBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const StyledContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const StyledMoreBtn = styled.button`
  width: 182px;
  height: 30px;
  border-radius: 6px;
  border: 1px solid rgba(242, 245, 255, 0.2);
  background: rgba(242, 245, 255, 0.2);
  box-shadow: 0px 3px 4px 0px rgba(0,0,0,0.12);
  color: #fff;
  font-size: 13px;

  &:hover {
    border-color: rgba(242, 245, 255, 0.45);
    background: rgba(242, 245, 255, 0.35);
    box-shadow: 0px 5px 7px 0px rgba(0,0,0,0.24);
  }
`;
