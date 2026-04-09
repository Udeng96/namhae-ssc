import styled from 'styled-components';
import { EVENT_IMAGE } from '@/component/lib/eventImage';
import FireLastEventRightDetail from './FireLastEventRightDetail';

const FireLastEventRight = () => (
  <StyledRight>
    <StyledRightHead>
      <StyledRightTitle>선택 이벤트 상세내용</StyledRightTitle>
    </StyledRightHead>
    <StyledRightBody>
      <FireLastEventRightDetail />
    </StyledRightBody>
  </StyledRight>
);

export default FireLastEventRight;

const StyledRight = styled.div`
  width: 388px;
`;

const StyledRightHead = styled.div`
  margin-bottom: 9px;
`;

const StyledRightTitle = styled.h3`
  display: flex;
  align-items: center;
  font-size: 15px;
  font-weight: 500;
  color: #f2f4fc;

  &:before {
    content: '';
    display: inline-block;
    width: 20px;
    height: 20px;
    margin-right: 7px;
    background-size: 100%;
    background-image: url('${EVENT_IMAGE.CONTENT.MODAL.DETAIL_ICON}');
  }
`;

const StyledRightBody = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 375px;
  padding: 15px;
  color: #a8afbd;
  font-size: 13px;
  border-radius: 8px;
  border: 1px solid #3e4165;
  background: #0f1223;
`;
