import styled from 'styled-components';
import { FAC_IMAGE } from '@/component/lib/facImage';

interface Props { settop1: string; settop2: string; }

const FacStateSettop = ({ settop1, settop2 }: Props) => {
  const isNorm = settop1 === '00' && settop2 === '00';
  return (
    <StyledWide $isNorm={isNorm}>
      <StyledWideBox $isNorm={isNorm}>
        <h3>셋톱 박스</h3>
        <div>{isNorm ? '정상' : '고장'}</div>
        <StyledIcon />
      </StyledWideBox>
      <StyledSensors>
        <StyledSensorBox $isNorm={settop1 === '00'}>
          <h3>화상회의 장비</h3>
          <StyledState $isNorm={settop1 === '00'}>{settop1 === '00' ? '정상' : '고장'}</StyledState>
        </StyledSensorBox>
        <StyledSensorBox $isNorm={settop2 === '00'}>
          <h3>정보표출 모니터</h3>
          <StyledState $isNorm={settop2 === '00'}>{settop2 === '00' ? '정상' : '고장'}</StyledState>
        </StyledSensorBox>
      </StyledSensors>
    </StyledWide>
  );
};

export default FacStateSettop;

const StyledWide = styled.div<{ $isNorm: boolean }>`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 0 24px;
  height: 74px;
  padding: 14px 8px 14px 14px;
  border-radius: 10px;
  background: url('${({ $isNorm }) =>
    $isNorm ? FAC_IMAGE.STATE.BACK.WIDE.NORM : FAC_IMAGE.STATE.BACK.WIDE.ERROR}') no-repeat center / 100%;
`;

const StyledWideBox = styled.div<{ $isNorm: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 14px 0;
  position: relative;
  width: 122px;
  h3 { font-size: 15px; font-weight: 500; color: #fff; }
  div { font-size: 17px; font-weight: 700; color: ${({ $isNorm }) => ($isNorm ? '#37c6ed' : '#f73942')}; }
`;

const StyledIcon = styled.i`
  background: url(${FAC_IMAGE.STATE.SENSOR.SETTOP}) no-repeat center / 100%;
  display: block;
  position: absolute;
  top: 50%;
  right: -3px;
  transform: translateY(-50%);
  width: 58px;
  height: 64px;
`;

const StyledSensors = styled.div`
  display: flex;
  align-items: center;
  flex: 1;
  gap: 0 6px;
`;

const StyledSensorBox = styled.div<{ $isNorm: boolean }>`
  width: 100%;
  padding: 12px 10px;
  border-radius: 6px;
  background: ${({ $isNorm }) =>
    $isNorm
      ? 'linear-gradient(180deg, rgba(55,198,237,0.15) 0%, rgba(55,198,237,0.04) 100%)'
      : 'linear-gradient(180deg, rgba(247,57,66,0.15) 0%, rgba(247,57,66,0.04) 100%)'};
  h3 { font-size: 14px; font-weight: 400; color: #fff; }
`;

const StyledState = styled.div<{ $isNorm: boolean }>`
  display: flex;
  align-items: center;
  margin-top: 6px;
  font-size: 15px;
  font-weight: 500;
  color: ${({ $isNorm }) => ($isNorm ? '#37c6ed' : '#f73942')};
  &:before {
    content: '';
    display: inline-block;
    width: 16px;
    height: 16px;
    margin-right: 5px;
    background-image: url('${({ $isNorm }) =>
      $isNorm ? FAC_IMAGE.STATE.ICON.NORM : FAC_IMAGE.STATE.ICON.ERROR}');
  }
`;
