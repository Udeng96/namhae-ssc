import styled from 'styled-components';
import { HOME_MAP } from '../../../../../lib/homeImage';
import { SensorPanelItem } from '../../../../../constants/homeConst';

interface Props {
  sensor: SensorPanelItem;
  state: string;
}

const SubPanelItem = ({ sensor, state }: Props) => {
  const isNormal = state === '정상';

  return (
    <StyledItem>
      <StyledSensorWrap $margin={sensor.margin}>
        <StyledSensorIcon $backImg={sensor.icon} />
        <StyledSensorNm>{sensor.nm}</StyledSensorNm>
      </StyledSensorWrap>
      <StyledState>
        <StyledStateIcon
          $icon={isNormal ? HOME_MAP.SUB.PANEL.STATE.NORMAL : HOME_MAP.SUB.PANEL.STATE.ERROR}
        />
        <StyledStateNm>{state}</StyledStateNm>
      </StyledState>
    </StyledItem>
  );
};

export default SubPanelItem;

const StyledItem = styled.div`
  width: 182px;
  height: 28px;
  border-radius: 4px;
  display: flex;
  padding: 5px 0 5px 10px;
  gap: 2px;
`;

const StyledSensorWrap = styled.div<{ $margin: string }>`
  width: auto;
  height: 100%;
  display: flex;
  gap: 6px;
  align-items: center;
  margin-right: ${({ $margin }) => $margin};
`;

const StyledSensorIcon = styled.div<{ $backImg: string }>`
  width: 18px;
  height: 18px;
  background: url('${({ $backImg }) => $backImg}') no-repeat center / 100%;
`;

const StyledSensorNm = styled.div`
  font-size: 13px;
  font-weight: 400;
  color: #fff;
  display: flex;
  align-items: center;
`;

const StyledState = styled.div`
  width: auto;
  height: 100%;
  display: flex;
  gap: 6px;
  align-items: center;
`;

const StyledStateIcon = styled.div<{ $icon: string }>`
  width: 18px;
  height: 18px;
  background: url('${({ $icon }) => $icon}') no-repeat center / 100%;
`;

const StyledStateNm = styled.div`
  font-size: 13px;
  font-weight: 400;
  color: #fff;
  display: flex;
  align-items: center;
`;
