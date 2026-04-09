import styled from 'styled-components';
import { HOME_MAP } from '../../../../lib/homeImage';

interface Props {
  eventCnt: number;
  facEventCnt: number;
}

const PanelBody = ({ eventCnt, facEventCnt }: Props) => {
  return (
    <StyledPanelBody>
      <StyledRow>
        <StyledLabel $isEvent>상황 이벤트</StyledLabel>
        <StyledValue $isEvent>{eventCnt}</StyledValue>
      </StyledRow>
      <StyledRow>
        <StyledLabel $isEvent={false}>시설물 이상 발생</StyledLabel>
        <StyledValue $isEvent={false}>{facEventCnt}</StyledValue>
      </StyledRow>
    </StyledPanelBody>
  );
};

export default PanelBody;

const StyledPanelBody = styled.div`
  margin-top: 14px;
`;

const StyledRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  + div {
    margin-top: 8px;
  }
`;

const StyledLabel = styled.p<{ $isEvent: boolean }>`
  display: flex;
  align-items: center;
  font-size: 14px;
  font-weight: 500;
  color: #fff;
  letter-spacing: -0.28px;
  text-shadow: 0px 0px 3px rgba(0, 0, 0, 0.3);
  white-space: nowrap;

  &::before {
    content: '';
    display: block;
    width: 20px;
    height: 20px;
    margin-right: 7px;
    background: url('${({ $isEvent }) =>
        $isEvent ? HOME_MAP.PANEL.EVENT : HOME_MAP.PANEL.FAC}')
      no-repeat center / 100%;
  }
`;

const StyledValue = styled.p<{ $isEvent: boolean }>`
  width: 54px;
  font-size: 18px;
  font-weight: 700;
  text-align: right;
  color: ${({ $isEvent }) => ($isEvent ? '#FF4747' : 'rgb(255,210,87)')};
`;
