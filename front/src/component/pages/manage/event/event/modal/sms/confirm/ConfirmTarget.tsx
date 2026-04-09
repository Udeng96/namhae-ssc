import styled from 'styled-components';
import { CommonScrollBar, CommonScrollBox } from '@/component/lib/css';

interface Props {
  targetList: string[];
}

const ConfirmTarget = ({ targetList }: Props) => (
  <StyledTarget>
    <StyledTitle>전파대상</StyledTitle>
    <StyledContent>
      <StyledScroll>
        {targetList.map((target) => (
          <StyledItem key={target}>
            <p>{target}</p>
          </StyledItem>
        ))}
      </StyledScroll>
    </StyledContent>
  </StyledTarget>
);

export default ConfirmTarget;

/* ─── Styled ─────────────────────────────────────────── */
const StyledTarget = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: auto;
  gap: 6px;
`;

const StyledTitle = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 33px;
  border-radius: 90px;
  background-color: rgba(167,167,240,.1);
  padding: 11px 10px;
  color: #b4aff3;
`;

const StyledContent = styled.div`
  width: 100%;
  height: 204px;
  padding: 10px;
  border-radius: 6px;
  border: 1px solid #201E4A;
  background: #262552;
  overflow: hidden;
`;

const StyledScroll = styled.div`
  ${CommonScrollBox};
  ${CommonScrollBar};
  display: flex;
  flex-wrap: wrap;
  justify-content: space-evenly;
`;

const StyledItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  width: 156px;
  height: 28px;
  padding: 5px;
  border-radius: 4px;
  border: solid 1px #5e6294;
  background-color: #3b3b6b;

  p {
    width: 100%;
    font-size: 11px;
    line-height: 1;
    color: #fff;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
`;
