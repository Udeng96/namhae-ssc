import styled from 'styled-components';
import { FAC_IMAGE } from '@/component/lib/facImage';

const FacStateFire = ({ fire }: { fire: string }) => {
  const isNorm = fire === '00';
  return (
    <StyledNarrow $isNorm={isNorm}>
      <StyledBox $isNorm={isNorm}>
        <h3>화재 센서</h3>
        <div>{isNorm ? '정상' : '고장'}</div>
        <StyledIcon />
      </StyledBox>
    </StyledNarrow>
  );
};

export default FacStateFire;

const StyledNarrow = styled.div<{ $isNorm: boolean }>`
  display: flex;
  align-items: center;
  gap: 0 24px;
  width: 49%;
  height: 74px;
  padding: 14px 8px 14px 14px;
  border-radius: 10px;
  background: url('${({ $isNorm }) =>
    $isNorm ? FAC_IMAGE.STATE.BACK.NARROW.NORM : FAC_IMAGE.STATE.BACK.NARROW.ERROR}') no-repeat center / 100%;
`;

const StyledBox = styled.div<{ $isNorm: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 14px 0;
  position: relative;
  width: 100%;
  h3 { font-size: 15px; font-weight: 500; color: #fff; }
  div { font-size: 17px; font-weight: 700; color: ${({ $isNorm }) => ($isNorm ? '#37c6ed' : '#f73942')}; }
`;

const StyledIcon = styled.i`
  background: url(${FAC_IMAGE.STATE.SENSOR.FIRE}) no-repeat center / 100%;
  display: block;
  position: absolute;
  top: 50%;
  right: -3px;
  transform: translateY(-50%);
  width: 58px;
  height: 64px;
`;
