import styled from 'styled-components';
import { EventResultItem } from '@/component/types/event';
import { CommonScrollBar } from '@/component/lib/css';
import FireMoreBtnConf from './FireMoreBtnConf';

interface Props {
  eventItem: EventResultItem;
}

const FireSuccessMore = ({ eventItem }: Props) => (
  <StyledMore>
    <StyledTextArea
      placeholder="이벤트 내용이 없습니다."
      value={eventItem.statEvetCntn}
      disabled
    />
    <StyledBtnArea>
      <FireMoreBtnConf item={eventItem} />
    </StyledBtnArea>
  </StyledMore>
);

export default FireSuccessMore;

const StyledMore = styled.div`
  display: flex;
  gap: 0 8px;
  margin-top: 8px;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
`;

const StyledTextArea = styled.textarea`
  ${CommonScrollBar};
  width: 308px;
  height: 64px;
  padding: 10px 10px 10px 14px;
  font-size: 13px;
  font-weight: 300;
  color: #fff;
  border-radius: 5px;
  border: 1px solid #4b4680;
  background: #3a336e;
  resize: none;
`;

const StyledBtnArea = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
`;
